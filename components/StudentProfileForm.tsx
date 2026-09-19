"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input, Label, Select } from "./ui/Basics";
import { ROLES } from "@/lib/mockEngine";
import { BackgroundLevel, LearningStyle, RoleId, StudentProfile } from "@/lib/types";
import { GraduationCap } from "lucide-react";

export function StudentProfileForm({
  onComplete,
}: {
  onComplete: (profile: StudentProfile) => void;
}) {
  const [name, setName] = useState("");
  const [background, setBackground] = useState<BackgroundLevel>("beginner");
  const [learningStyle, setLearningStyle] = useState<LearningStyle>("mixed");
  const [weeklyHours, setWeeklyHours] = useState(6);
  const [targetRole, setTargetRole] = useState<RoleId>("frontend-engineer");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name so your roadmap can be personalized.");
      return;
    }
    setError("");
    onComplete({
      name: name.trim(),
      background,
      learningStyle,
      weeklyHours,
      targetRole,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <GraduationCap size={22} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Welcome to EduPath</h1>
          <p className="text-sm text-muted-foreground">
            Let's build your personalized learning plan.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Profile & Goal Selection</CardTitle>
          <CardDescription>
            This tells the roadmap engine how to calibrate difficulty and pacing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Lee"
              />
              {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
            </div>

            <div>
              <Label htmlFor="role">Target job role</Label>
              <Select
                id="role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as RoleId)}
              >
                {ROLES.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                {ROLES.find((r) => r.id === targetRole)?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="background">Current background</Label>
                <Select
                  id="background"
                  value={background}
                  onChange={(e) => setBackground(e.target.value as BackgroundLevel)}
                >
                  <option value="beginner">Beginner — new to this field</option>
                  <option value="intermediate">Intermediate — some experience</option>
                  <option value="advanced">Advanced — mostly refining skills</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="style">Preferred learning style</Label>
                <Select
                  id="style"
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value as LearningStyle)}
                >
                  <option value="visual">Visual (videos, diagrams)</option>
                  <option value="reading">Reading (docs, articles)</option>
                  <option value="hands-on">Hands-on (building & practice)</option>
                  <option value="mixed">Mixed</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="hours">
                Hours you can realistically study per week: {weeklyHours}
              </Label>
              <input
                id="hours"
                type="range"
                min={1}
                max={30}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Continue to Skill Assessment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}