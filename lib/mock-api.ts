import {
  architectureNotes,
  chatMessages,
  commandPriorities,
  commits,
  criticalBugs,
  debugIssues,
  deployments,
  learnings,
  longTermGoals,
  memoryDecisions,
  nodePerformance,
  projects,
  pullRequests,
  quickActions,
  recommendations,
  repository,
  systemMetrics
} from "@/data/mock";
import type { ChatMessage } from "@/types/domain";

export type MycroftAction =
  | "ask-mycroft"
  | "search"
  | "toggle-priority"
  | "view-alerts"
  | "optimize-repository"
  | "open-project"
  | "view-deployments"
  | "run-project-command"
  | "send-chat-message"
  | "quick-chat-action"
  | "generate-debug-fix"
  | "open-debug-logs"
  | "analyze-debug-state"
  | "export-report"
  | "rescan-codebase"
  | "view-commits"
  | "apply-recommendation"
  | "ask-codebase"
  | "ask-memory"
  | "add-memory"
  | "save-settings";

export type ActionResult = {
  action: MycroftAction;
  title: string;
  description: string;
  timestamp: string;
};

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function action(action: MycroftAction, title: string, description: string): ActionResult {
  return { action, title, description, timestamp: now() };
}

export const mycroftApi = {
  commandCenter() {
    return {
      projects,
      priorities: commandPriorities,
      criticalBugs
    };
  },
  projects() {
    return { projects, deployments };
  },
  chat() {
    return { messages: chatMessages, quickActions };
  },
  debug() {
    return { issues: debugIssues, nodes: nodePerformance, metrics: systemMetrics };
  },
  github() {
    return { commits, pullRequests, recommendations, repository };
  },
  memories() {
    return { architectureNotes, learnings, longTermGoals, memoryDecisions };
  },
  settings() {
    return {
      profile: { name: "Alex Chen", role: "Lead Developer", email: "alex@mycroft.pm" },
      preferences: [
        { id: "notifications", label: "Product alerts", description: "Critical bugs, deploy updates, and sprint risks.", enabled: true },
        { id: "memory", label: "Memory capture", description: "Save decisions and technical learnings from product work.", enabled: true },
        { id: "weekly", label: "Weekly summary", description: "Generate a weekly operating summary every Friday.", enabled: false }
      ],
      integrations: [
        { id: "openclaw", label: "OpenClaw", status: "Ready for next phase" },
        { id: "github", label: "GitHub", status: "Mocked" },
        { id: "supabase", label: "Supabase", status: "Mocked" }
      ]
    };
  },
  actions: {
    askMycroft(prompt: string) {
      return action("ask-mycroft", "Mycroft queued your request", prompt || "Opened the assistant workspace.");
    },
    search(scope: string, query: string) {
      return action("search", `${scope} search updated`, query ? `Filtering mock results for "${query}".` : "Search cleared.");
    },
    togglePriority(label: string, done: boolean) {
      return action("toggle-priority", done ? "Priority completed" : "Priority reopened", label);
    },
    viewAlerts() {
      return action("view-alerts", "Critical alert queue opened", "Showing 2 active mock alerts for review.");
    },
    optimizeRepository() {
      return action("optimize-repository", "Repository optimization drafted", "Prepared a mock cleanup plan for stale branches.");
    },
    openProject(projectName: string) {
      return action("open-project", `${projectName} workspace opened`, "Loaded the mock workspace action contract.");
    },
    viewDeployments() {
      return action("view-deployments", "Deployment history opened", "Showing recent mock deployments.");
    },
    runProjectCommand(command: string) {
      return action("run-project-command", "Project command queued", command || "No command text entered.");
    },
    sendChatMessage(message: string): ChatMessage {
      return {
        id: `local-${Date.now()}`,
        role: "user",
        content: message
      };
    },
    quickChatAction(actionLabel: string) {
      return action("quick-chat-action", "Prompt prepared", `${actionLabel} added to the composer.`);
    },
    assistantReply(prompt: string): ChatMessage {
      return {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `Mock response prepared for: ${prompt}. OpenClaw integration can replace this local contract later.`
      };
    },
    generateDebugFix(issueTitle: string) {
      return action("generate-debug-fix", "Fix plan generated", `Created a mock remediation plan for ${issueTitle}.`);
    },
    openDebugLogs(issueTitle: string) {
      return action("open-debug-logs", "Logs opened", `Showing mock logs for ${issueTitle}.`);
    },
    analyzeDebugState(prompt: string) {
      return action("analyze-debug-state", "System analysis queued", prompt || "Analyzing current mock system state.");
    },
    exportReport() {
      return action("export-report", "Report export prepared", "Generated a mock GitHub intelligence report.");
    },
    rescanCodebase() {
      return action("rescan-codebase", "Codebase rescan started", "Scanning mock repository data.");
    },
    viewCommits() {
      return action("view-commits", "Commit history opened", "Showing all mock commits.");
    },
    applyRecommendation(title: string) {
      return action("apply-recommendation", "Recommendation selected", title);
    },
    askCodebase(prompt: string) {
      return action("ask-codebase", "Codebase question queued", prompt || "No codebase question entered.");
    },
    askMemory(prompt: string) {
      return action("ask-memory", "Memory query queued", prompt || "No memory query entered.");
    },
    addMemory() {
      return action("add-memory", "Memory captured", "Saved the mock Framer Motion decision.");
    },
    saveSettings() {
      return action("save-settings", "Settings saved", "Local mock preferences were updated.");
    }
  }
};
