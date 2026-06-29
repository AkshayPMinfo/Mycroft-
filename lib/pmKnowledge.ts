export interface KnowledgeModule {
  name: string;
  principles: string[];
  decisionRules: string[];
  frameworks: string[];
  bestPractices: string[];
  commonMistakes: string[];
  metrics?: string[];
  heuristics?: string[];
}

export const PM_KNOWLEDGE_BASE: Record<string, KnowledgeModule> = {
  philosophy: {
    name: "PM Philosophy",
    principles: [
      "Focus on business outcomes and customer value, not just shipping outputs/features.",
      "Manage the 4 Core Risks: Value (will they buy?), Usability (can they use it?), Feasibility (can we build it?), and Viability (does it fit our business?)."
    ],
    decisionRules: [
      "Never commit engineering resources to a feature that lacks problem validation.",
      "If a proposed feature doesn't align with a current key result or objective, defer it."
    ],
    frameworks: ["Marty Cagan's Four Risks", "Outcome-Based Roadmaps"],
    bestPractices: [
      "Write PRDs and specs as sets of testable hypotheses rather than rigid mandates.",
      "Involve engineers and designers in the problem definition space, not just execution."
    ],
    commonMistakes: [
      "Feature Factory mindset: measuring success by the number of features shipped instead of metric improvement.",
      "Building a feature simply because a competitor did, without understanding user fit."
    ]
  },
  thinking: {
    name: "Product Thinking",
    principles: [
      "Fall in love with the problem, not your specific solution.",
      "Understand the customer's current workaround before designing a new feature."
    ],
    decisionRules: [
      "Identify who experiences the target problem, how often, and how they measure success today.",
      "Always compare proposed feature solutions against the customer's existing workaround."
    ],
    frameworks: ["First Principles Thinking", "Opportunity Solution Tree (Teresa Torres)"],
    bestPractices: [
      "Ask 'Why?' five times to dig past symptoms to the root operational/user cause.",
      "Document the trade-offs of substitute solutions before deciding on one."
    ],
    commonMistakes: [
      "Assuming you are the target user and designing for your own preferences.",
      "Jumping straight to wireframes and visual design before validating the core problem."
    ]
  },
  discovery: {
    name: "Product Discovery",
    principles: [
      "Dual-Track Agile: Run a discovery track (validation) in parallel with a delivery track (execution).",
      "Validate high-risk assumptions quickly and at the lowest possible cost."
    ],
    decisionRules: [
      "If a hypothesis is high-risk and unproven, use low-fidelity smoke tests or prototypes first.",
      "Define clean quantitative success thresholds before launching a discovery experiment."
    ],
    frameworks: ["Dual-Track Agile", "Assumption Mapping", "Smoke Testing"],
    bestPractices: [
      "Conduct continuous weekly discovery interviews with actual users.",
      "Test feasibility early by reviewing architectural complexity with tech leads."
    ],
    commonMistakes: [
      "Treating discovery as a one-off phase at the start of a project rather than a continuous cycle.",
      "Over-engineering discovery prototypes, wasting weeks of development time on unvalidated ideas."
    ]
  },
  research: {
    name: "User Research & Interviews",
    principles: [
      "The Mom Test: Never ask users if they like your idea. Ask about their past behaviors instead.",
      "Jobs-to-be-Done (JTBD): Users do not buy products; they hire them to complete a job."
    ],
    decisionRules: [
      "If a user says 'I would use this', count it as zero evidence. Only trust past actions.",
      "Frame all interview questions around specific, recent past events rather than hypothetical futures."
    ],
    frameworks: ["The Mom Test (Rob Fitzpatrick)", "Jobs-to-be-Done (JTBD) Framework", "User Journey Mapping"],
    bestPractices: [
      "Identify the functional, emotional, and social dimensions of the user's 'job'.",
      "Ask open-ended questions: 'How did you solve this the last time it happened?'"
    ],
    commonMistakes: [
      "Running interviews that feel like pitch sessions, seeking approval for your product idea.",
      "Relying on generic feedback surveys instead of deep qualitative conversation to unpack motivations."
    ]
  },
  prioritization: {
    name: "Prioritization Frameworks",
    principles: [
      "Prioritization is about choosing what NOT to build.",
      "Balance Reach, Impact, and Confidence against the engineering Effort required."
    ],
    decisionRules: [
      "Use RICE when you have clean, quantifiable data for Reach and Impact.",
      "Use ICE when speed is critical and you need to build immediate consensus.",
      "Use the Kano model to distinguish table-stakes features from delighters."
    ],
    frameworks: ["RICE (Reach, Impact, Confidence, Effort)", "ICE (Impact, Confidence, Ease)", "Kano Model", "MoSCoW Prioritization"],
    bestPractices: [
      "Be honest about Confidence scores: default to 50% or lower if you lack direct user evidence.",
      "Group features into Kano categories: Must-Be, One-Dimensional, and Attractive (Delighters)."
    ],
    commonMistakes: [
      "Artificially inflating Reach or Impact scores to push through a pet feature.",
      "Prioritizing attractive delighters while neglecting core must-be baseline usability requirements."
    ]
  },
  analytics: {
    name: "Product Analytics & Metrics",
    principles: [
      "Measure outcomes that represent actual user value, not vanity statistics.",
      "Define a single North Star Metric that aligns customer value, product engagement, and business health."
    ],
    decisionRules: [
      "Specify core success metrics, input guardrails, and tracking events before coding a feature.",
      "If retention is low, prioritize fixing activation funnel drop-offs before driving acquisition."
    ],
    frameworks: ["AARRR (Pirate Metrics)", "Google HEART Framework", "Funnel & Cohort Analysis"],
    bestPractices: [
      "Use cohort analysis to monitor how changes in onboarding affect long-term retention.",
      "Set up A/B split testing to quantitatively isolate feature variant impact."
    ],
    commonMistakes: [
      "Optimizing for vanity metrics like sign-ups or page views instead of repeat engagement or retention.",
      "Launching features without instrumenting event tracking, leaving the team blind to actual usage."
    ]
  }
};

