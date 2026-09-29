import {
  RoleDefinition,
  RoleId,
  QuizQuestion,
  QuizAnswerRecord,
  SkillScore,
  AssessmentResult,
  RoadmapTopic,
  Roadmap,
  StudentProfile,
  RealWorldProject,
  InterventionEvent,
  ReadinessBreakdown,
  LearningResource,
} from "./types";

/* -------------------------------------------------------------------------- */
/* ROLE + SKILL DEFINITIONS                                                   */
/* -------------------------------------------------------------------------- */

export const ROLES: RoleDefinition[] = [
  {
    id: "frontend-engineer",
    label: "Frontend Engineer",
    description: "Builds user-facing interfaces with modern web frameworks.",
    skills: [
      { id: "html-css", name: "HTML & CSS Fundamentals", weight: 4 },
      { id: "javascript", name: "JavaScript Core", weight: 5 },
      { id: "react", name: "React & Component Design", weight: 5 },
      { id: "state-mgmt", name: "State Management", weight: 3 },
      { id: "web-perf", name: "Web Performance", weight: 3 },
      { id: "testing-fe", name: "Frontend Testing", weight: 2 },
    ],
  },
  {
    id: "backend-engineer",
    label: "Backend Engineer",
    description: "Designs APIs, services, and data layers that power applications.",
    skills: [
      { id: "server-lang", name: "Server-Side Language Proficiency", weight: 5 },
      { id: "databases", name: "Databases & SQL", weight: 5 },
      { id: "api-design", name: "API Design (REST/GraphQL)", weight: 4 },
      { id: "auth-security", name: "Authentication & Security", weight: 4 },
      { id: "system-design", name: "System Design Basics", weight: 3 },
      { id: "testing-be", name: "Backend Testing", weight: 2 },
    ],
  },
  {
    id: "data-scientist",
    label: "Data Scientist",
    description: "Extracts insight and builds models from data.",
    skills: [
      { id: "python-ds", name: "Python for Data Analysis", weight: 5 },
      { id: "statistics", name: "Statistics & Probability", weight: 5 },
      { id: "ml-fundamentals", name: "Machine Learning Fundamentals", weight: 4 },
      { id: "data-viz", name: "Data Visualization", weight: 3 },
      { id: "sql-ds", name: "SQL for Data Retrieval", weight: 3 },
      { id: "ml-eval", name: "Model Evaluation", weight: 3 },
    ],
  },
  {
    id: "fullstack-engineer",
    label: "Full-Stack Engineer",
    description: "Comfortable across the entire application stack.",
    skills: [
      { id: "javascript", name: "JavaScript Core", weight: 4 },
      { id: "react", name: "React & Component Design", weight: 4 },
      { id: "server-lang", name: "Server-Side Language Proficiency", weight: 4 },
      { id: "databases", name: "Databases & SQL", weight: 4 },
      { id: "api-design", name: "API Design (REST/GraphQL)", weight: 4 },
      { id: "system-design", name: "System Design Basics", weight: 3 },
    ],
  },
  {
    id: "devops-engineer",
    label: "DevOps Engineer",
    description: "Automates infrastructure, deployment, and reliability.",
    skills: [
      { id: "linux-cli", name: "Linux & CLI Proficiency", weight: 4 },
      { id: "containers", name: "Containers (Docker/Kubernetes)", weight: 5 },
      { id: "ci-cd", name: "CI/CD Pipelines", weight: 4 },
      { id: "cloud-basics", name: "Cloud Platform Basics", weight: 4 },
      { id: "iac", name: "Infrastructure as Code", weight: 3 },
      { id: "monitoring", name: "Monitoring & Observability", weight: 2 },
    ],
  },
];

export function getRole(roleId: RoleId): RoleDefinition {
  const role = ROLES.find((r) => r.id === roleId);
  if (!role) throw new Error(`Unknown role: ${roleId}`);
  return role;
}

/* -------------------------------------------------------------------------- */
/* QUIZ BANK                                                                  */
/* -------------------------------------------------------------------------- */

