"use client";

import { useState } from "react";
import { Roadmap as RoadmapType, RoadmapTopic } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Badge, Progress, Textarea } from "./ui/Basics";
import { Button } from "./ui/Button";
import {
  BookOpen,
  FileText,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

const priorityVariant: Record<RoadmapTopic["priority"], "danger" | "warning" | "outline"> = {
  high: "danger",
  medium: "warning",
  low: "outline",
};

function TopicCard({
  topic,
  onUpdate,
  onSimulateFailure,
}: {
  topic: RoadmapTopic;
  onUpdate: (topic: RoadmapTopic) => void;
  onSimulateFailure: (topicId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"learn" | "notes" | "practice">("learn");

  const completedTasks = topic.practiceTasks.filter((t) => t.completed).length;
  const totalTasks = topic.practiceTasks.length;

  function toggleTask(taskId: string) {
    const updatedTasks = topic.practiceTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const allDone = updatedTasks.every((t) => t.completed);
    onUpdate({
      ...topic,
      practiceTasks: updatedTasks,
      status: allDone ? "completed" : "in-progress",
    });
  }

  function updateNotes(notes: string) {
    onUpdate({
      ...topic,
      notes,
      status: topic.status === "not-started" ? "in-progress" : topic.status,
      timeSpentSeconds: topic.timeSpentSeconds + 5,
    });
  }

  return (
    <Card className="animate-fade-in">
      <button
        className="flex w-full items-center justify-between p-5 text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <CardTitle className="text-sm">{topic.title}</CardTitle>
            <Badge variant={priorityVariant[topic.priority]}>{topic.priority} priority</Badge>
            {topic.status === "completed" && (
              <Badge variant="success">
                <CheckCircle size={12} className="mr-1" /> Completed
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{topic.summary}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={12} /> ~{topic.estimatedHours}h
            </span>
            <span>
              Practice: {completedTasks}/{totalTasks}
            </span>
          </div>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expanded && (
        <CardContent className="border-t pt-4">
          <div className="mb-4 flex gap-1 rounded-md bg-muted p-1 text-sm">
            {[
              { key: "learn", label: "Learn", icon: BookOpen },
              { key: "notes", label: "Notes", icon: FileText },
              { key: "practice", label: "Practice", icon: Dumbbell },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm py-1.5 transition-colors ${
                  activeTab === key
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {activeTab === "learn" && (
            <div className="space-y-2">
              {topic.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {resource.type}
                    </Badge>
                    {resource.title}
                  </span>
                  <ExternalLink size={14} className="text-muted-foreground" />
                </a>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onSimulateFailure(topic.id)}
              >
                <RotateCcw size={14} /> Simulate a failed practice check
              </Button>
              <p className="text-xs text-muted-foreground">
                (Demonstrates the Struggle Detection system — normally this
                triggers automatically after real quiz attempts.)
              </p>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <Textarea
                rows={6}
                value={topic.notes}
                onChange={(e) => updateNotes(e.target.value)}
                placeholder={`Write what you learned about ${topic.skillName} in your own words...`}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Notes auto-save locally and contribute to your Job-Readiness score.
              </p>
            </div>
          )}

          {activeTab === "practice" && (
            <div className="space-y-2">
              {topic.practiceTasks.map((task) => (
                <label
                  key={task.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span className={task.completed ? "text-muted-foreground line-through" : ""}>
                    {task.prompt}
                  </span>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export function RoadmapView({
  roadmap,
  onRoadmapChange,
  onSimulateFailure,
}: {
  roadmap: RoadmapType;
  onRoadmapChange: (roadmap: RoadmapType) => void;
  onSimulateFailure: (topicId: string) => void;
}) {
  const completedCount = roadmap.topics.filter((t) => t.status === "completed").length;

  function updateTopic(updated: RoadmapTopic) {
    onRoadmapChange({
      ...roadmap,
      topics: roadmap.topics.map((t) => (t.id === updated.id ? updated : t)),
    });
  }

  return (
    <div className="animate-fade-in space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Personalized Roadmap</CardTitle>
          <CardDescription>
            Topics are ordered by urgency (low score × high role-importance first).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>
              {completedCount} of {roadmap.topics.length} topics completed
            </span>
            <span className="text-muted-foreground">
              {Math.round((completedCount / roadmap.topics.length) * 100)}%
            </span>
          </div>
          <Progress value={(completedCount / roadmap.topics.length) * 100} />
        </CardContent>
      </Card>

      {roadmap.topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onUpdate={updateTopic}
          onSimulateFailure={onSimulateFailure}
        />
      ))}
    </div>
  );
}
