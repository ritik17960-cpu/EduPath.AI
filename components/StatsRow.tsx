"use client";

import { ReadinessBreakdown, Roadmap, RealWorldProject } from "@/lib/types";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 p-3.5">
      <p className="mb-1.5 text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold leading-none">{value}</p>
    </div>
  );
}

export function StatsRow({
  readiness,
  roadmap,
  projects,
}: {
  readiness: ReadinessBreakdown;
  roadmap: Roadmap | null;
  projects: RealWorldProject[];
}) {
  const topicsDone = roadmap ? roadmap.topics.filter((t) => t.status === "completed").length : 0;
  const topicsTotal = roadmap?.topics.length ?? 0;

  const practiceTotal = roadmap
    ? roadmap.topics.reduce((sum, t) => sum + t.practiceTasks.length, 0)
    : 0;
  const practiceDone = roadmap
    ? roadmap.topics.reduce(
        (sum, t) => sum + t.practiceTasks.filter((task) => task.completed).length,
        0
      )
    : 0;

  const projectItemsTotal = projects.reduce((sum, p) => sum + p.checklist.length, 0);
  const projectItemsDone = projects.reduce(
    (sum, p) => sum + p.checklist.filter((c) => c.completed).length,
    0
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Readiness" value={`${readiness.total}%`} />
      <StatCard label="Topics done" value={`${topicsDone}/${topicsTotal}`} />
      <StatCard label="Practice done" value={`${practiceDone}/${practiceTotal}`} />
      <StatCard label="Project items done" value={`${projectItemsDone}/${projectItemsTotal}`} />
    </div>
  );
}