"use client";

import { ReadinessBreakdown } from "@/lib/types";
import { readinessLabel } from "@/lib/mockEngine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Gauge } from "lucide-react";

function GaugeSVG({ value }: { value: number }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = 90;
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = startAngle - (value / 100) * (startAngle - endAngle);

  const arcPoint = (a: number) => ({
    x: cx + radius * Math.cos(a),
    y: cy - radius * Math.sin(a),
  });

  const start = arcPoint(startAngle);
  const end = arcPoint(endAngle);
  const needleEnd = arcPoint(angle);

  const trackPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;

  const progressLargeArc = value > 50 ? 1 : 0;
  const progressEnd = arcPoint(angle);
  const progressPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${progressLargeArc} 1 ${progressEnd.x} ${progressEnd.y}`;

  const color = value >= 80 ? "#10b981" : value >= 60 ? "#6366f1" : value >= 35 ? "#f59e0b" : "#ef4444";

  return (
    <svg viewBox={`0 0 ${size} ${size / 2 + 40}`} className="mx-auto w-full max-w-xs">
      <path
        d={trackPath}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={16}
        strokeLinecap="round"
      />
      <path
        d={progressPath}
        fill="none"
        stroke={color}
        strokeWidth={16}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={needleEnd.x}
        y2={needleEnd.y}
        stroke="hsl(var(--foreground))"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={6} fill="hsl(var(--foreground))" />
      <text x={cx} y={cy - 30} textAnchor="middle" fontSize={30} fontWeight={700} fill="hsl(var(--foreground))">
        {value}%
      </text>
    </svg>
  );
}

export function ReadinessGauge({ breakdown }: { breakdown: ReadinessBreakdown }) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge size={18} className="text-primary" /> Job-Readiness Metric
        </CardTitle>
        <CardDescription>{readinessLabel(breakdown.total)}</CardDescription>
      </CardHeader>
      <CardContent>
        <GaugeSVG value={breakdown.total} />
        <div className="mt-4 space-y-2 text-sm">
          <BreakdownRow label="Assessment performance (35%)" value={breakdown.assessmentComponent} max={35} />
          <BreakdownRow label="Notes & reflection depth (20%)" value={breakdown.notesComponent} max={20} />
          <BreakdownRow label="Practice tasks completed (25%)" value={breakdown.tasksComponent} max={25} />
          <BreakdownRow label="Project milestones shipped (20%)" value={breakdown.projectsComponent} max={20} />
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}/{max}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