export function retrieveRelevantKnowledge(input: string): string[] {
  const clean = input.toLowerCase();
  const matchedKeys: string[] = [];

  // Keyword mappings for retrieval routing
  if (
    clean.includes("philosophy") ||
    clean.includes("outcome") ||
    clean.includes("risk") ||
    clean.includes("viability") ||
    clean.includes("cagan") ||
    clean.includes("business")
  ) {
    matchedKeys.push("philosophy");
  }

  if (
    clean.includes("problem") ||
    clean.includes("solution") ||
    clean.includes("workaround") ||
    clean.includes("why") ||
    clean.includes("assumption") ||
    clean.includes("think") ||
    clean.includes("thinking")
  ) {
    matchedKeys.push("thinking");
  }

  if (
    clean.includes("discovery") ||
    clean.includes("validation") ||
    clean.includes("validate") ||
    clean.includes("experiment") ||
    clean.includes("smoke") ||
    clean.includes("prototype")
  ) {
    matchedKeys.push("discovery");
  }

  if (
    clean.includes("research") ||
    clean.includes("interview") ||
    clean.includes("mom") ||
    clean.includes("jtbd") ||
    clean.includes("job") ||
    clean.includes("persona") ||
    clean.includes("journey") ||
    clean.includes("wireframe")
  ) {
    matchedKeys.push("research");
  }

  if (
    clean.includes("prioritize") ||
    clean.includes("priority") ||
    clean.includes("rice") ||
    clean.includes("ice") ||
    clean.includes("kano") ||
    clean.includes("moscow") ||
    clean.includes("feature") ||
    clean.includes("effort")
  ) {
    matchedKeys.push("prioritization");
  }

  if (
    clean.includes("metric") ||
    clean.includes("analytics") ||
    clean.includes("measure") ||
    clean.includes("north star") ||
    clean.includes("aarrr") ||
    clean.includes("heart") ||
    clean.includes("funnel") ||
    clean.includes("cohort") ||
    clean.includes("testing") ||
    clean.includes("a/b")
  ) {
    matchedKeys.push("analytics");
  }

  // Fallback if no clean keyword matched: load philosophy and thinking by default
  if (matchedKeys.length === 0) {
    return ["philosophy", "thinking"];
  }

  return matchedKeys;
}
