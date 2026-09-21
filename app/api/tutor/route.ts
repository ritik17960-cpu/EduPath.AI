import { NextRequest, NextResponse } from "next/server";

// This route runs on the SERVER only, so your API key never reaches the browser.
export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the AI Tutor inside EduPath, a personalized learning platform.
You help a student who is working through a skills roadmap toward a specific job role.
Be encouraging, concrete, and concise (usually 2-5 sentences unless the question needs more).
When relevant, suggest a next concrete action (a resource type to try, a smaller practice
exercise, or a way to break the concept down). Avoid generic filler like "great question" —
get straight to substance. If the student seems discouraged, briefly acknowledge that before
moving to something actionable.`;

const PRIMARY_MODEL = "gemini-3.6-flash";
const FALLBACK_MODEL = "gemini-3.5-flash-lite";

const MAX_RETRIES = 1;
const REQUEST_TIMEOUT_MS = 15_000;

// Gemini recommends retrying transient 429/5xx errors with exponential backoff.
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

interface TutorRequestBody {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  context?: {
    targetRole?: string;
    currentTopic?: string;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
    status?: string;
    code?: number;
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getRetryDelay(attempt: number) {
  // 800ms, 1600ms, 3200ms + small jitter.
  const exponentialDelay = 800 * 2 ** attempt;
  const jitter = Math.floor(Math.random() * 300);
  return exponentialDelay + jitter;
}

async function requestGemini(
  model: string,
  apiKey: string,
  requestBody: Record<string, unknown>
): Promise<
  | { ok: true; reply: string; model: string }
  | { ok: false; status: number; errorText: string; model: string }
> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (response.ok) {
        const data = (await response.json()) as GeminiResponse;
        const reply = data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("")
          .trim();

        if (reply) {
          return { ok: true, reply, model };
        }

        console.error("Gemini returned no usable text:", {
          model,
          response: data,
        });

        return {
          ok: false,
          status: 502,
          errorText: "Gemini returned an empty response.",
          model,
        };
      }

      const errorText = await response.text();

      console.error("Gemini API error:", {
        model,
        attempt: attempt + 1,
        status: response.status,
        body: errorText,
      });

      // Do not retry permanent errors such as invalid keys, bad requests,
      // forbidden access, or an invalid model name.
      if (!RETRYABLE_STATUS_CODES.has(response.status) || attempt === MAX_RETRIES) {
        return {
          ok: false,
          status: response.status,
          errorText,
          model,
        };
      }

      await sleep(getRetryDelay(attempt));
    } catch (error) {
      clearTimeout(timeout);

      const isTimeout =
        error instanceof DOMException && error.name === "AbortError";

      console.error("Gemini network/timeout error:", {
        model,
        attempt: attempt + 1,
        error,
      });

      // Network failures and timeouts are transient, so retry them.
      if (attempt === MAX_RETRIES) {
        return {
          ok: false,
          status: 504,
          errorText: isTimeout
            ? "Gemini request timed out."
            : "Could not reach the Gemini API.",
          model,
        };
      }

      await sleep(getRetryDelay(attempt));
    }
  }

  return {
    ok: false,
    status: 503,
    errorText: "Gemini service unavailable after retries.",
    model,
  };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "No GEMINI_API_KEY found on the server. Add it to a .env.local file and restart `npm run dev`.",
      },
      { status: 500 }
    );
  }

  let body: TutorRequestBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body.message || !body.message.trim()) {
    return NextResponse.json(
      { error: "Message cannot be empty." },
      { status: 400 }
    );
  }

  const contextLine = body.context
    ? `Student's target role: ${body.context.targetRole ?? "unspecified"}. Current roadmap topic: ${body.context.currentTopic ?? "unspecified"}.`
    : "";

  // Gemini uses "user" and "model" roles (not "assistant").
  const contents = [
    ...(body.history ?? []).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    })),
    {
      role: "user" as const,
      parts: [
        {
          text: contextLine ? `${contextLine}\n\n${body.message}` : body.message,
        },
      ],
    },
  ];

  const requestBody = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 500,
      thinkingConfig: {
        thinkingLevel: "low",
      },
    },
  };

  // First try the primary model. Transient failures are retried automatically.
  let result = await requestGemini(
    PRIMARY_MODEL,
    apiKey,
    requestBody
  );

  // If Gemini is temporarily overloaded/unavailable, try a second stable,
  // lower-latency model after the primary model's retries are exhausted.
  if (!result.ok && RETRYABLE_STATUS_CODES.has(result.status)) {
    console.warn(
      `Primary model ${PRIMARY_MODEL} failed with ${result.status}. Falling back to ${FALLBACK_MODEL}.`
    );

    result = await requestGemini(
      FALLBACK_MODEL,
      apiKey,
      requestBody
    );
  }

  if (result.ok) {
    return NextResponse.json({
      reply: result.reply,
      model: result.model,
    });
  }

  // Keep internal Gemini error details in server logs, but return a useful,
  // user-safe message to the browser.
  if (result.status === 401 || result.status === 403) {
    return NextResponse.json(
      {
        error:
          "The Gemini API key was rejected. Check GEMINI_API_KEY and its API permissions.",
      },
      { status: 502 }
    );
  }

  if (result.status === 404) {
    return NextResponse.json(
      {
        error:
          "The configured Gemini model was not found. Check the model name in the tutor API route.",
      },
      { status: 502 }
    );
  }

  if (result.status === 429) {
    return NextResponse.json(
      {
        error:
          "The AI service is temporarily rate-limited. Please wait a moment and try again.",
      },
      { status: 429 }
    );
  }

  if (result.status === 503) {
    return NextResponse.json(
      {
        error:
          "The AI service is temporarily unavailable. The tutor retried automatically and switched models, but both were unavailable. Please try again in a moment.",
      },
      { status: 503 }
    );
  }

  if (result.status === 504) {
    return NextResponse.json(
      {
        error:
          "The AI service took too long to respond. Please try again.",
      },
      { status: 504 }
    );
  }

  return NextResponse.json(
    {
      error:
        "The AI service could not process your request right now. Please try again.",
    },
    { status: 502 }
  );
}
