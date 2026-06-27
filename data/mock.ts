import {
  Bell,
  Blocks,
  Bot,
  BrainCircuit,
  Bug,
  Database,
  FileCode2,
  Gauge,
  GitCommitVertical,
  KeyRound,
  Rocket,
  Server,
  ShieldCheck,
  TerminalSquare
} from "lucide-react";
import type {
  ChatMessage,
  Commit,
  DebugIssue,
  MemoryEntry,
  Project,
  PullRequest,
  Recommendation,
  Repository,
  SystemMetric
} from "@/types/domain";

export const projects: Project[] = [
  {
    id: "notifyme",
    name: "NotifyMe",
    subtitle: "Funded Jobs AI",
    status: "healthy",
    statusLabel: "Healthy",
    deployment: "Vercel",
    activity: "2h ago",
    openBugs: 0,
    recommendation: "Update landing page copy to reflect new funding round.",
    updated: "Updated 2h ago",
    progress: 85,
    accent: "blue",
    stack: ["JS", "TS"]
  },
  {
    id: "jd-optimise",
    name: "JD Optimise",
    subtitle: "Recruitment AI",
    status: "warning",
    statusLabel: "Action Required",
    deployment: "Supabase",
    activity: "5 commits/day",
    openBugs: 3,
    recommendation: "Resolve high-priority validation bug in the Upload module.",
    updated: "Updated 14m ago",
    progress: 42,
    accent: "violet",
    stack: ["PY"]
  },
  {
    id: "discovery-guide",
    name: "Discovery Guide",
    subtitle: "Internal Tooling",
    status: "healthy",
    statusLabel: "Healthy",
    deployment: "Vercel",
    activity: "Idle",
    openBugs: 0,
    recommendation: "Review latest user feedback tokens to refresh the discovery map.",
    updated: "Updated yesterday",
    progress: 68,
    accent: "orange",
    stack: ["TS"]
  },
  {
    id: "ai-learnings",
    name: "AI Learnings",
    subtitle: "R&D Lab",
    status: "archived",
    statusLabel: "Archived",
    deployment: "Local Only",
    activity: "Aug 2023",
    openBugs: 12,
    recommendation: "Migrate relevant LLM prompt templates to NotifyMe codebase.",
    updated: "Updated Aug 2023",
    progress: 24,
    accent: "blue",
    stack: ["AL"]
  }
];

export const commandPriorities = [
  { label: "Finalize API Auth layer", done: true },
  { label: "Review PR #452: JD Optimise", done: false },
  { label: "Stakeholder briefing (Q3 Plan)", done: false },
  { label: "Update Memory logs", done: false }
];

export const recommendations: Recommendation[] = [
  {
    id: "types",
    title: "Standardize Types",
    body: "You have 14 redundant interface definitions for UserResponse. Consolidation could reduce bundle size by 4KB.",
    action: "Apply fix",
    tone: "orange"
  },
  {
    id: "telemetry",
    title: "Enhance Telemetry",
    body: "The core scheduler lacks detailed timing hooks. Adding tracing would improve debugging speed.",
    action: "View proposal",
    tone: "violet"
  },
  {
    id: "docs",
    title: "Doc Generator",
    body: "3 new modules are missing JSDoc documentation. Mycroft can generate these from function logic.",
    action: "Generate docs",
    tone: "blue"
  }
];

export const deployments = [
  { name: "NotifyMe v2.1.0-alpha", detail: "Production successfully deployed by Vercel", age: "14 mins ago", icon: Rocket },
  { name: "JD Optimise Migrations", detail: "Staging DB schemas updated via Supabase CLI", age: "2 hours ago", icon: Database }
];

export const systemMetrics: SystemMetric[] = [
  { label: "API", value: "Latency: 42ms", detail: "Uptime: 99.98%", status: "healthy", icon: Blocks },
  { label: "Database", value: "Conn: 12/1000", detail: "Read/Write: 2.1k op/s", status: "healthy", icon: Database },
  { label: "Auth", value: "Failed Logins: 4%", detail: "JWT Validation: OK", status: "critical", icon: KeyRound }
];

export const debugIssues: DebugIssue[] = [
  {
    id: "DEB-7729",
    title: "Auth Callback Timeout (OIDC_PROVIDER_ERR)",
    severity: "critical",
    age: "4 minutes ago",
    explanation:
      "The authentication flow is timing out during the handshake with the third-party OIDC provider. This usually indicates DNS resolution lag or a firewall block on port 443 for outbound requests.",
    rootCause: [
      "context deadline exceeded (Client.Timeout exceeded while awaiting headers)",
      "> auth_controller.go:142 (ExchangeCode)",
      "> client_oauth.go:88 (FetchToken)"
    ],
    suggestedFix:
      "Increase the global HTTP timeout to 10s in the OIDC configuration and verify the outbound network policy for identity-service.",
    color: "red"
  },
  {
    id: "DEB-7801",
    title: "Background Memory Cache Invalidation Lag",
    severity: "medium",
    age: "1 hour ago",
    explanation:
      "Redis keys for user session metadata are not expiring as configured. This is causing a slow memory creep in the caching layer during refresh calls.",
    rootCause: [
      "Memory usage: 88% (Threshold: 80%)",
      "Unexpired keys: 142,000 (+12k/hour)",
      "> session_manager.py:221 (set_persistent_cache)"
    ],
    suggestedFix:
      "Apply a specific TTL of 3600 seconds to all keys within the session_data namespace during the refresh call.",
    color: "orange"
  }
];

