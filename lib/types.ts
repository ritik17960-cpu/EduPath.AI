export type BackgroundLevel = "beginner" | "intermediate" | "advanced";

export type LearningStyle = "visual" | "reading" | "hands-on" | "mixed";

export type RoleId =
  | "frontend-engineer"
  | "backend-engineer"
  | "data-scientist"
  | "fullstack-engineer"
  | "devops-engineer";

export interface StudentProfile {
  name: string;
  background: BackgroundLevel;
  learningStyle: LearningStyle;
  weeklyHours: number;
  targetRole: RoleId;
  createdAt: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  weight: number; // importance of this skill for the role, 1-5
}

export interface RoleDefinition {
  id: RoleId;
  label: string;
  description: string;
  skills: SkillDefinition[];
}

export interface QuizQuestion {
  id: string;
  skillId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizAnswerRecord {
  questionId: string;
  skillId: string;
  correct: boolean;
  timeTakenSeconds: number;
}

export interface SkillScore {
  skillId: string;
  skillName: string;
  weight: number;
  correct: number;
  total: number;
  percentage: number;
  isGap: boolean;
}

export interface AssessmentResult {
  completedAt: string;
  answers: QuizAnswerRecord[];
  skillScores: SkillScore[];
  overallScore: number;
  attemptNumber: number;
}

export interface LearningResource {
  title: string;
  type: "article" | "video" | "docs" | "course";
  url: string;
}

export interface PracticeTask {
  id: string;
  prompt: string;
  completed: boolean;
}

export interface RoadmapTopic {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  summary: string;
  priority: "high" | "medium" | "low";
  estimatedHours: number;
  resources: LearningResource[];
  practiceTasks: PracticeTask[];
  notes: string;
  status: "not-started" | "in-progress" | "completed";
  quizFailCount: number;
  timeSpentSeconds: number;
}

export interface Roadmap {
  generatedAt: string;
  targetRole: RoleId;
  topics: RoadmapTopic[];
}

export interface InterventionEvent {
  id: string;
  topicId: string;
  topicTitle: string;
  reason: "repeated-failure" | "time-exceeded" | "low-engagement";
  message: string;
  suggestion: string;
  createdAt: string;
  resolved: boolean;
}

export interface ProjectChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface RealWorldProject {
  id: string;
  title: string;
  description: string;
  relatedSkillIds: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  checklist: ProjectChecklistItem[];
}

export interface ChatMessage {
  id: string;
  role: "tutor" | "student";
  text: string;
  createdAt: string;
}

export interface ReadinessBreakdown {
  assessmentComponent: number;
  notesComponent: number;
  tasksComponent: number;
  projectsComponent: number;
  total: number;
}

export interface AppState {
  profile: StudentProfile | null;
  assessment: AssessmentResult | null;
  roadmap: Roadmap | null;
  interventions: InterventionEvent[];
  projects: RealWorldProject[];
  chatMessages: ChatMessage[];
}
