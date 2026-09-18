"use client";

import { useEffect, useState } from "react";
import { AppState } from "@/lib/types";
import { loadState, saveState, clearState, emptyState } from "@/lib/storage";
import {
  generateRoadmap,
  generateProjects,
  computeReadiness,
  detectStruggle,
} from "@/lib/mockEngine";
import { StudentProfileForm } from "./StudentProfileForm";
import { SkillAssessment } from "./SkillAssessment";
import { SkillGapChart } from "./SkillGapChart";
import { RoadmapView } from "./Roadmap";
import { AITutor } from "./AITutor";
import { InterventionModal } from "./InterventionModal";
import { ProjectsTracker } from "./ProjectsTracker";
import { ReadinessGauge } from "./ReadinessGauge";
import { Button } from "./ui/Button";
import {
  LayoutDashboard,
  BarChart3,
  Map,
  Bot,
  Briefcase,
  Gauge,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

type Phase = "profile" | "assessment" | "dashboard";
type Tab = "roadmap" | "analytics" | "tutor" | "projects" | "readiness";

export function Dashboard() {
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("roadmap");
  const [activeIntervention, setActiveIntervention] = useState<
    ReturnType<typeof detectStruggle>
  >(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading EduPath…
      </div>
    );
  }

  const phase: Phase = !state.profile
    ? "profile"
    : !state.assessment
    ? "assessment"
    : "dashboard";

  function checkForStruggle(updatedRoadmap: typeof state.roadmap) {
    if (!updatedRoadmap) return;
    for (const topic of updatedRoadmap.topics) {
      const event = detectStruggle(topic);
      if (event) {
        setActiveIntervention(event);
        setState((s) => ({
          ...s,
          interventions: [...s.interventions, event],
        }));
        break;
      }
    }
  }

  function handleSimulateFailure(topicId: string) {
    if (!state.roadmap) return;
    const updatedTopics = state.roadmap.topics.map((t) =>
      t.id === topicId
        ? {
            ...t,
            quizFailCount: t.quizFailCount + 1,
            timeSpentSeconds: t.timeSpentSeconds + 60 * 12,
          }
        : t
    );
    const updatedRoadmap = { ...state.roadmap, topics: updatedTopics };
    setState((s) => ({ ...s, roadmap: updatedRoadmap }));
    checkForStruggle(updatedRoadmap);
  }

  function handleRestart() {
    clearState();
    setState(emptyState);
    setActiveTab("roadmap");
  }

  if (phase === "profile") {
    return (
      <main className="min-h-screen px-4 py-10">
        <StudentProfileForm
          onComplete={(profile) => setState((s) => ({ ...s, profile }))}
        />
      </main>
    );
  }

  if (phase === "assessment") {
    return (
      <main className="min-h-screen px-4 py-10">
        <SkillAssessment
          targetRole={state.profile!.targetRole}
          attemptNumber={(state.assessment?.attemptNumber ?? 0) + 1}
          onComplete={(assessment) => {
            const roadmap = generateRoadmap(state.profile!, assessment.skillScores);
            const projects = generateProjects(state.profile!.targetRole, assessment.skillScores);
            setState((s) => ({ ...s, assessment, roadmap, projects }));
          }}
        />
      </main>
    );
  }

  // phase === "dashboard"
  const readiness = computeReadiness(
    state.assessment!.overallScore,
    state.roadmap,
    state.projects
  );

  const tabs: { key: Tab; label: string; icon: typeof Map }[] = [
    { key: "roadmap", label: "Roadmap", icon: Map },
    { key: "analytics", label: "Skill Gaps", icon: BarChart3 },
    { key: "tutor", label: "AI Tutor", icon: Bot },
    { key: "projects", label: "Projects", icon: Briefcase },
    { key: "readiness", label: "Readiness", icon: Gauge },
  ];

  return (
    <main className="min-h-screen pb-16">
      {activeIntervention && (
        <InterventionModal
          event={activeIntervention}
          onDismiss={() => setActiveIntervention(null)}
        />
      )}

      <header className="border-b border-border bg-card/50 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                EduPath — {state.profile?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Targeting: {state.profile?.targetRole.replace(/-/g, " ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setState((s) => ({ ...s, assessment: null }))}
            >
              <Sparkles size={14} /> Retake Assessment
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRestart}>
              <RefreshCcw size={14} /> Start Over
            </Button>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {activeTab === "analytics" && (
          <SkillGapChart
            skillScores={state.assessment!.skillScores}
            overallScore={state.assessment!.overallScore}
          />
        )}

        {activeTab === "roadmap" && state.roadmap && (
          <RoadmapView
            roadmap={state.roadmap}
            onRoadmapChange={(roadmap) => {
              setState((s) => ({ ...s, roadmap }));
              checkForStruggle(roadmap);
            }}
            onSimulateFailure={handleSimulateFailure}
          />
        )}

        {activeTab === "tutor" && (
          <AITutor
            messages={state.chatMessages}
            onMessagesChange={(chatMessages) => setState((s) => ({ ...s, chatMessages }))}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsTracker
            projects={state.projects}
            onProjectsChange={(projects) => setState((s) => ({ ...s, projects }))}
          />
        )}

        {activeTab === "readiness" && <ReadinessGauge breakdown={readiness} />}
      </div>
    </main>
  );
}
