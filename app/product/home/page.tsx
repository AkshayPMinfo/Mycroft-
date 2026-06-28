"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Bot,
  Send,
  ArrowUpRight,
  ClipboardList,
  Compass,
  ArrowRight,
  Plus,
  Search,
  Trash2,
  Edit,
  Check,
  X,
  MessageSquare,
  Activity,
  ChevronRight,
  Clock,
  Sparkles,
  Paperclip,
  Bell,
  ChevronDown,
  GitBranch,
  Users,
  Target,
  FileText,
  ChevronLeft
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const STEPS = ["Discovery", "Define", "Design", "Develop", "Deliver", "Debrief"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getProjectProgressText(conv: Conversation) {
  if (conv.activeStep) {
    return `Current Stage • ${conv.activeStep}`;
  }
  return "Current Stage • Discovery";
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  workspaceCard?: {
    type: "Discovery" | "PRD" | "Dashboard";
    title: string;
    description: string;
    targetUrl: string;
  };
  action?: { label: string; stage: string };
}

interface PRDSection {
  title: string;
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  activeStep: string;
  messages: Message[];
  createdAt: string;
  appName: string;
  sentiment: string;
  positiveThemes: string[];
  complaints: string[];
  opportunityRecommendations: string[];
  prdTitle: string;
  prdVersion: number;
  prdStatus: "Draft" | "Review" | "Approved";
  prdSections: Record<string, PRDSection>;
  displayTime?: string; // Seeded string for exact match
  pmPath?: "A" | "B";
  pmStep?: number;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const defaultPRDSections = (): Record<string, PRDSection> => ({
  objective: { title: "Objective", content: "Build a 10-minute grocery delivery app designed for university campuses." },
  businessValue: { title: "Business Value", content: "Enables campus expansions and hyper-local monetization." },
  userValue: { title: "User Value", content: "Ensures predictable under-10-minute grocery delivery." },
  targetUsers: { title: "Target Users", content: "Students in university campuses in Bangalore." },
  userProblems: { title: "User Problems", content: "Campus gate access constraints, out-of-stock items mid-checkout." },
  proposedSolution: { title: "Proposed Solution", content: "Hyperlocal university warehouse hub mapping." },
  successMetrics: { title: "Success Metrics", content: "Target Quality score >= 90/100, and packing times under 60 seconds." },
  compliance: { title: "Compliance", content: "Standard GDPR residency rules and local data protection compliance apply." }
});

const defaultWelcomeMessage = (): Message => ({
  sender: "ai",
  text: "Welcome back, Akshay. I am Mycroft. Describe your product idea below, and I will guide you through the Product Management lifecycle. We will start with Product Discovery.",
  timestamp: "Just now"
});

const makeDefaultConv = (): Conversation => ({
  id: `conv_${Date.now()}`,
  title: "New Chat",
  activeStep: "Discovery",
  messages: [defaultWelcomeMessage()],
  createdAt: new Date().toISOString(),
  appName: "Zepto",
  sentiment: "82% Positive • 18% Negative",
  positiveThemes: [
    "Genuinely delivers in 10 minutes for major items.",
    "Fresh produce quality matches catalog snapshots.",
    "Extremely clean payment checkout flow."
  ],
  complaints: [
    "Items frequently display 'out of stock' midway through cart creation.",
    "Recent increases in packaging and delivery convenience fees.",
    "Riders speed dangerously to maintain delivery timelines."
  ],
  opportunityRecommendations: [
    "Launch a '60-Second Add-On' buffer mechanism that lets users append forgotten items to an active packing order to reduce duplicate deliveries."
  ],
  prdTitle: "10-Min Campuses Grocery Delivery Spec",
  prdVersion: 1,
  prdStatus: "Draft",
  prdSections: defaultPRDSections()
});

const makeSeededConversations = (): Conversation[] => [
  {
    id: "conv_upi_expense",
    title: "UPI Expense Manager",
    activeStep: "Discovery",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    appName: "UPI Expense Manager",
    sentiment: "88% Positive • 12% Negative",
    positiveThemes: ["Seamless UPI integration", "Intuitive budget category tagger"],
    complaints: ["Manual bank SMS matching is slow"],
    opportunityRecommendations: ["Implement automated split bill reminders directly via WhatsApp triggers"],
    prdTitle: "UPI Expense Manager PRD",
    prdVersion: 1,
    prdStatus: "Draft",
    prdSections: defaultPRDSections(),
    displayTime: "2:30 PM",
    pmPath: "A",
    pmStep: 2,
    messages: [
      {
        sender: "ai",
        text: "Hi Akshay! I'm Mycroft, your Senior AI Product Manager. Let's collaborate to discover, define, and launch your product.\n\nFirst decision: Does this product already exist, or is it a completely new concept?\n\n*You selected: **Existing Product** workflow.*",
        timestamp: "2:25 PM"
      },
      {
        sender: "user",
        text: "It is an existing product called UPI Expense Manager. We want to reduce user friction when adding manual cash splits.",
        timestamp: "2:28 PM"
      },
      {
        sender: "ai",
        text: "Got it. I have set our workspace to UPI Expense Manager.\n\n**Step 2: Secondary Research (User Feedback Analysis)**\nI have aggregated review clusters and complaints for this flow. Let's analyze the feedback:\n- *Complaint Cluster 1*: Manual bank SMS parsing is laggy or fails on campus networks.\n- *Complaint Cluster 2*: Lack of quick split triggers from WhatsApp.\n\nWhat other user request patterns or complaints have we observed? Or should we proceed to competitor profiling?",
        timestamp: "2:30 PM",
        workspaceCard: {
          type: "Discovery",
          title: "Discovery Workspace Active",
          description: "UPI Expense Manager user clusters loaded.",
          targetUrl: "/product/discovery"
        }
      }
    ]
  },
  {
    id: "conv_zepto_checkout",
    title: "Zepto Checkout Improvement",
    activeStep: "Define",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    appName: "Zepto",
    sentiment: "82% Positive • 18% Negative",
    positiveThemes: ["Fast payment processing", "Coupons apply cleanly"],
    complaints: ["Items go out of stock mid-checkout", "Packaging fee increases"],
    opportunityRecommendations: ["Launch a 60-Second Add-On buffer before order sealing"],
    prdTitle: "Zepto Checkout Optimisation Spec",
    prdVersion: 2,
    prdStatus: "Review",
    prdSections: defaultPRDSections(),
    displayTime: "11:15 AM",
    pmPath: "A",
    pmStep: 5,
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. We are currently in the **Define** stage for Zepto Checkout Improvement. We have completed competitor gap mapping and validated the '60-Second Add-On Buffer' opportunity.\n\nLet's review the RICE prioritization:\n- *Reach*: High (all campus orders)\n- *Impact*: 2.0 (reduces double shipping fees)\n- *Confidence*: 80% (proven complaint logs)\n- *Effort*: Medium\n\nClick the button below to transition to the Define stage and generate the spec.",
        timestamp: "11:15 AM",
        workspaceCard: {
          type: "PRD",
          title: "PRD Spec Draft (v2)",
          description: "Zepto checkout optimizations ready for review.",
          targetUrl: "/product/prds"
        }
      }
    ]
  },
  {
    id: "conv_healthtech_ai",
    title: "HealthTech AI Assistant",
    activeStep: "Research",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    appName: "HealthTech AI Assistant",
    sentiment: "85% Positive",
    positiveThemes: ["Accurate initial triage", "Friendly tone"],
    complaints: ["Triage takes too many questions"],
    opportunityRecommendations: ["Pre-populate vitals from smartwatch sync APIs"],
    prdTitle: "HealthTech Symptom Checker Spec",
    prdVersion: 1,
    prdStatus: "Draft",
    prdSections: defaultPRDSections(),
    displayTime: "8:45 PM",
    pmPath: "A",
    pmStep: 3,
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. We are on **Step 3: Competitor Research** for the HealthTech AI symptom checker. How do direct healthcare portals handle initial triage questions? Let's trace their gaps.",
        timestamp: "8:45 PM"
      }
    ]
  },
  {
    id: "conv_fintech_students",
    title: "Fintech for Students",
    activeStep: "Discovery",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    appName: "Fintech for Students",
    sentiment: "90% Positive",
    positiveThemes: ["Easy card lock toggle", "Pocket money charts"],
    complaints: ["Transaction failure rates on campus wifi"],
    opportunityRecommendations: ["Introduce offline tokenized campus payments"],
    prdTitle: "Student Fintech Card Specification",
    prdVersion: 1,
    prdStatus: "Draft",
    prdSections: defaultPRDSections(),
    displayTime: "5:20 PM",
    pmPath: "B",
    pmStep: 1,
    messages: [
      {
        sender: "ai",
        text: "Hi Akshay! I'm Mycroft, your Senior AI Product Manager. Let's collaborate to build your new startup concept.\n\n*Path selected: **New Product** (Path B).*\n\n**Step 1: Understand the Objective**\nWhat is the core business objective or vision for this Student Fintech product? What is the main problem we want to solve first?",
        timestamp: "5:20 PM"
      }
    ]
  },
  {
    id: "conv_saas_onboarding",
    title: "SaaS Onboarding Redesign",
    activeStep: "Design",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    appName: "SaaS Onboarding Redesign",
    sentiment: "80% Positive",
    positiveThemes: ["Clean wizard layout"],
    complaints: ["Drop-offs at workspace creation screen"],
    opportunityRecommendations: ["Default templates based on role choice during sign-up"],
    prdTitle: "SaaS Onboarding Spec",
    prdVersion: 1,
    prdStatus: "Draft",
    prdSections: defaultPRDSections(),
    displayTime: "Jun 24",
    pmPath: "B",
    pmStep: 8,
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. The onboarding layout wireframes have been mapped. Should we review the interactive setup wizard specs?",
        timestamp: "Jun 24"
      }
    ]
  },
  {
    id: "conv_ai_meeting_notes",
    title: "AI Meeting Notes App",
    activeStep: "PRD",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    appName: "AI Meeting Notes App",
    sentiment: "84% Positive",
    positiveThemes: ["Auto-summarize accuracy"],
    complaints: ["Slow transcription processing"],
    opportunityRecommendations: ["Implement client-side speech processing for short snippets"],
    prdTitle: "AI Meeting Notes Specification",
    prdVersion: 1,
    prdStatus: "Draft",
    prdSections: defaultPRDSections(),
    displayTime: "Jun 22",
    pmPath: "B",
    pmStep: 9,
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. The PRD is drafted. Should we run an automated compliance or clarity audit on the sections?",
        timestamp: "Jun 22"
      }
    ]
  },
  {
    id: "conv_food_loyalty",
    title: "Food Delivery Loyalty",
    activeStep: "Discovery",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    appName: "Food Delivery Loyalty",
    sentiment: "75% Positive",
    positiveThemes: ["Points match discount values"],
    complaints: ["Redemption is hidden under many screens"],
    opportunityRecommendations: ["Inject direct point apply checkboxes at the cart checkout page"],
    prdTitle: "Food Loyalty Spec",
    prdVersion: 1,
    prdStatus: "Draft",
    prdSections: defaultPRDSections(),
    displayTime: "Jun 20",
    pmPath: "B",
    pmStep: 4,
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. I have prepared the competitive maps for food delivery subscription models. Shall we explore customer churn indicators?",
        timestamp: "Jun 20"
      }
    ]
  }
];

