"use client";

import { Map, BarChart3, Bot, Briefcase, Gauge, Route } from "lucide-react";

export type DashboardTab = "roadmap" | "analytics" | "tutor" | "projects" | "readiness";

const NAV_ITEMS: { key: DashboardTab; label: string; icon: typeof Map }[] = [
  { key: "roadmap", label: "Roadmap", icon: Map },
  { key: "analytics", label: "Skill Gaps", icon: BarChart3 },
  { key: "tutor", label: "AI Tutor", icon: Bot },
  { key: "projects", label: "Projects", icon: Briefcase },
  { key: "readiness", label: "Readiness", icon: Gauge },
];

export function Sidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}) {
  return (
    <aside className="flex w-full items-center gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 md:sticky md:top-0 md:h-screen md:w-20 md:flex-col md:justify-start md:gap-1 md:overflow-visible md:border-b-0 md:border-r md:px-0 md:py-5">
      <div className="mb-0 mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary md:mb-4 md:mr-0">
        <Route size={18} />
      </div>
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            title={label}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-medium transition-colors md:w-16 md:px-0 ${
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon size={18} />
            <span className="hidden md:inline">{label}</span>
          </button>
        );
      })}
    </aside>
  );
}