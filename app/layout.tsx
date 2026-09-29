import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduPath — AI-Driven Personalized Learning Planner",
  description:
    "EduPath analyzes your skill gaps, builds a personalized roadmap, detects when you're struggling, and tracks your real job-readiness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