export default function AIHomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Home Screen Layout views
  const [showChatView, setShowChatView] = useState(false);

  // Sidebar collapse states
  const [convSidebarCollapsed, setConvSidebarCollapsed] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Greeting based on time
  const [greeting, setGreeting] = useState("Good morning");

  // Bootstrap state
  useEffect(() => {
    const savedConvs = localStorage.getItem("mycroft_home_conversations");
    const savedActiveId = localStorage.getItem("mycroft_home_active_conv_id");
    const savedConvCollapse = localStorage.getItem("mycroft_conv_sidebar_collapsed_home");

    if (savedConvCollapse !== null) {
      setConvSidebarCollapsed(savedConvCollapse === "true");
    }

    let loadedConvs: Conversation[] = [];
    if (savedConvs) {
      try {
        loadedConvs = JSON.parse(savedConvs);
      } catch (e) {
        console.error(e);
      }
    }

    if (loadedConvs.length === 0) {
      const seeded = makeSeededConversations();
      setConversations(seeded);
      setActiveConvId("conv_upi_expense");
    } else {
      setConversations(loadedConvs);
      setActiveConvId(savedActiveId || loadedConvs[0].id);
    }

    const hours = new Date().getHours();
    if (hours >= 17) {
      setGreeting("Good evening");
    } else if (hours >= 12) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good morning");
    }

    setIsLoaded(true);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("mycroft_home_conversations", JSON.stringify(conversations));
    localStorage.setItem("mycroft_home_active_conv_id", activeConvId);

    const active = conversations.find(c => c.id === activeConvId);
    if (active) {
      const discoveryObj = {
        appName: active.appName,
        sentiment: active.sentiment,
        positiveThemes: active.positiveThemes,
        complaints: active.complaints,
        recommendations: active.opportunityRecommendations,
        requestedFeatures: ["60-Second Add-On buffer", "Adaptive regional delivery splits"],
        opportunityAreas: ["Bengaluru student corridors", "Out-of-stock optimization"]
      };
      localStorage.setItem("mycroft_active_discovery", JSON.stringify(discoveryObj));

      const savedPrdsHistory = localStorage.getItem("mycroft_prds_history");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let history: any[] = [];
      if (savedPrdsHistory) {
        try {
          history = JSON.parse(savedPrdsHistory);
        } catch (e) {
          console.error(e);
        }
      }

      const activePrd = {
        id: history.length > 0 ? history[0].id : `prd_${active.id}`,
        title: active.prdTitle,
        version: active.prdVersion,
        status: active.prdStatus,
        lastModified: new Date().toISOString(),
        qualityScore: history.length > 0 ? history[0].qualityScore : 90,
        complianceCountry: history.length > 0 ? history[0].complianceCountry : "India",
        sections: {
          objective: active.prdSections.objective.content,
          businessValue: active.prdSections.businessValue?.content || "",
          userValue: active.prdSections.userValue?.content || "",
          targetUsers: active.prdSections.targetUsers.content,
          userProblems: active.prdSections.userProblems?.content || "",
          proposedSolution: active.prdSections.proposedSolution?.content || "",
          successMetrics: active.prdSections.successMetrics.content,
          compliance: active.prdSections.compliance.content
        },
        versions: history.length > 0 ? history[0].versions || [1] : [1]
      };
      if (history.length > 0) {
        history[0] = activePrd;
      } else {
        history = [activePrd];
      }
      localStorage.setItem("mycroft_prds_history", JSON.stringify(history));
    }
  }, [conversations, activeConvId, isLoaded]);

  // Scroll to bottom on chat view
  useEffect(() => {
    if (showChatView) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeConvId, showChatView]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Toggle conversations sidebar collapse
  const toggleConvSidebar = () => {
    const nextVal = !convSidebarCollapsed;
    setConvSidebarCollapsed(nextVal);
    localStorage.setItem("mycroft_conv_sidebar_collapsed_home", String(nextVal));
  };

  // Start new clean conversation
  const handleNewChat = useCallback(() => {
    const newConv = makeDefaultConv();
    // Update welcome message to prompt the first decision
    newConv.messages = [
      {
        sender: "ai",
        text: "Hi Akshay! I am Mycroft, your Senior AI Product Manager. Let's collaborate to discover, define, and launch your product.\n\nFirst decision:\n**Does this product already exist (e.g. adding features to Zepto, Uber, WhatsApp) or is it a completely new concept (e.g. a brand new startup or SaaS idea)?**",
        timestamp: "Just now"
      }
    ];
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setShowChatView(false);
    setChatInput("");
    setAttachedFile(null);
  }, []);

  const handleDeleteChat = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated.length > 0 ? updated : [makeDefaultConv()]);
    if (activeConvId === id) {
      setActiveConvId(updated.length > 0 ? updated[0].id : "");
      setShowChatView(false);
    }
  }, [conversations, activeConvId]);

  const handleAction = useCallback((action: { label: string; stage: string }) => {
    if (!activeConv) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          activeStep: action.stage,
          messages: [...c.messages, {
            sender: "ai" as const,
            text: `Lifecycle stage transitioned to: **${action.stage}**. Relevant workspace cards have been generated inline.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }]
        };
      }
      return c;
    }));
  }, [activeConv, activeConvId]);

  const handleSendMessage = useCallback((textToSend?: string) => {
    const input = textToSend || chatInput;
    if (!input.trim() || !activeConv) return;

    // Transition to chat view
    setShowChatView(true);

    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Determine updated title from first prompt
    let updatedTitle = activeConv.title;
    if (activeConv.title === "New Chat" || (activeConv.title === "UPI Expense Manager" && activeConv.messages.length <= 1)) {
      updatedTitle = input.length > 28 ? `${input.substring(0, 28)}...` : input;
    }

    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, title: updatedTitle, messages: [...c.messages, userMsg] } : c
    ));
    if (!textToSend) setChatInput("");
    setAttachedFile(null);
    setIsGenerating(true);

    // AI Mock Response Logic
    setTimeout(() => {
      const userText = input.trim();
      const userTextLower = userText.toLowerCase();
      
      let aiText = "";
      let targetStage = activeConv.activeStep;
      let nextAction: Message["action"] = undefined;
      let card: Message["workspaceCard"] = undefined;

      // Get path and step parameters
      let path = activeConv.pmPath;
      let step = activeConv.pmStep ?? 0;

      // Decision Gate: Determine A or B
      if (!path) {
        if (userTextLower.includes("exist") || userTextLower.includes("yes") || userTextLower.includes("zepto") || userTextLower.includes("uber") || userTextLower.includes("whatsapp") || userTextLower.includes("airbnb")) {
          path = "A";
          step = 1;
          aiText = "Understood. We are analyzing an **Existing Product** (Path A).\n\n**Step 1: Understand the Objective**\nWhat is the core business or product objective for this initiative?\nCommon options include:\n- Increase retention / reduce churn\n- Improve activation / onboarding\n- Increase revenue / conversion rates\n- Optimize checkout flow\n\nPlease describe your objective and why this is a priority now. Why do you believe this problem exists?";
        } else if (userTextLower.includes("new") || userTextLower.includes("no") || userTextLower.includes("startup") || userTextLower.includes("saas") || userTextLower.includes("fintech")) {
          path = "B";
          step = 1;
          aiText = "Exciting! We are embarking on a **New Product** journey (Path B).\n\n**Step 1: Understand the Objective**\nWhat is the core business objective or vision for this new product? What problem does it solve in the market?";
        } else {
          // Guess Path A if they didn't specify
          path = "A";
          step = 1;
          aiText = `Understood. Let's analyze this as an **Existing Product** context.\n\n**Step 1: Understand the Objective**\nWhat is the primary business or product objective for this initiative? (e.g. increase retention, improve onboarding, reduce churn, improve checkout). Why is this objective important right now?`;
        }
      } else if (path === "A") {
        // Path A: Existing Product
        if (step === 1) {
          step = 2;
          aiText = `Objective baseline logged. Now let's challenge our assumptions first. Why do we think this drop-off or problem exists? Is it due to packaging/delivery fees, out-of-stock items, or payment friction?

**Step 2: Secondary Research (User Complaints & Reviews)**
I have aggregated and analyzed the latest reviews from the Google Play Store and Apple App Store.
* Google Play reviews analyzed: 100
* Apple App Store reviews analyzed: 100

### Top recurring complaints
1. **Out-of-stock items during checkout** (41%) — Users report items showing as available during browsing but disappearing right at final checkout.
2. **Unexpectedly high delivery charges** (27%) — High fees added at checkout cause immediate cart abandonment.
3. **Coupon failures at final step** (18%) — Promo codes apply in cart but fail at payment.
4. **Payment gateway failures** (9%) — UPI or card transaction timeouts.
5. **App lag/performance issues** (5%) — Delayed checkout page loads.

### Common feature requests
* Save multiple carts for later checkout.
* Better item substitutions (e.g., auto-replace out-of-stock items with closest match).
* High-accuracy delivery ETA indicators.

One concern I have is that coupon failures and out-of-stock drop-offs are creating a trust barrier. Let's think aloud: should we focus on fixing the inventory auto-substitution model first, or should we design a checkout-recovery mechanism?

What other user request patterns or complaints have we observed? Or should we proceed to competitor profiling?`;
        } else if (step === 2) {
          step = 3;
          aiText = `Let's perform a competitor landscape mapping. I've synthesized competitor behavior for major players in this category:

### Direct Competitors
* **Competitor X (e.g., Blinkit)**:
  * *Strengths*: Highly optimized checkout flow (2 clicks to order); clear real-time item availability status.
  * *Weaknesses*: No post-order item addition; rigid delivery fee structures.
* **Competitor Y (e.g., Instamart)**:
  * *Strengths*: Flexible order-modification window (1-minute after checkout).
  * *Weaknesses*: Confusing coupon application flows; frequent payment gateway lag.

### Indirect Competitors
* **Large Grocery Apps**: Great inventory predictability, but checkout is slow and requires multi-step slot selection.

### Market Gaps & Recommended Opportunities
1. **Post-Checkout Order Modifications (RICE Rank 1)**: Users frequently forget 1 or 2 items. Letting them add items within a brief window eliminates double shipping fees and increases Average Order Value (AOV).
2. **Real-time Predictive Substitution Engine (RICE Rank 2)**: Recommending immediate alternatives for low-stock items before checkout completes.

I recommend prioritizing the **Post-Checkout Order Modification** opportunity because it directly targets the high-friction "forgotten items" paint point without requiring heavy machine learning pipelines. 

I'd like to validate one assumption first: does our warehouse packing workflow support a 60-second delay to allow item addition? If so, we can move forward. What are your thoughts on this operational constraint?`;
        } else if (step === 3) {
          step = 4;
          aiText = `I recommend we focus on the **'60-Second Add-On Buffer'** solution. 

I recommend this specific opportunity because our competitor research showed that none of our direct competitors currently support clean post-order merging without cancelling the active order. This gives us a strong market differentiator while directly resolving the 27% checkout drop-off caused by unexpected delivery charges (since users won't pay double shipping to get forgotten items).

### Let's map out the proposed solution:
* **The '60-Second Add-On Buffer'**: A sticky, low-friction banner appears on the checkout success screen with a 60-second countdown timer. It lets the user browse and append items to their active packing order in a single click.

I don't think we should jump to a full PRD yet. First, how severe is our packing constraint? Can we afford to delay packing by 60 seconds? Or should we investigate real-time auto-substitution first?`;
        } else if (step === 4) {
          step = 5;
          aiText = `I've mapped out the prioritization matrices. I recommend the '60-Second Add-On Buffer' as our primary candidate.

### Prioritization Reasoning
* **Reach**: High. Approximately 34% of checkout users report forgetting an item or placing a duplicate order within 5 minutes.
* **Impact**: High. Reduces duplicate delivery fleet trips, saving shipping subsidy costs, and boosts customer retention.
* **Confidence**: 80%. Validated by direct feedback complaining about secondary delivery charges.
* **Effort**: Medium. Built entirely on top of our existing checkout state transition hooks.

I recommend this because it has the highest RICE score compared to alternative models like machine-learning based predictive carts, which would require extensive training data and time.

We are ready to transition to the **Define** stage to draft the PRD and roadmap. Click the action button below to move to the Define stage.`;
          nextAction = { label: "Move to Define (PRD)", stage: "Define" };
        } else if (step === 5) {
          step = 6;
          targetStage = "Define";
          aiText = `We have transitioned to **Define**. I have generated the following workspace artifacts:
- **Product Discovery**: Updated with review clusters and competitive gap analysis.
- **PRD Workspace**: Created a new draft spec (v1) with sections for Objective, Target Users, Success Metrics, and Proposed Solution.
- **Dashboard**: Added the payment tokenization and checkout roadmap milestones.

I've also generated a low-fidelity wireframe concept:
*Wireframe concept*: A sticky 'Add item to order' banner on the checkout success screen showing a 60-second countdown timer.

You can open these workspaces directly using the cards below to review and edit.`;
          card = { type: "PRD", title: "PRD Spec Draft (v2)", description: "Zepto checkout optimizations ready for review.", targetUrl: "/product/prds" };
        } else {
          aiText = "The discovery and definition cycles are complete. What part of the design or development milestone would you like to review next?";
        }
      } else {
        // Path B: New Product
        if (step === 1) {
          step = 2;
          aiText = `Objective baseline logged. I noticed something interesting: for a new product, we often fail by defining our target audience too broadly. Let's narrow it down. 

I'd like to validate one assumption first: do our target users prioritize onboarding speed or transaction security? 

I recommend we focus initially on a tight niche (e.g. urban college students) because they have high viral potential and low customer acquisition costs (CAC). Let's define the primary persona and why they will switch to our solution today.`;
        } else if (step === 2) {
          step = 3;
          aiText = `Target persona defined. Let's analyze the market size and structural barriers. 

Based on my analysis, the TAM (Total Addressable Market) is substantial, but I have one concern: regulatory compliance (such as DPDP Act 2023 and local FinTech licensing) represents a massive barrier. 

I recommend a compliance-first launch strategy because launching without secure card tokenization and audit trails is high risk. Let's outline what market assumptions we are making.`;
        } else if (step === 3) {
          step = 4;
          aiText = `Here is our competitor gap analysis for the new product domain:

### Direct Competitors
* **Competitor A**:
  * *Strengths*: Large distribution network; rich loyalty integrations.
  * *Weaknesses*: Complex multi-step transaction steps; poor offline support.
* **Competitor B**:
  * *Strengths*: Minimalist interface.
  * *Weaknesses*: Slow settlement times; lack of transparent pricing.

### Market Gaps & USP Recommendation
We have identified a significant gap in instant, offline-capable microtransactions. 

I recommend we position our product around a **'Minimalist, Offline-First Micro-Wallet'** because it directly addresses the high transaction failure rates on campus network zones, giving us a clear competitive edge. What are your thoughts on this positioning?`;
        } else if (step === 4) {
          step = 5;
          aiText = `Competitor profiles mapped. I recommend the premium specialized micro-wallet service positioning option because it addresses the key user pain points in offline environments without triggering high cash burn risk. Which USP do you want to lock in?`;
        } else if (step === 5) {
          step = 6;
          aiText = `USP selected and positioning locked. Let's define the feature set.

I've generated a draft feature list. Let's categorize them:
- *Must Have*: Core offline token authentication.
- *Should Have*: Quick merchant payment widgets.
- *Could Have*: Notifications and loyalty stamps.
- *Future*: AI-driven predictive balance top-ups.

I recommend we prioritize these using the Kano framework first rather than jumping directly to execution. Let's move to Step 7.`;
        } else if (step === 6) {
          step = 7;
          aiText = `**Step 7: Prioritize (Kano Model)**
I have prioritized the features using the Kano framework:
- Core transaction flows belong to Must Have (basic expectation).
- Offline tokenized cards belong to Performance (adds user value proportionally).
- One-click split bills belong to Delighter.

I recommend this breakdown because it balances absolute baseline stability with high-delight features. Do you agree with this categorization, or should we adjust any feature placement?`;
        } else if (step === 7) {
          step = 8;
          aiText = `Feature priority aligned. Let's outline the layout.

*Wireframe concept*: A simple 3-tab layout: Home, Payments, and Transactions. Focus on distraction-free flows to reduce user cognitive load.

I don't think we should jump to coding yet. Let's write the PRD Specification first.`;
        } else if (step === 8) {
          step = 9;
          aiText = `**Step 9: Generate PRD**
I have created a new draft PRD containing the Objective, Target Users, Feature prioritization, and compliance mappings in the PRD Workspace.

I recommend we review this PRD carefully before defining Success Metrics in Step 10.`;
          card = { type: "PRD", title: "PRD Spec Draft (v1)", description: "PRD Draft ready for target app in PRD Workspace.", targetUrl: "/product/prds" };
        } else if (step === 9) {
          step = 10;
          aiText = `**Step 10: Generate Success Metrics**
- *North Star*: Weekly Active Transactions.
- *Input Metrics*: User onboarding time, payment success rates.
- *Output Metrics*: Month 1 retention rates.
- *Guardrail Metrics*: Transaction latency (must be < 2 seconds).

I recommend this set of metrics because they directly measure product value delivery (North Star) and operational health (latency). Let's define the release roadmap milestones in Step 11.`;
        } else if (step === 10) {
          step = 11;
          aiText = `**Step 11: Generate Roadmap**
- *Milestone 1 (Month 1)*: MVP Core Flow release.
- *Milestone 2 (Month 2)*: Security auditing and compliance setup.
- *Milestone 3 (Month 3)*: Analytics integration and dashboard reporting.

I recommend this phased release schedule because it validates core product market fit before spending effort on secondary compliance auditing. Let's consolidate our PM decisions and notes in Step 12.`;
          card = { type: "Dashboard", title: "Roadmap Milestones Loaded", description: "Payments roadmap generated on active Dashboard.", targetUrl: "/product/dashboard" };
        } else if (step === 11) {
          step = 12;
          targetStage = "Define";
          aiText = `**Step 12: Generate Product Notes**
I have summarized our research, assumptions, risk mitigation strategies, and trade-offs into the Product Discovery and PRD workspaces. The discovery phase is officially complete!

I recommend transitioning to design sprints next. You can continue exploring the product roadmap and workspace dashboards using the links.`;
        } else {
          aiText = "Our discovery and requirements planning is fully complete. What area should we deep-dive next?";
        }
      }

      const aiMsg: Message = {
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        workspaceCard: card,
        action: nextAction
      };

      setConversations(prev => prev.map(c => {
        if (c.id !== activeConvId) return c;
        const nextStep = nextAction ? nextAction.stage : targetStage;
        const updatedSections = { ...c.prdSections };
        let updatedVersion = c.prdVersion;
        let updatedStatus = c.prdStatus;

        if (userTextLower.includes("student") || userTextLower.includes("bangalore"))
          updatedSections.targetUsers.content = "Students in university campuses in Bangalore.";
        if (userTextLower.includes("metrics") || userTextLower.includes("score"))
          updatedSections.successMetrics.content = "Target Quality score >= 90/100, and packing times under 60 seconds.";
        if (userTextLower.includes("compliance") || userTextLower.includes("rbi")) {
          updatedSections.compliance.content = "RBI FinTech Guidelines, DPDP Act 2023 compliance audits, and PCI-DSS payment tokenization protocols.";
          updatedVersion += 1;
        }
        if (userTextLower.includes("move") || userTextLower.includes("design") || userTextLower.includes("develop"))
          updatedStatus = "Approved";

        return {
          ...c,
          pmPath: path,
          pmStep: step,
          activeStep: nextStep,
          prdSections: updatedSections,
          prdVersion: updatedVersion,
          prdStatus: updatedStatus,
          messages: [...c.messages, aiMsg]
        };
      }));

      setIsGenerating(false);
    }, 800);
  }, [chatInput, activeConv, activeConvId, conversations]);

  // Handle Attachment trigger
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  // Group conversations for sidebar history
  const getGroupedConversations = () => {
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const earlier: Conversation[] = [];

    conversations.forEach(c => {
      if (c.displayTime) {
        if (c.displayTime.includes("AM") || c.displayTime.includes("PM")) {
          if (c.id === "conv_upi_expense" || c.id === "conv_zepto_checkout") {
            today.push(c);
          } else {
            yesterday.push(c);
          }
        } else {
          earlier.push(c);
        }
      } else {
        const diff = Date.now() - new Date(c.createdAt).getTime();
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
          today.push(c);
        } else if (diffDays === 1) {
          yesterday.push(c);
        } else {
          earlier.push(c);
        }
      }
    });

    return { today, yesterday, earlier };
  };

  const grouped = getGroupedConversations();

  return (
    <div className="flex h-screen bg-white font-sans antialiased text-slate-800 overflow-hidden relative">

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ── Column 1: Collapsible Conversation History Sidebar (250px) ── */}
      <div className={cn(
        "border-r border-slate-100 bg-[#fafafa] flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out relative z-10",
        convSidebarCollapsed ? "w-0 opacity-0 overflow-hidden pointer-events-none" : "w-[250px]"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-white">
          <span className="text-sm font-semibold text-slate-800 tracking-tight">Conversations</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <Search className="size-3.5" />
            </button>
            <button
              onClick={toggleConvSidebar}
              className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Collapse Panel"
            >
              <ChevronLeft className="size-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Groups */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          
          {/* Today Group */}
          {grouped.today.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">Today</p>
              {grouped.today.map(c => {
                const isActive = c.id === activeConvId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveConvId(c.id);
                      setShowChatView(true);
                    }}
                    className={cn(
                      "group flex flex-col px-3 py-2 rounded-xl cursor-pointer transition-all relative border border-transparent",
                      isActive
                        ? "bg-violet-50/70 border-violet-100 text-slate-900"
                        : "hover:bg-slate-50 text-slate-600 hover:text-slate-950"
                    )}
                  >
                    <div className="flex items-start justify-between gap-1.5 w-full">
                      <span className="text-xs font-semibold truncate flex-1 leading-snug">{c.title}</span>
                      <span className="text-[9px] text-slate-400 whitespace-nowrap pt-0.5">{c.displayTime || "Today"}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Stage: {c.activeStep}</span>
                    {isActive && (
                      <span className="absolute right-3.5 bottom-3.5 size-1.5 rounded-full bg-violet-600 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Yesterday Group */}
          {grouped.yesterday.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">Yesterday</p>
              {grouped.yesterday.map(c => {
                const isActive = c.id === activeConvId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveConvId(c.id);
                      setShowChatView(true);
                    }}
                    className={cn(
                      "group flex flex-col px-3 py-2 rounded-xl cursor-pointer transition-all relative border border-transparent",
                      isActive
                        ? "bg-violet-50/70 border-violet-100 text-slate-900"
                        : "hover:bg-slate-50 text-slate-600 hover:text-slate-950"
                    )}
                  >
                    <div className="flex items-start justify-between gap-1.5 w-full">
                      <span className="text-xs font-semibold truncate flex-1 leading-snug">{c.title}</span>
                      <span className="text-[9px] text-slate-400 whitespace-nowrap pt-0.5">{c.displayTime || "Yesterday"}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Stage: {c.activeStep}</span>
                    {isActive && (
                      <span className="absolute right-3.5 bottom-3.5 size-1.5 rounded-full bg-violet-600 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Earlier Group */}
          {grouped.earlier.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">Earlier</p>
              {grouped.earlier.map(c => {
                const isActive = c.id === activeConvId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveConvId(c.id);
                      setShowChatView(true);
                    }}
                    className={cn(
                      "group flex flex-col px-3 py-2 rounded-xl cursor-pointer transition-all relative border border-transparent",
                      isActive
                        ? "bg-violet-50/70 border-violet-100 text-slate-900"
                        : "hover:bg-slate-50 text-slate-600 hover:text-slate-950"
                    )}
                  >
                    <div className="flex items-start justify-between gap-1.5 w-full">
                      <span className="text-xs font-semibold truncate flex-1 leading-snug">{c.title}</span>
                      <span className="text-[9px] text-slate-400 whitespace-nowrap pt-0.5">{c.displayTime || "Earlier"}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Stage: {c.activeStep}</span>
                    {isActive && (
                      <span className="absolute right-3.5 bottom-3.5 size-1.5 rounded-full bg-violet-600 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 bg-white flex justify-center">
          <button className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
            View all conversations
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>

      {/* ── Column 2: Main Workspace Canvas ── */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">

        {/* ── Top Navigation Bar ── */}
        <header className="shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-white z-20">
          
          {/* Left Controls: Conversations expand button if collapsed */}
          <div className="flex items-center gap-3">
            {convSidebarCollapsed && (
              <button
                onClick={toggleConvSidebar}
                className="flex items-center gap-1.5 text-slate-500 hover:bg-slate-150 hover:text-slate-900 transition-colors p-1.5 rounded-lg border border-slate-200/60"
                title="Expand Conversations History"
              >
                <ChevronRight className="size-4" />
                <span className="text-[11px] font-semibold pr-1">Conversations</span>
              </button>
            )}

            {/* Stepper Selector (only in active chat view) */}
            {showChatView && activeConv && (
              <div className="hidden md:flex items-center gap-0.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-155 select-none">
                {STEPS.map((step, idx) => {
                  const isActive = activeConv.activeStep === step;
                  const isCompleted = STEPS.indexOf(activeConv.activeStep) > idx;
                  return (
                    <React.Fragment key={step}>
                      {idx > 0 && <ChevronRight className="size-3 text-slate-250 mx-0.5" />}
                      <button
                        onClick={() => handleAction({ label: `Goto ${step}`, stage: step })}
                        className={cn(
                          "px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition-all duration-200",
                          isActive
                            ? "bg-slate-950 text-white font-bold px-2"
                            : isCompleted
                              ? "text-slate-700 hover:text-slate-955"
                              : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {step}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
            
            {showChatView && (
              <button
                onClick={() => setShowChatView(false)}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-955 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-50 border border-slate-200/40"
              >
                ← Back to Home
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* New Chat Button */}
            <Button
              onClick={handleNewChat}
              variant="secondary"
              className="h-8 px-3.5 rounded-lg border-violet-200 text-violet-600 hover:bg-violet-50/50 text-[12px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Plus className="size-3.5" />
              New Chat
            </Button>

            {/* Search Icon */}
            <button className="text-slate-500 hover:text-slate-800 transition-colors">
              <Search className="size-4.5" />
            </button>

            {/* Notification Bell */}
            <div className="relative cursor-pointer">
              <Bell className="size-4.5 text-slate-500 hover:text-slate-800 transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-violet-600 rounded-full" />
            </div>

            {/* User Profile Avatar dropdown indicator */}
            <div className="flex items-center gap-1 cursor-pointer">
              <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-[11px] font-bold border border-slate-200">
                AA
              </div>
              <ChevronDown className="size-3 text-slate-400" />
            </div>
          </div>
        </header>

        {/* ── View Container ── */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">

          {/* ==================== VIEW 1: WIREFRAME LANDING SCREEN ==================== */}
          {!showChatView ? (
            <div className="flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full px-6 py-12 space-y-8 pb-32">
              
              {/* Header Titles */}
              <div className="space-y-2 text-center w-full">
                <p className="text-[13px] font-semibold text-slate-500">{greeting}, Akshay! 👋</p>
                <h2 className="text-[36px] font-bold text-slate-900 tracking-tight leading-tight">What are we building today?</h2>
                <p className="text-[13.5px] text-slate-500 font-medium">I&apos;ll help you discover, define and build products users love.</p>
              </div>

              {/* Large Prompt Input Box */}
              <div className="border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100/50 bg-white w-full">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe your product idea or improvement goal..."
                  rows={4}
                  className="w-full text-[14px] text-slate-800 placeholder:text-slate-400 resize-none bg-transparent focus:outline-none leading-relaxed"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                />
                
                {/* Attached File indicator */}
                {attachedFile && (
                  <div className="flex items-center gap-1.5 self-start px-2.5 py-1 bg-violet-50 text-violet-700 text-[11px] rounded-lg border border-violet-100 font-semibold mb-2 mt-1 shrink-0 max-w-fit">
                    <Paperclip className="size-3" />
                    <span className="truncate max-w-[150px]">{attachedFile}</span>
                    <button onClick={() => setAttachedFile(null)} className="hover:text-red-500 font-bold ml-1">×</button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={handleAttachmentClick}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-655 transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="size-4.5" />
                  </button>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!chatInput.trim()}
                    className="size-9 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-sm hover:scale-105 active:scale-95 duration-200"
                  >
                    <Send className="size-3.5" />
                  </button>
                </div>
              </div>



            </div>
          ) : (
            /* ==================== VIEW 2: ACTIVE CONVERSATION / CHAT INTERFACE ==================== */
            <div className="flex-1 w-full max-w-3xl mx-auto px-6 pt-6 pb-48">
              {activeConv ? (
                <div className="space-y-6">
                  {activeConv.messages.map((msg, idx) => {
                    const isAi = msg.sender === "ai";
                    return (
                      <div key={idx} className="space-y-2.5">
                        <div className={`flex gap-3.5 ${!isAi && "justify-end"}`}>
                          {isAi && (
                            <div className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0 mt-0.5">
                              M
                            </div>
                          )}
                          <div className="space-y-2 max-w-[82%]">
                            {/* Message bubble */}
                            <div
                              className={cn(
                                "px-4 py-3 rounded-2xl text-[13px] leading-relaxed",
                                isAi
                                  ? "bg-slate-50 text-slate-800 rounded-tl-[4px] border border-slate-100"
                                  : "bg-violet-600 text-white rounded-tr-[4px]"
                              )}
                              style={{ whiteSpace: "pre-line" }}
                            >
                              {msg.text}
                            </div>

                            {/* Timestamp */}
                            <p className={cn(
                              "text-[10px] font-medium px-1 text-slate-400",
                              !isAi && "text-right"
                            )}>
                              {msg.timestamp}
                            </p>

                            {/* Workspace card */}
                            {isAi && msg.workspaceCard && (
                              <Card className="p-3.5 border border-slate-100 bg-white shadow-xs rounded-xl flex items-center justify-between gap-4 max-w-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                    {msg.workspaceCard.type === "Discovery" ? (
                                      <Compass className="size-4" />
                                    ) : msg.workspaceCard.type === "PRD" ? (
                                      <ClipboardList className="size-4" />
                                    ) : (
                                      <Activity className="size-4" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-[11px] font-bold text-slate-900 truncate">{msg.workspaceCard.title}</h4>
                                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{msg.workspaceCard.description}</p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => window.location.assign(msg.workspaceCard!.targetUrl)}
                                  className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs shrink-0 transition-colors"
                                >
                                  Open
                                  <ArrowUpRight className="size-3" />
                                </Button>
                              </Card>
                            )}

                            {/* Stage action button */}
                            {isAi && msg.action && (
                              <Button
                                onClick={() => handleAction(msg.action!)}
                                className="h-8 px-3.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                {msg.action.label}
                                <ArrowRight className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Thinking indicator */}
                  {isGenerating && (
                    <div className="flex gap-3.5">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0 mt-0.5">M</div>
                      <div className="bg-slate-50 border border-slate-100 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-[4px] text-[13px]">
                        <span className="inline-flex gap-1 items-center">
                          <span className="animate-bounce [animation-delay:0ms]">·</span>
                          <span className="animate-bounce [animation-delay:150ms]">·</span>
                          <span className="animate-bounce [animation-delay:300ms]">·</span>
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                  <Bot className="size-12 text-slate-150 mb-3" />
                  <p className="text-sm font-medium text-slate-500">Select or start a conversation</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── Active Chat Composer (displayed only when chatting) ── */}
        {showChatView && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6 pointer-events-none z-10">
            <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-3.5 pointer-events-auto flex flex-col gap-2.5 transition-all">
              <div className="flex gap-2.5 items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={activeConv ? `Ask Mycroft about the ${activeConv.activeStep} stage…` : "Type a message…"}
                  className="flex-1 px-4 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-slate-50/60 placeholder:text-slate-400 leading-relaxed transition-shadow"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isGenerating || !activeConv}
                />
                
                {/* Inline attached file display in chat composer */}
                {attachedFile && (
                  <div className="flex items-center gap-1 bg-violet-50 text-violet-700 text-[10px] font-semibold px-2 py-1 rounded border border-violet-100 truncate shrink-0 max-w-[120px]">
                    <Paperclip className="size-3" />
                    <span>{attachedFile}</span>
                  </div>
                )}

                <button
                  onClick={handleAttachmentClick}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="size-4" />
                </button>

                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isGenerating || !chatInput.trim() || !activeConv}
                  className="h-[42px] px-4 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-40"
                >
                  <Send className="size-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>

              {/* Suggestion Chips */}
              {activeConv && (
                <div className="flex flex-wrap items-center gap-1.5 pl-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">Try:</span>
                  {activeConv.pmPath === "B" ? (
                    <>
                      <button onClick={() => handleSendMessage("Our target users are urban college students")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Set Users</button>
                      <button onClick={() => handleSendMessage("Recommend the strongest USP")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Recommend USP</button>
                      <button onClick={() => handleSendMessage("Generate and prioritize feature list")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Prioritize Features</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleSendMessage("Import and cluster reviews for this app")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Cluster Reviews</button>
                      <button onClick={() => handleSendMessage("Outline competitor gaps")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Competitor Gaps</button>
                      <button onClick={() => handleSendMessage("Validate 60-Second Add-On buffer")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Validate Solution</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Disclaimer Banner at Bottom ── */}
        {disclaimerVisible && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium leading-none">
              <Sparkles className="size-3.5 text-violet-500 shrink-0" />
              <span>Mycroft can make mistakes. Please review important information.</span>
            </div>
            <button
              onClick={() => setDisclaimerVisible(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
