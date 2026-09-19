"use client";

import { Search, Bell, RefreshCcw, Sparkles } from "lucide-react";
import { Input } from "./ui/Basics";
import { Button } from "./ui/Button";

export function TopBar({
  studentName,
  targetRole,
  searchQuery,
  onSearchChange,
  unresolvedCount,
  onRetake,
  onRestart,
}: {
  studentName: string;
  targetRole: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  unresolvedCount: number;
  onRetake: () => void;
  onRestart: () => void;
}) {
  const initials = studentName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search topics or projects..."
            className="pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="sm" title="Retake assessment" onClick={onRetake}>
            <Sparkles size={15} />
            <span className="hidden sm:inline">Retake</span>
          </Button>
          <Button variant="ghost" size="sm" title="Start over" onClick={onRestart}>
            <RefreshCcw size={15} />
            <span className="hidden sm:inline">Start over</span>
          </Button>

          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Notifications${unresolvedCount > 0 ? `, ${unresolvedCount} unread` : ""}`}
            title="Notifications"
          >
            <Bell size={17} />
            {unresolvedCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            )}
          </button>

          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
            title={studentName}
          >
            {initials || "?"}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-base font-semibold leading-tight">Welcome back, {studentName}</p>
        <p className="text-xs text-muted-foreground">
          Targeting: {targetRole.replace(/-/g, " ")}
        </p>
      </div>
    </header>
  );
}