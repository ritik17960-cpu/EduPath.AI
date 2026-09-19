"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Input } from "./ui/Basics";
import { Button } from "./ui/Button";
import { Bot, Send, User, AlertCircle } from "lucide-react";

export function AITutor({
  messages,
  onMessagesChange,
  targetRole,
  currentTopic,
}: {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  targetRole?: string;
  currentTopic?: string;
}) {
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || isTyping) return;

    setError("");
    const studentMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "student",
      text,
      createdAt: new Date().toISOString(),
    };
    const updated = [...messages, studentMessage];
    onMessagesChange(updated);
    setDraft("");
    setIsTyping(true);

    try {
      const history = updated
        .slice(-10) // keep the last 10 turns so requests stay small
        .map((m) => ({
          role: (m.role === "tutor" ? "assistant" : "user") as "assistant" | "user",
          content: m.text,
        }));
      // Remove the last item since it's the current message, sent separately.
      history.pop();

      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          context: { targetRole, currentTopic },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong talking to the AI Tutor.");
      }

      const tutorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "tutor",
        text: data.reply,
        createdAt: new Date().toISOString(),
      };
      onMessagesChange([...updated, tutorMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <Card className="flex h-[560px] flex-col animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={18} className="text-primary" /> AI Tutor
        </CardTitle>
        <CardDescription>
          Powered by Claude — ask anything about what you're learning.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden pt-0">
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Hi! I'm your AI Tutor. Tell me what you're working on, or ask why something
              isn't clicking.
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${
                m.role === "student" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  m.role === "tutor"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {m.role === "tutor" ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                  m.role === "tutor"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Bot size={14} />
              </div>
              <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                thinking…
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 border-t pt-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="I'm stuck on..."
            disabled={isTyping}
          />
          <Button type="submit" size="icon" aria-label="Send message" disabled={isTyping}>
            <Send size={16} />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}