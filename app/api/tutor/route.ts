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

interface TutorRequestBody {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  context?: {
    targetRole?: string;
    currentTopic?: string;
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
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.message || !body.message.trim()) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  const contextLine = body.context
    ? `Student's target role: ${body.context.targetRole ?? "unspecified"}. Current roadmap topic: ${
        body.context.currentTopic ?? "unspecified"
      }.`
    : "";

  // Gemini uses "user" and "model" roles (not "assistant")
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

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return NextResponse.json(
        { error: `The AI service returned an error (status ${response.status}).` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a response that time — try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Failed to reach Gemini API:", err);
    return NextResponse.json(
      { error: "Couldn't reach the AI service. Check your internet connection and try again." },
      { status: 500 }
    );
  }
}