export const nodePerformance = [
  { resource: "us-east-worker-1", type: "EC2 / g5.xlarge", usage: 66, lastSync: "Just now" },
  { resource: "us-east-worker-2", type: "EC2 / g5.xlarge", usage: 42, lastSync: "2m ago" },
  { resource: "eu-west-runner-1", type: "Vercel Edge", usage: 82, lastSync: "5m ago" }
];

export const repository: Repository = {
  owner: "mycroft-pm",
  name: "core-engine",
  status: "Operational",
  updated: "Updated 4 mins ago",
  healthScore: 94,
  testCoverage: 92.4,
  maintainability: "High"
};

export const commits: Commit[] = [
  {
    id: "68a2e1",
    title: "refactor: optimize token streaming",
    summary: "Streamlined the Mycroft response engine to reduce latency by 150ms.",
    author: "alex_dev",
    age: "22m ago",
    tone: "blue"
  },
  {
    id: "142",
    title: "Merge pull request #142 from feature/auth-v2",
    summary: "Integrated OAuth 2.0 flow with enhanced security parameters.",
    author: "sarah_arch",
    age: "4h ago",
    tone: "violet"
  },
  {
    id: "hotfix",
    title: "fix: resolve memory leak in worker",
    summary: "Patched the node_worker disposal logic to prevent heap overflow.",
    author: "system_bot",
    age: "8h ago",
    tag: "Hotfix",
    tone: "red"
  }
];

export const pullRequests: PullRequest[] = [
  {
    number: 156,
    title: "feat: add vector database support",
    author: "tom_ai",
    comments: 12,
    status: "Draft",
    reviewers: ["AL", "MJ"]
  },
  {
    number: 154,
    title: "chore: update v8 engine configs",
    author: "sarah_arch",
    comments: 2,
    status: "Review",
    reviewers: ["AL"]
  }
];

export const memoryDecisions: MemoryEntry[] = [
  {
    id: "postgres",
    title: "PostgreSQL over MongoDB",
    body: "Chose relational for complex PM structure and ACID compliance requirements on task entity.",
    meta: "Oct 24, 2023",
    project: "Phoenix"
  },
  {
    id: "edge",
    title: "Vercel Edge Functions",
    body: "Migration from Lambda for lower latency in global LLM response streaming.",
    meta: "Sep 12, 2023",
    project: "Core API"
  }
];

export const architectureNotes: MemoryEntry[] = [
  {
    id: "syncing",
    title: "Event-Driven Syncing",
    body: "Diagram and specification for cross-region data consistency using Redis Pub/Sub.",
    meta: "Updated 2 days ago"
  },
  {
    id: "oauth",
    title: "OAuth 2.1 Flow Implementation",
    body: "PKCE enforcement for mobile and web clients. Centralizing token rotation logic.",
    meta: "Updated 5 days ago"
  }
];

export const learnings: MemoryEntry[] = [
  {
    id: "hydration",
    title: "Hydration Mismatch in Next.js",
    body: "Always wrap window-dependent logic in useEffect to prevent server-client drift.",
    meta: "Insight from Project Dashboard UI"
  },
  {
    id: "jsonb",
    title: "SQL Indexing for JSONB",
    body: "GIN indexes are required for efficient key/value searching inside unstructured Postgres columns.",
    meta: "Insight from Debug Session #104"
  },
  {
    id: "tailwind",
    title: "Tailwind JIT & Arbitrary Values",
    body: "Dynamic class generation does not work for concatenated strings; use full class names.",
    meta: "Insight from System Cleanup"
  }
];

export const longTermGoals = [
  {
    title: "Fully Autonomous Sprint Planning",
    label: "North Star",
    body: "Enable AI to predict velocity based on past PR cycle times without manual input.",
    dark: true,
    icon: Bot
  },
  {
    title: "Zero-Downtime Global Edge Deployment",
    label: "Infrastructure",
    body: "Full migration to distributed database nodes across 12 worldwide regions.",
    dark: false,
    icon: Server
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content:
      "How do I optimize the notification handler in the NotifyMe project? I'm seeing some latency during peak times. Can you review the latest commit?"
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "I've reviewed the latest commit in NotifyMe/main. The latency you're experiencing is likely caused by the synchronous database write during the dispatch loop. Here is the proposed refactor using an async queue pattern:",
    code:
      "async function handleNotification(event) {\n  // Push to Redis Queue instead of awaiting DB\n  await queue.add('notification_dispatch', {\n    userId: event.userId,\n    payload: event.payload,\n    timestamp: Date.now()\n  });\n\n  return { status: 'queued' };\n}",
    diff: {
      file: "services/notify_service.js",
      additions: 2,
      deletions: 1,
      lines: [
        { type: "remove", text: "await db.notifications.insert(payload);" },
        { type: "add", text: "await queue.push('notify', payload);" },
        { type: "add", text: "logger.info('Queued notification dispatch');" }
      ]
    }
  }
];

export const quickActions = ["Debug NotifyMe", "Review latest commit", "Generate PRD", "Optimize DB queries"];

export const criticalBugs = [
  { project: "NotifyMe", title: "Database connection leak in Prod", tone: "critical" as const, icon: Bug },
  { project: "JD Optimise", title: "Auth token expiration mismatch", tone: "critical" as const, icon: ShieldCheck }
];

export const sidebarProfile = {
  name: "Alex Chen",
  role: "Premium Plan",
  avatar: "AC",
  icon: Bell
};
