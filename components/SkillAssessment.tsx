"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress, Badge } from "./ui/Basics";
import { getQuizForRole, analyzeSkillGaps, computeOverallScore } from "@/lib/mockEngine";
import { AssessmentResult, QuizAnswerRecord, RoleId } from "@/lib/types";
import { CheckCircle2, ClipboardList } from "lucide-react";

export function SkillAssessment({
  targetRole,
  attemptNumber,
  onComplete,
}: {
  targetRole: RoleId;
  attemptNumber: number;
  onComplete: (result: AssessmentResult) => void;
}) {
  const questions = useMemo(() => getQuizForRole(targetRole), [targetRole]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [questionStart, setQuestionStart] = useState(() => Date.now());

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  function handleNext() {
    if (selected === null) return;
    const timeTakenSeconds = Math.max(1, Math.round((Date.now() - questionStart) / 1000));
    const record: QuizAnswerRecord = {
      questionId: currentQuestion.id,
      skillId: currentQuestion.skillId,
      correct: selected === currentQuestion.correctIndex,
      timeTakenSeconds,
    };
    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);
    setSelected(null);
    setQuestionStart(Date.now());

    if (isLast) {
      const skillScores = analyzeSkillGaps(targetRole, nextAnswers);
      const overallScore = computeOverallScore(skillScores);
      onComplete({
        completedAt: new Date().toISOString(),
        answers: nextAnswers,
        skillScores,
        overallScore,
        attemptNumber,
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <ClipboardList size={22} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Skill Assessment</h1>
          <p className="text-sm text-muted-foreground">
            {attemptNumber > 1
              ? `Retake #${attemptNumber - 1} — let's see how much you've closed the gap.`
              : "Answer honestly — this calibrates your entire roadmap."}
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <Badge variant="outline">{currentQuestion.difficulty}</Badge>
      </div>
      <Progress value={((currentIndex + (selected !== null ? 0.5 : 0)) / questions.length) * 100} className="mb-6" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base leading-snug">{currentQuestion.prompt}</CardTitle>
          <CardDescription>Skill: {currentQuestion.skillId.replace(/-/g, " ")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selected === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <span>{option}</span>
                  {isSelected && <CheckCircle2 size={18} className="text-primary" />}
                </button>
              );
            })}
          </div>

          <Button
            className="mt-6 w-full"
            size="lg"
            disabled={selected === null}
            onClick={handleNext}
          >
            {isLast ? "Finish Assessment" : "Next Question"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}