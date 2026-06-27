import type { LucideIcon } from "lucide-react";

export type StatusTone = "healthy" | "warning" | "critical" | "neutral" | "info" | "archived";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type Project = {
  id: string;
  name: string;
  subtitle: string;
  status: StatusTone;
  statusLabel: string;
  deployment: string;
  activity: string;
  openBugs: number;
  recommendation: string;
  updated: string;
  progress: number;
  accent: "blue" | "violet" | "orange";
  stack: string[];
};

export type Recommendation = {
  id: string;
  title: string;
  body: string;
  action: string;
  tone: "blue" | "violet" | "orange";
};

export type DebugIssue = {
  id: string;
  title: string;
  severity: "critical" | "medium";
  age: string;
  explanation: string;
  rootCause: string[];
  suggestedFix: string;
  color: "red" | "orange";
};

export type SystemMetric = {
  label: string;
  value: string;
  detail: string;
  status: StatusTone;
  icon: LucideIcon;
};

export type Repository = {
  name: string;
  owner: string;
  status: string;
  updated: string;
  healthScore: number;
  testCoverage: number;
  maintainability: string;
};

export type Commit = {
  id: string;
  title: string;
  summary: string;
  author: string;
  age: string;
  tag?: string;
  tone: "blue" | "violet" | "red";
};

export type PullRequest = {
  number: number;
  title: string;
  author: string;
  comments: number;
  status: "Draft" | "Review";
  reviewers: string[];
};

export type MemoryEntry = {
  id: string;
  title: string;
  body: string;
  meta: string;
  project?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  code?: string;
  diff?: {
    file: string;
    additions: number;
    deletions: number;
    lines: { type: "add" | "remove"; text: string }[];
  };
};
