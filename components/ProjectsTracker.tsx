"use client";

import { RealWorldProject } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Badge, Progress } from "./ui/Basics";
import { Briefcase } from "lucide-react";

const difficultyVariant: Record<RealWorldProject["difficulty"], "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

export function ProjectsTracker({
  projects,
  onProjectsChange,
  searchQuery = "",
}: {
  projects: RealWorldProject[];
  onProjectsChange: (projects: RealWorldProject[]) => void;
  searchQuery?: string;
}) {
  const query = searchQuery.trim().toLowerCase();
  const visibleProjects = query
    ? projects.filter((p) => p.title.toLowerCase().includes(query))
    : projects;

  function toggleItem(projectId: string, itemId: string) {
    onProjectsChange(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              checklist: p.checklist.map((c) =>
                c.id === itemId ? { ...c, completed: !c.completed } : c
              ),
            }
          : p
      )
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {visibleProjects.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No projects match "{searchQuery}".
        </p>
      )}
      {visibleProjects.map((project) => {
        const completed = project.checklist.filter((c) => c.completed).length;
        const total = project.checklist.length;
        return (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                </div>
                <Badge variant={difficultyVariant[project.difficulty]}>
                  {project.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {completed}/{total} milestones complete
                </span>
                <span>{Math.round((completed / total) * 100)}%</span>
              </div>
              <Progress value={(completed / total) * 100} className="mb-4" />
              <div className="space-y-2">
                {project.checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(project.id, item.id)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className={item.completed ? "text-muted-foreground line-through" : ""}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}