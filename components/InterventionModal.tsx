"use client";

import { InterventionEvent } from "@/lib/types";
import { Button } from "./ui/Button";
import { AlertTriangle, X } from "lucide-react";

export function InterventionModal({
  event,
  onDismiss,
}: {
  event: InterventionEvent;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={20} />
          </div>
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
        <h2 className="mb-1 text-base font-semibold">Adaptive Intervention Strategy</h2>
        <p className="mb-3 text-sm text-muted-foreground">{event.message}</p>
        <div className="mb-5 rounded-md bg-muted p-3 text-sm">
          <span className="font-medium">Suggested next step: </span>
          {event.suggestion}
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onDismiss}>
            Got it, let's adjust
          </Button>
        </div>
      </div>
    </div>
  );
}