const QUESTION_BANK: QuizQuestion[] = [
  // HTML & CSS
  { id: "q-html-1", skillId: "html-css", prompt: "Which CSS property controls the space between an element's border and its content?", options: ["margin", "padding", "gap", "outline"], correctIndex: 1, difficulty: "easy" },
  { id: "q-html-2", skillId: "html-css", prompt: "Which layout model is best suited for one-dimensional row/column alignment?", options: ["CSS Grid", "Flexbox", "Float", "Table layout"], correctIndex: 1, difficulty: "medium" },
  { id: "q-html-3", skillId: "html-css", prompt: "What does the semantic <article> tag primarily communicate?", options: ["A styling hook only", "Self-contained, independently distributable content", "A required page footer", "A JavaScript entry point"], correctIndex: 1, difficulty: "medium" },
  // JavaScript
  { id: "q-js-1", skillId: "javascript", prompt: "What does `Array.prototype.map` return?", options: ["The original array mutated", "A new array of the same length", "A single value", "undefined"], correctIndex: 1, difficulty: "easy" },
  { id: "q-js-2", skillId: "javascript", prompt: "What is a closure in JavaScript?", options: ["A syntax error", "A function bundled with references to its surrounding scope", "A CSS selector", "A type of loop"], correctIndex: 1, difficulty: "medium" },
  { id: "q-js-3", skillId: "javascript", prompt: "Which keyword declares a block-scoped, reassignable variable?", options: ["var", "let", "const", "function"], correctIndex: 1, difficulty: "easy" },
  { id: "q-js-4", skillId: "javascript", prompt: "What does `async/await` primarily help you write more readably?", options: ["CSS animations", "Promise-based asynchronous code", "Synchronous loops", "Type definitions"], correctIndex: 1, difficulty: "medium" },
  // React
  { id: "q-react-1", skillId: "react", prompt: "What triggers a React function component to re-render?", options: ["Changing a local variable", "State or prop changes", "Refreshing CSS", "Adding a comment"], correctIndex: 1, difficulty: "easy" },
  { id: "q-react-2", skillId: "react", prompt: "What is the purpose of the `useEffect` hook?", options: ["Declaring state", "Performing side effects after render", "Styling components", "Routing between pages"], correctIndex: 1, difficulty: "medium" },
  { id: "q-react-3", skillId: "react", prompt: "Why does React require a unique `key` prop on list items?", options: ["To style them", "To help React efficiently identify which items changed", "To sort them alphabetically", "It's optional and has no effect"], correctIndex: 1, difficulty: "medium" },
  // State management
  { id: "q-state-1", skillId: "state-mgmt", prompt: "What problem does global state management primarily solve?", options: ["Slow network requests", "Sharing and synchronizing data across distant components", "CSS specificity conflicts", "Browser compatibility"], correctIndex: 1, difficulty: "medium" },
  { id: "q-state-2", skillId: "state-mgmt", prompt: "What is 'prop drilling'?", options: ["A build optimization", "Passing data through many nested components to reach a deep child", "A database query technique", "A CSS animation"], correctIndex: 1, difficulty: "medium" },
  // Web performance
  { id: "q-perf-1", skillId: "web-perf", prompt: "Which technique reduces initial bundle size by loading code only when needed?", options: ["Minification only", "Code splitting / lazy loading", "Inline styles", "Using more images"], correctIndex: 1, difficulty: "medium" },
  { id: "q-perf-2", skillId: "web-perf", prompt: "What does 'Largest Contentful Paint' measure?", options: ["Total JS bundle size", "Perceived loading speed of main content", "Number of API calls", "CSS file count"], correctIndex: 1, difficulty: "hard" },
  // Frontend testing
  { id: "q-test-fe-1", skillId: "testing-fe", prompt: "What is the primary goal of a unit test?", options: ["Test the whole app end-to-end", "Verify a small isolated piece of logic behaves correctly", "Replace manual QA entirely", "Improve SEO"], correctIndex: 1, difficulty: "easy" },
  // Server-side language
  { id: "q-server-1", skillId: "server-lang", prompt: "What is the main advantage of using an ORM?", options: ["Guarantees zero bugs", "Lets you interact with a database using native language objects", "Replaces the need for a database", "Improves CSS rendering"], correctIndex: 1, difficulty: "medium" },
  { id: "q-server-2", skillId: "server-lang", prompt: "What does middleware typically do in a backend framework?", options: ["Store data permanently", "Process requests/responses before they reach the final handler", "Compile CSS", "Render HTML templates only"], correctIndex: 1, difficulty: "medium" },
  // Databases
  { id: "q-db-1", skillId: "databases", prompt: "What does a database index primarily improve?", options: ["Write-only performance", "Query lookup speed", "Data encryption", "UI rendering"], correctIndex: 1, difficulty: "medium" },
  { id: "q-db-2", skillId: "databases", prompt: "Which SQL clause is used to filter grouped results?", options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"], correctIndex: 1, difficulty: "hard" },
  { id: "q-db-3", skillId: "databases", prompt: "What does normalization primarily aim to reduce?", options: ["Query speed", "Data redundancy", "Number of tables", "Server cost"], correctIndex: 1, difficulty: "medium" },
  // API design
  { id: "q-api-1", skillId: "api-design", prompt: "In REST, which HTTP method is idempotent and used to fully replace a resource?", options: ["POST", "PUT", "PATCH", "GET"], correctIndex: 1, difficulty: "medium" },
  { id: "q-api-2", skillId: "api-design", prompt: "What is a key advantage of GraphQL over traditional REST?", options: ["It requires no server", "Clients can request exactly the fields they need", "It removes the need for authentication", "It only works with SQL databases"], correctIndex: 1, difficulty: "medium" },
  // Auth & security
  { id: "q-auth-1", skillId: "auth-security", prompt: "What is the primary purpose of hashing passwords before storage?", options: ["Faster login", "Protect plaintext passwords if the database is compromised", "Reduce storage size", "Improve UI speed"], correctIndex: 1, difficulty: "medium" },
  { id: "q-auth-2", skillId: "auth-security", prompt: "What does a JWT typically contain?", options: ["Only a password", "Encoded claims about a user, signed for verification", "A full database schema", "CSS rules"], correctIndex: 1, difficulty: "hard" },
  // System design
  { id: "q-sysd-1", skillId: "system-design", prompt: "What is the main purpose of a load balancer?", options: ["Encrypt traffic only", "Distribute incoming requests across multiple servers", "Store application logs", "Compile source code"], correctIndex: 1, difficulty: "medium" },
  // Backend testing
  { id: "q-test-be-1", skillId: "testing-be", prompt: "What is an integration test primarily designed to verify?", options: ["A single function in isolation", "That multiple components/services work together correctly", "Visual pixel accuracy", "CSS class names"], correctIndex: 1, difficulty: "medium" },
  // Python for DS
  { id: "q-py-1", skillId: "python-ds", prompt: "Which Python library is most associated with tabular data manipulation?", options: ["matplotlib", "pandas", "flask", "requests"], correctIndex: 1, difficulty: "easy" },
  { id: "q-py-2", skillId: "python-ds", prompt: "What does `numpy` primarily provide?", options: ["Web routing", "Efficient numerical array operations", "HTML templating", "Password hashing"], correctIndex: 1, difficulty: "medium" },
  // Statistics
  { id: "q-stat-1", skillId: "statistics", prompt: "What does a p-value help you assess in hypothesis testing?", options: ["The exact effect size", "The probability of observing results this extreme under the null hypothesis", "The dataset's storage size", "The number of outliers"], correctIndex: 1, difficulty: "hard" },
  { id: "q-stat-2", skillId: "statistics", prompt: "Which measure is most robust to outliers?", options: ["Mean", "Median", "Range", "Standard deviation"], correctIndex: 1, difficulty: "medium" },
  // ML fundamentals
  { id: "q-ml-1", skillId: "ml-fundamentals", prompt: "What is overfitting?", options: ["A model that generalizes very well", "A model that learns noise and performs poorly on unseen data", "A dataset with too few features", "A type of data visualization"], correctIndex: 1, difficulty: "medium" },
  { id: "q-ml-2", skillId: "ml-fundamentals", prompt: "What distinguishes supervised from unsupervised learning?", options: ["Supervised learning uses labeled data; unsupervised does not", "Unsupervised learning is always more accurate", "Supervised learning requires no data", "There is no difference"], correctIndex: 0, difficulty: "medium" },
  // Data viz
  { id: "q-viz-1", skillId: "data-viz", prompt: "Which chart type is best for showing a distribution's shape?", options: ["Pie chart", "Histogram", "Line chart only", "Table"], correctIndex: 1, difficulty: "easy" },
  // SQL for DS
  { id: "q-sqlds-1", skillId: "sql-ds", prompt: "Which SQL join returns only matching rows from both tables?", options: ["LEFT JOIN", "INNER JOIN", "FULL OUTER JOIN", "CROSS JOIN"], correctIndex: 1, difficulty: "medium" },
  // Model evaluation
  { id: "q-mleval-1", skillId: "ml-eval", prompt: "In an imbalanced classification problem, why can accuracy be misleading?", options: ["Accuracy is always 100%", "A model predicting only the majority class can still score high accuracy", "Accuracy cannot be computed", "It only works for regression"], correctIndex: 1, difficulty: "hard" },
  // DevOps
  { id: "q-linux-1", skillId: "linux-cli", prompt: "Which command lists running processes on a Linux system?", options: ["ls -l", "ps aux", "cd /", "mkdir"], correctIndex: 1, difficulty: "easy" },
  { id: "q-containers-1", skillId: "containers", prompt: "What is the primary benefit of containerization?", options: ["Guaranteed zero downtime", "Consistent, isolated runtime environments across machines", "Automatic code review", "Faster CSS parsing"], correctIndex: 1, difficulty: "medium" },
  { id: "q-cicd-1", skillId: "ci-cd", prompt: "What does 'CI' in CI/CD primarily refer to?", options: ["Continuous Isolation", "Continuous Integration — frequently merging and testing code", "Cloud Infrastructure", "Code Indentation"], correctIndex: 1, difficulty: "medium" },
  { id: "q-cloud-1", skillId: "cloud-basics", prompt: "What is an key benefit of cloud elasticity?", options: ["Fixed capacity forever", "Scaling resources up/down based on demand", "Eliminating the need for monitoring", "Removing all security concerns"], correctIndex: 1, difficulty: "medium" },
  { id: "q-iac-1", skillId: "iac", prompt: "What is Infrastructure as Code?", options: ["Writing UI code only", "Managing infrastructure through versioned, declarative configuration files", "A database query language", "A CSS framework"], correctIndex: 1, difficulty: "medium" },
  { id: "q-monitor-1", skillId: "monitoring", prompt: "What is the main purpose of application observability?", options: ["Hiding errors from users", "Understanding system health/behavior through logs, metrics, and traces", "Replacing the need for testing", "Reducing code size"], correctIndex: 1, difficulty: "medium" },
];

export function getQuizForRole(roleId: RoleId): QuizQuestion[] {
  const role = getRole(roleId);
  const skillIds = new Set(role.skills.map((s) => s.id));
  return QUESTION_BANK.filter((q) => skillIds.has(q.skillId));
}

/* -------------------------------------------------------------------------- */
/* SKILL GAP ANALYSIS                                                         */
/* -------------------------------------------------------------------------- */

const GAP_THRESHOLD = 65; // percentage below which a skill is considered a "gap"

export function analyzeSkillGaps(
  roleId: RoleId,
  answers: QuizAnswerRecord[]
): SkillScore[] {
  const role = getRole(roleId);
  return role.skills.map((skill) => {
    const skillAnswers = answers.filter((a) => a.skillId === skill.id);
    const correct = skillAnswers.filter((a) => a.correct).length;
    const total = skillAnswers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      skillId: skill.id,
      skillName: skill.name,
      weight: skill.weight,
      correct,
      total,
      percentage,
      isGap: percentage < GAP_THRESHOLD,
    };
  });
}

