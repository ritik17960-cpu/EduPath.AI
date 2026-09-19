"use client";

import { SkillScore } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Badge } from "./ui/Basics";

function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  return `${x},${y}`;
}

function RadarChart({ skills }: { skills: SkillScore[] }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = 120;
  const levels = [20, 40, 60, 80, 100];
  const angleStep = (2 * Math.PI) / skills.length;

  const points = skills
    .map((s, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const r = (s.percentage / 100) * maxRadius;
      return polarPoint(cx, cy, r, angle);
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-sm">
      {levels.map((level) => (
        <polygon
          key={level}
          points={skills
            .map((_, i) => {
              const angle = -Math.PI / 2 + i * angleStep;
              const r = (level / 100) * maxRadius;
              return polarPoint(cx, cy, r, angle);
            })
            .join(" ")}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />
      ))}
      {skills.map((_, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const end = polarPoint(cx, cy, maxRadius, angle);
        const [x2, y2] = end.split(",").map(Number);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={points}
        fill="hsl(var(--primary) / 0.25)"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
      />
      {skills.map((s, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const labelPoint = polarPoint(cx, cy, maxRadius + 26, angle);
        const [x, y] = labelPoint.split(",").map(Number);
        return (
          <text
            key={s.skillId}
            x={x}
            y={y}
            fontSize={9}
            textAnchor="middle"
            fill="hsl(var(--muted-foreground))"
          >
            {s.skillName.length > 16 ? s.skillName.slice(0, 14) + "…" : s.skillName}
          </text>
        );
      })}
    </svg>
  );
}

function BarChart({ skills }: { skills: SkillScore[] }) {
  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.skillId}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">{skill.skillName}</span>
            <span className="text-muted-foreground">
              {skill.correct}/{skill.total} correct — {skill.percentage}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${
                skill.isGap ? "bg-destructive" : "bg-emerald-500"
              }`}
              style={{ width: `${skill.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkillGapChart({
  skillScores,
  overallScore,
}: {
  skillScores: SkillScore[];
  overallScore: number;
}) {
  const gaps = skillScores.filter((s) => s.isGap);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>
              Weighted overall readiness score: {overallScore}%
            </CardDescription>
          </div>
          <Badge variant={gaps.length > 0 ? "warning" : "success"}>
            {gaps.length} gap{gaps.length === 1 ? "" : "s"} found
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <RadarChart skills={skillScores} />
          <BarChart skills={skillScores} />
        </div>
      </CardContent>
    </Card>
  );
}