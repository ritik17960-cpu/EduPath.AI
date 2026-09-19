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
import { Sidebar, DashboardTab } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatsRow } from "./StatsRow";

type Phase = "profile" | "assessment" | "dashboard";

export function Dashboard() {
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("roadmap");
  const [searchQuery, setSearchQuery] = useState("");
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
    setSearchQuery("");
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
  const unresolvedCount = state.interventions.filter((i) => !i.resolved).length;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {activeIntervention && (
        <InterventionModal
          event={activeIntervention}
          onDismiss={() => setActiveIntervention(null)}
        />
      )}

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          studentName={state.profile?.name ?? "Student"}
          targetRole={state.profile?.targetRole ?? ""}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unresolvedCount={unresolvedCount}
          onRetake={() => setState((s) => ({ ...s, assessment: null }))}
          onRestart={handleRestart}
        />

        <main className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <StatsRow readiness={readiness} roadmap={state.roadmap} projects={state.projects} />
            </div>

            {activeTab === "analytics" && (
              <SkillGapChart
                skillScores={state.assessment!.skillScores}
                overallScore={state.assessment!.overallScore}
              />
            )}

            {activeTab === "roadmap" && state.roadmap && (
              <RoadmapView
                roadmap={state.roadmap}
                searchQuery={searchQuery}
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
                targetRole={state.profile?.targetRole}
                currentTopic={state.roadmap?.topics.find((t) => t.status !== "completed")?.title}
              />
            )}

            {activeTab === "projects" && (
              <ProjectsTracker
                projects={state.projects}
                searchQuery={searchQuery}
                onProjectsChange={(projects) => setState((s) => ({ ...s, projects }))}
              />
            )}

            {activeTab === "readiness" && <ReadinessGauge breakdown={readiness} />}
          </div>
        </main>
      </div>
    </div>
  );
}