export function computeOverallScore(skillScores: SkillScore[]): number {
  const totalWeight = skillScores.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = skillScores.reduce(
    (sum, s) => sum + s.percentage * s.weight,
    0
  );
  return Math.round(weightedSum / totalWeight);
}

/* -------------------------------------------------------------------------- */
/* RESOURCE + ROADMAP GENERATION                                             */
/* -------------------------------------------------------------------------- */

function buildResources(skillName: string): LearningResource[] {
  const query = encodeURIComponent(skillName);
  return [
    {
      title: `${skillName} — Official documentation & guides`,
      type: "docs",
      url: `https://developer.mozilla.org/en-US/search?q=${query}`,
    },
    {
      title: `${skillName} crash course (video)`,
      type: "video",
      url: `https://www.youtube.com/results?search_query=${query}+crash+course`,
    },
    {
      title: `${skillName} — in-depth written tutorial`,
      type: "article",
      url: `https://www.freecodecamp.org/news/search/?query=${query}`,
    },
  ];
}

function buildPracticeTasks(skillName: string, skillId: string): RoadmapTopic["practiceTasks"] {
  return [
    {
      id: `${skillId}-task-1`,
      prompt: `Explain ${skillName} in your own words, as if teaching a beginner.`,
      completed: false,
    },
    {
      id: `${skillId}-task-2`,
      prompt: `Complete one small hands-on exercise applying ${skillName}.`,
      completed: false,
    },
    {
      id: `${skillId}-task-3`,
      prompt: `Identify one real bug or limitation you'd expect when using ${skillName} incorrectly.`,
      completed: false,
    },
  ];
}

