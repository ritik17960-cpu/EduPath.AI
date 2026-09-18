"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import { generateTutorResponse } from "@/lib/mockEngine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Input } from "./ui/Basics";
import { Button } from "./ui/Button";
import { Bot, Send, User } from "lucide-react";

export function AITutor({
  messages,
  onMessagesChange,
}: {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

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

    setTimeout(() => {
      const tutorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "tutor",
        text: generateTutorResponse(text),
        createdAt: new Date().toISOString(),
      };
      onMessagesChange([...updated, tutorMessage]);
      setIsTyping(false);
    }, 700);
  }

  return (
    <Card className="flex h-[520px] flex-col animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={18} className="text-primary" /> AI Tutor
        </CardTitle>
        <CardDescription>
          Ask about anything you're stuck on — I watch your progress in the background too.
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
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
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
                typing…
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 border-t pt-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="I'm stuck on..."
          />
          <Button type="submit" size="icon" aria-label="Send message">
            <Send size={16} />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