function priorityFromScore(percentage: number, weight: number): RoadmapTopic["priority"] {
  const urgency = (100 - percentage) * weight;
  if (urgency >= 300) return "high";
  if (urgency >= 150) return "medium";
  return "low";
}

function estimateHours(percentage: number, background: StudentProfile["background"]): number {
  const base = percentage < 40 ? 8 : percentage < 65 ? 5 : 3;
  const modifier = background === "beginner" ? 1.4 : background === "intermediate" ? 1 : 0.7;
  return Math.round(base * modifier);
}

export function generateRoadmap(
  profile: StudentProfile,
  skillScores: SkillScore[]
): Roadmap {
  const sorted = [...skillScores].sort((a, b) => {
    const urgencyA = (100 - a.percentage) * a.weight;
    const urgencyB = (100 - b.percentage) * b.weight;
    return urgencyB - urgencyA;
  });

  const topics: RoadmapTopic[] = sorted.map((skill) => {
    const priority = priorityFromScore(skill.percentage, skill.weight);
    const summary =
      skill.percentage < 40
        ? `Your assessment shows a foundational gap in ${skill.skillName}. This is a high-leverage topic — mastering it will unlock several related skills.`
        : skill.percentage < 65
        ? `You have partial understanding of ${skill.skillName}. Focused practice will move this from "shaky" to "reliable."`
        : `You're solid here. This module is lightweight — mainly reinforcement and edge cases for ${skill.skillName}.`;

    return {
      id: `topic-${skill.skillId}`,
      skillId: skill.skillId,
      skillName: skill.skillName,
      title: `Master: ${skill.skillName}`,
      summary,
      priority,
      estimatedHours: estimateHours(skill.percentage, profile.background),
      resources: buildResources(skill.skillName),
      practiceTasks: buildPracticeTasks(skill.skillName, skill.skillId),
      notes: "",
      status: "not-started",
      quizFailCount: 0,
      timeSpentSeconds: 0,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    targetRole: profile.targetRole,
    topics,
  };
}

/* -------------------------------------------------------------------------- */
/* REAL-WORLD PROJECT GENERATION                                             */
/* -------------------------------------------------------------------------- */

const PROJECT_TEMPLATES: Record<RoleId, RealWorldProject[]> = {
  "frontend-engineer": [
    {
      id: "proj-fe-dashboard",
      title: "Interactive Analytics Dashboard",
      description:
        "Build a responsive dashboard that fetches data from a public API and visualizes it with charts, filters, and a dark mode toggle.",
      relatedSkillIds: ["react", "state-mgmt", "web-perf"],
      difficulty: "intermediate",
      checklist: [
        { id: "c1", label: "Set up project with a component library", completed: false },
        { id: "c2", label: "Fetch and cache data from a public API", completed: false },
        { id: "c3", label: "Implement at least 2 interactive chart types", completed: false },
        { id: "c4", label: "Add responsive layout for mobile", completed: false },
        { id: "c5", label: "Deploy to a free hosting provider", completed: false },
      ],
    },
    {
      id: "proj-fe-clone",
      title: "Pixel-Accurate UI Clone",
      description:
        "Recreate the UI of a well-known product's landing page, focusing on layout precision, accessibility, and semantic HTML.",
      relatedSkillIds: ["html-css", "web-perf"],
      difficulty: "beginner",
      checklist: [
        { id: "c1", label: "Recreate layout using semantic HTML", completed: false },
        { id: "c2", label: "Match spacing/typography within 90% accuracy", completed: false },
        { id: "c3", label: "Ensure keyboard navigation works", completed: false },
        { id: "c4", label: "Run a Lighthouse accessibility audit", completed: false },
      ],
    },
  ],
  "backend-engineer": [
    {
      id: "proj-be-api",
      title: "Production-Style REST API",
      description:
        "Design and build a REST API with authentication, input validation, pagination, and automated tests.",
      relatedSkillIds: ["api-design", "auth-security", "databases"],
      difficulty: "intermediate",
      checklist: [
        { id: "c1", label: "Design resource-oriented API endpoints", completed: false },
        { id: "c2", label: "Implement JWT-based authentication", completed: false },
        { id: "c3", label: "Add request validation and error handling", completed: false },
        { id: "c4", label: "Write integration tests for core endpoints", completed: false },
        { id: "c5", label: "Document the API (OpenAPI/Swagger)", completed: false },
      ],
    },
    {
      id: "proj-be-scaling",
      title: "Rate-Limited Job Queue Service",
      description:
        "Build a backend service that processes background jobs with retries, rate limiting, and observability.",
      relatedSkillIds: ["system-design", "server-lang"],
      difficulty: "advanced",
      checklist: [
        { id: "c1", label: "Implement a queue with retry/backoff logic", completed: false },
        { id: "c2", label: "Add rate limiting per client", completed: false },
        { id: "c3", label: "Expose health/metrics endpoints", completed: false },
      ],
    },
  ],
  "data-scientist": [
    {
      id: "proj-ds-eda",
      title: "End-to-End Exploratory Data Analysis",
      description:
        "Take a raw public dataset, clean it, explore it statistically, and present findings with clear visualizations.",
      relatedSkillIds: ["python-ds", "statistics", "data-viz"],
      difficulty: "beginner",
      checklist: [
        { id: "c1", label: "Clean and handle missing data", completed: false },
        { id: "c2", label: "Compute descriptive statistics", completed: false },
        { id: "c3", label: "Create 3+ meaningful visualizations", completed: false },
        { id: "c4", label: "Summarize insights in a short report", completed: false },
      ],
    },
    {
      id: "proj-ds-model",
      title: "Predictive Model with Evaluation Report",
      description:
        "Train a classification or regression model, tune it, and rigorously evaluate it against baseline metrics.",
      relatedSkillIds: ["ml-fundamentals", "ml-eval"],
      difficulty: "intermediate",
      checklist: [
        { id: "c1", label: "Split data into train/validation/test sets", completed: false },
        { id: "c2", label: "Train a baseline and an improved model", completed: false },
        { id: "c3", label: "Evaluate with appropriate metrics for the problem", completed: false },
        { id: "c4", label: "Discuss overfitting/underfitting tradeoffs", completed: false },
      ],
    },
  ],
  "fullstack-engineer": [
    {
      id: "proj-fs-app",
      title: "Full-Stack CRUD Application",
      description:
        "Build a complete application with a database-backed API and a polished frontend, including auth.",
      relatedSkillIds: ["react", "server-lang", "databases", "api-design"],
      difficulty: "intermediate",
      checklist: [
        { id: "c1", label: "Design the data model and schema", completed: false },
        { id: "c2", label: "Build CRUD API endpoints", completed: false },
        { id: "c3", label: "Build the frontend to consume the API", completed: false },
        { id: "c4", label: "Add user authentication", completed: false },
        { id: "c5", label: "Deploy both frontend and backend", completed: false },
      ],
    },
  ],
  "devops-engineer": [
    {
      id: "proj-do-pipeline",
      title: "Containerized CI/CD Pipeline",
      description:
        "Containerize an application and build an automated pipeline that tests, builds, and deploys it.",
      relatedSkillIds: ["containers", "ci-cd", "cloud-basics"],
      difficulty: "intermediate",
      checklist: [
        { id: "c1", label: "Write a Dockerfile for the app", completed: false },
        { id: "c2", label: "Set up an automated CI pipeline", completed: false },
        { id: "c3", label: "Add automated deployment on merge", completed: false },
        { id: "c4", label: "Add basic monitoring/alerts", completed: false },
      ],
    },
  ],
};

export function generateProjects(
  roleId: RoleId,
  skillScores: SkillScore[]
): RealWorldProject[] {
  const templates = PROJECT_TEMPLATES[roleId] ?? [];
  const gapSkillIds = new Set(
    skillScores.filter((s) => s.isGap).map((s) => s.skillId)
  );

  // Prioritize projects that touch the most current skill gaps.
  const scored = templates.map((project) => {
    const overlap = project.relatedSkillIds.filter((id) =>
      gapSkillIds.has(id)
    ).length;
    return { project, overlap };
  });

  scored.sort((a, b) => b.overlap - a.overlap);
  return scored.map((s) => s.project);
}

/* -------------------------------------------------------------------------- */
/* STRUGGLE DETECTION + INTERVENTION                                         */
/* -------------------------------------------------------------------------- */

const TIME_ON_TOPIC_THRESHOLD_SECONDS = 60 * 25; // 25 minutes of active time with no progress
const FAILURE_THRESHOLD = 2;

export function detectStruggle(topic: RoadmapTopic): InterventionEvent | null {
  if (topic.quizFailCount >= FAILURE_THRESHOLD) {
    return {
      id: `intervention-${topic.id}-fail-${Date.now()}`,
      topicId: topic.id,
      topicTitle: topic.title,
      reason: "repeated-failure",
      message: `You've missed practice checks on "${topic.skillName}" ${topic.quizFailCount} times in a row. That's a signal worth pausing on, not a reason to feel discouraged.`,
      suggestion:
        "Try switching formats: watch a short video walkthrough instead of reading docs, then re-attempt with a simpler, smaller example before returning to the original problem.",
      createdAt: new Date().toISOString(),
      resolved: false,
    };
  }

  if (topic.timeSpentSeconds >= TIME_ON_TOPIC_THRESHOLD_SECONDS && topic.status !== "completed") {
    return {
      id: `intervention-${topic.id}-time-${Date.now()}`,
      topicId: topic.id,
      topicTitle: topic.title,
      reason: "time-exceeded",
      message: `You've spent a long stretch on "${topic.skillName}" without marking it complete. Long, unbroken effort on one topic often means the current explanation isn't clicking.`,
      suggestion:
        "Take a 10-minute break, then come back and try explaining the concept out loud in one sentence. If you can't, revisit the resource list — a different source may fit your learning style better.",
      createdAt: new Date().toISOString(),
      resolved: false,
    };
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* AI TUTOR — RULE-BASED RESPONSE TEMPLATES                                  */
/* -------------------------------------------------------------------------- */

const TUTOR_TEMPLATES: { keywords: string[]; responses: string[] }[] = [
  {
    keywords: ["stuck", "confused", "don't understand", "dont understand", "lost"],
    responses: [
      "Let's break it into smaller pieces. What's the smallest example of this concept you *do* understand? We can build outward from there.",
      "That's a normal spot to be stuck — the concept usually clicks after the second explanation, not the first. Want me to suggest a different resource format (video vs. article)?",
    ],
  },
  {
    keywords: ["quiz", "failed", "wrong", "score low"],
    responses: [
      "A low quiz score is data, not a verdict. It tells us precisely which sub-skill to revisit — that's exactly what the roadmap will now prioritize.",
      "Let's look at which specific question type tripped you up — conceptual, syntax, or applied? That tells us what to practice next.",
    ],
  },
  {
    keywords: ["project", "build", "portfolio"],
    responses: [
      "Great instinct — projects convert theory into proof. Pick the project whose checklist overlaps most with your current skill gaps; that's the highest-leverage one.",
      "Before starting, sketch the project's data model or component tree on paper first. It saves hours of restructuring later.",
    ],
  },
  {
    keywords: ["job", "ready", "interview", "hire"],
    responses: [
      "Job-readiness isn't just quiz scores — it's assessment performance, consistent practice, and shipped projects together. Check your Readiness Gauge to see which of those three is lagging.",
      "A strong signal for interviews is being able to explain *why* you made a decision in a project, not just that it works. Practice narrating your project choices out loud.",
    ],
  },
  {
    keywords: ["motivation", "tired", "give up", "hard"],
    responses: [
      "Skill acquisition is rarely linear — plateaus are where consolidation quietly happens. A short break often helps more than pushing through.",
      "Progress you can't see yet is still happening. Consider logging today's effort in your notes so future-you has proof of the climb.",
    ],
  },
];

const FALLBACK_RESPONSES = [
  "Tell me more about what part feels hardest right now — a concept, the syntax, or applying it to a real problem?",
  "Good question. Based on your current roadmap, I'd focus next on whichever topic is marked 'high priority' — want me to point to it?",
  "I'm tracking your progress in the background. If a topic starts taking unusually long, I'll flag it here automatically.",
];

export function generateTutorResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const template of TUTOR_TEMPLATES) {
    if (template.keywords.some((k) => lower.includes(k))) {
      const idx = Math.floor(Math.random() * template.responses.length);
      return template.responses[idx];
    }
  }
  const idx = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
  return FALLBACK_RESPONSES[idx];
}

/* -------------------------------------------------------------------------- */
/* JOB-READINESS CALCULATION                                                 */
/* -------------------------------------------------------------------------- */

export function computeReadiness(
  assessmentScore: number,
  roadmap: Roadmap | null,
  projects: RealWorldProject[]
): ReadinessBreakdown {
  const assessmentComponent = Math.round(assessmentScore * 0.35);

  let notesComponent = 0;
  let tasksComponent = 0;
  if (roadmap && roadmap.topics.length > 0) {
    const topicsWithNotes = roadmap.topics.filter(
      (t) => t.notes.trim().length > 40
    ).length;
    notesComponent = Math.round(
      (topicsWithNotes / roadmap.topics.length) * 20
    );

    const totalTasks = roadmap.topics.reduce(
      (sum, t) => sum + t.practiceTasks.length,
      0
    );
    const completedTasks = roadmap.topics.reduce(
      (sum, t) => sum + t.practiceTasks.filter((task) => task.completed).length,
      0
    );
    tasksComponent =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 25) : 0;
  }

  let projectsComponent = 0;
  if (projects.length > 0) {
    const totalItems = projects.reduce((sum, p) => sum + p.checklist.length, 0);
    const completedItems = projects.reduce(
      (sum, p) => sum + p.checklist.filter((c) => c.completed).length,
      0
    );
    projectsComponent =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 20) : 0;
  }

  const total = Math.min(
    100,
    assessmentComponent + notesComponent + tasksComponent + projectsComponent
  );

  return {
    assessmentComponent,
    notesComponent,
    tasksComponent,
    projectsComponent,
    total,
  };
}

export function readinessLabel(score: number): string {
  if (score >= 80) return "Job-Ready";
  if (score >= 60) return "Almost There";
  if (score >= 35) return "Building Foundations";
  return "Early Stage";
}
