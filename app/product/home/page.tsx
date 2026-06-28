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
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. I have gathered the initial telemetry analysis for UPI Expense Manager. The discovery card is ready. What feature set or transaction flow should we define next?",
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
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. We are currently in the **Define** stage for Zepto Checkout Improvement. The checkout friction logs have been loaded. What section of the PRD should we update next?",
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
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. I have compiled the patient triage user research and competitor maps. What part of the design flow should we review first?",
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
    messages: [
      {
        sender: "ai",
        text: "Welcome back, Akshay. We are analyzing student pocket money trends in urban colleges. How would you like to update the discovery profile?",
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

    const updatedTitle = activeConv.title === "New Chat" || activeConv.title === "UPI Expense Manager" && activeConv.messages.length <= 1
      ? (input.length > 28 ? `${input.substring(0, 28)}...` : input)
      : activeConv.title;

    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, title: updatedTitle, messages: [...c.messages, userMsg] } : c
    ));
    if (!textToSend) setChatInput("");
    setAttachedFile(null);
    setIsGenerating(true);

    // AI Mock Response Logic
    setTimeout(() => {
      const userText = input.toLowerCase();
      let aiText = "";
      let targetStage = activeConv.activeStep;
      let nextAction: Message["action"] = undefined;
      let card: Message["workspaceCard"] = undefined;

      if (activeConv.activeStep === "Discovery") {
        if (userText.includes("grocery") || userText.includes("zepto") || userText.includes("delivery") || userText.includes("reviews")) {
          aiText = "Excellent. I have analyzed review clusters for grocery delivery apps in India. Opportunity discovery details are ready in your Discovery Workspace. What is the primary customer profile and target region we want to capture first?";
          card = { type: "Discovery", title: "Discovery Workspace Updated", description: "Review Intelligence clusters synced for Zepto.", targetUrl: "/product/discovery" };
        } else if (userText.includes("student") || userText.includes("bangalore") || userText.includes("campuses") || userText.includes("users")) {
          aiText = "Got it. I have logged 'Students in university campuses in Bangalore' under Target Users in our active workspace schema. Next: What are the core success metrics or KPI targets we need to achieve?";
        } else if (userText.includes("metrics") || userText.includes("score") || userText.includes("seconds") || userText.includes("roadmap")) {
          aiText = "Understood. The Discovery phase is complete. I have successfully gathered the requirements baseline. We can now transition to Define to generate the PRD Specification.";
          nextAction = { label: "Move to Define (PRD)", stage: "Define" };
        } else {
          aiText = "I have logged that research topic in the UPI Expense Manager scope. Let me know if you would like me to calculate the sentiment metrics or outline the compliance maps.";
        }
      } else if (activeConv.activeStep === "Define") {
        if (userText.includes("compliance") || userText.includes("rbi") || userText.includes("dpdp")) {
          aiText = "Updated. I have added India DPDP Act 2023 regulations and RBI payment guidelines to Section 8 (Compliance). Let me know if you are ready to transition to the Design & Develop phase.";
          card = { type: "PRD", title: "PRD Draft Updated (v2)", description: "Section 8 Compliance rules appended with India regulatory acts.", targetUrl: "/product/prds" };
        } else if (userText.includes("audit") || userText.includes("review") || userText.includes("prd")) {
          aiText = "Spec quality score is currently 95/100. All 8 requirements sections are populated cleanly. The spec is audit ready.";
        } else if (userText.includes("move") || userText.includes("design") || userText.includes("develop")) {
          aiText = "PRD is approved. I have populated the engineering milestone targets and Q3 core payments roadmap. Let's move to the Design & Develop stage.";
          targetStage = "Design";
          nextAction = { label: "Move to Develop", stage: "Develop" };
          card = { type: "Dashboard", title: "Roadmap Milestones Loaded", description: "Payments roadmap generated on active Dashboard.", targetUrl: "/product/dashboard" };
        } else {
          aiText = "PRD sections updated. You can review the Notion Spec canvas inside the PRD Workspace.";
        }
      } else {
        aiText = "Engineering milestones are active. We are currently tracking sprint capacity and tokenization constraints. Let me know what to analyze next.";
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

        if (userText.includes("student") || userText.includes("bangalore"))
          updatedSections.targetUsers.content = "Students in university campuses in Bangalore.";
        if (userText.includes("metrics") || userText.includes("score"))
          updatedSections.successMetrics.content = "Target Quality score >= 90/100, and packing times under 60 seconds.";
        if (userText.includes("compliance") || userText.includes("rbi")) {
          updatedSections.compliance.content = "RBI FinTech Guidelines, DPDP Act 2023 compliance audits, and PCI-DSS payment tokenization protocols.";
          updatedVersion += 1;
        }
        if (userText.includes("move") || userText.includes("design") || userText.includes("develop"))
          updatedStatus = "Approved";

        return {
          ...c,
          activeStep: nextStep,
          prdSections: updatedSections,
          prdVersion: updatedVersion,
          prdStatus: updatedStatus,
          messages: [...c.messages, aiMsg]
        };
      }));

      setIsGenerating(false);
    }, 800);
  }, [chatInput, activeConv, activeConvId]);

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
          // Hardcoded seed groups
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
              <div className="hidden md:flex items-center gap-0.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-150 select-none">
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
                              ? "text-slate-700 hover:text-slate-950"
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
            <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 space-y-10 pb-24">
              
              {/* Header Titles */}
              <div className="space-y-2 mt-4">
                <p className="text-[13px] font-semibold text-slate-500">{greeting}, Akshay! 👋</p>
                <h2 className="text-[34px] font-bold text-slate-900 tracking-tight leading-tight">What are we building today?</h2>
                <p className="text-[13px] text-slate-500">I&apos;ll help you discover, define and build products users love.</p>
              </div>

              {/* Large Prompt Input Box */}
              <div className="border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 bg-white">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe your product idea or ask anything..."
                  rows={3}
                  className="w-full text-[13px] text-slate-800 placeholder:text-slate-400 resize-none bg-transparent focus:outline-none leading-relaxed"
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
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="size-4.5" />
                  </button>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!chatInput.trim()}
                    className="size-8.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-violet-600 shadow-sm"
                  >
                    <Send className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Suggested Actions (Popular things to try) */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Popular things to try</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Card 1 */}
                  <div
                    onClick={() => handleSendMessage("Analyze Reviews for Zepto Checkout Improvement")}
                    className="p-3 bg-white border border-slate-150/75 hover:border-slate-350 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3 rounded-xl"
                  >
                    <div className="size-9 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600 shrink-0">
                      <Search className="size-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-slate-900 leading-snug">Analyze Reviews</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">Find user pain points</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div
                    onClick={() => handleSendMessage("Generate PRD draft for UPI Expense Manager")}
                    className="p-3 bg-white border border-slate-150/75 hover:border-slate-350 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3 rounded-xl"
                  >
                    <div className="size-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                      <FileText className="size-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-slate-900 leading-snug">Generate PRD</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">Create PRD draft</p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div
                    onClick={() => handleSendMessage("Build Roadmap and product milestones")}
                    className="p-3 bg-white border border-slate-150/75 hover:border-slate-350 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3 rounded-xl"
                  >
                    <div className="size-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                      <GitBranch className="size-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-slate-900 leading-snug">Build Roadmap</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">Plan product journey</p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div
                    onClick={() => handleSendMessage("Identify target users and success metrics")}
                    className="p-3 bg-white border border-slate-150/75 hover:border-slate-350 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-3 rounded-xl"
                  >
                    <div className="size-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                      <Users className="size-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-slate-900 leading-snug">Identify Users</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">Define target users</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Continue Your Work (Active project tracker card) */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Continue your work</p>
                <Card className="p-4 border border-slate-150/75 bg-white rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="size-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-bold text-slate-900">UPI Expense Manager</h4>
                        <span className="text-[10px] font-semibold bg-violet-50 text-violet-600 px-2.5 py-0.5 rounded-full">Discovery</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">Fintech • Last updated 2 hours ago</p>
                    </div>
                  </div>

                  {/* 6D Stepper progress tracker bar */}
                  <div className="flex items-center justify-center md:justify-start gap-1 py-2 overflow-x-auto max-w-full">
                    {STEPS.map((step, index) => {
                      const isCompleted = index === 0; // Discovery checked
                      return (
                        <div key={step} className="flex items-center shrink-0">
                          {index > 0 && (
                            <div className="w-6 sm:w-10 h-0.5 bg-slate-150" />
                          )}
                          <div className="flex flex-col items-center mx-1 relative group">
                            <div className={cn(
                              "size-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-colors",
                              isCompleted
                                ? "bg-violet-600 border-violet-600 text-white"
                                : "bg-white border-slate-200 text-slate-400"
                            )}>
                              {isCompleted ? "✓" : index + 1}
                            </div>
                            <span className={cn(
                              "text-[8.5px] mt-1.5 font-semibold transition-all",
                              isCompleted ? "text-violet-600" : "text-slate-400"
                            )}>
                              {step}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => {
                      setActiveConvId("conv_upi_expense");
                      setShowChatView(true);
                    }}
                    variant="secondary"
                    className="h-9 px-4 rounded-xl border-violet-200 text-violet-600 hover:bg-violet-50/50 text-[12px] font-semibold shrink-0 shadow-2xs"
                  >
                    Continue
                  </Button>
                </Card>
              </div>

              {/* Recent Projects */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Recent projects</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  
                  {/* Project 1 */}
                  <div
                    onClick={() => {
                      setActiveConvId("conv_zepto_checkout");
                      setShowChatView(true);
                    }}
                    className="p-3.5 bg-white border border-slate-150/75 hover:border-slate-350 hover:shadow-2xs transition-all cursor-pointer rounded-xl flex items-center gap-3"
                  >
                    <div className="size-8.5 rounded-lg bg-pink-50 text-pink-650 font-bold flex items-center justify-center shrink-0 text-[12px]">
                      Z
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-bold text-slate-900 truncate leading-snug">Zepto Checkout</p>
                      <p className="text-[9.5px] text-slate-400 mt-0.5 truncate font-medium">Define • Updated 4h ago</p>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div
                    onClick={() => {
                      setActiveConvId("conv_healthtech_ai");
                      setShowChatView(true);
                    }}
                    className="p-3.5 bg-white border border-slate-150/75 hover:border-slate-350 hover:shadow-2xs transition-all cursor-pointer rounded-xl flex items-center gap-3"
                  >
                    <div className="size-8.5 rounded-lg bg-emerald-50 text-emerald-650 font-bold flex items-center justify-center shrink-0 text-[12px]">
                      H
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-bold text-slate-900 truncate leading-snug">HealthTech AI</p>
                      <p className="text-[9.5px] text-slate-400 mt-0.5 truncate font-medium">Research • 1d ago</p>
                    </div>
                  </div>

                  {/* Project 3 */}
                  <div
                    onClick={() => {
                      setActiveConvId("conv_fintech_students");
                      setShowChatView(true);
                    }}
                    className="p-3.5 bg-white border border-slate-150/75 hover:border-slate-350 hover:shadow-2xs transition-all cursor-pointer rounded-xl flex items-center gap-3"
                  >
                    <div className="size-8.5 rounded-lg bg-blue-50 text-blue-650 font-bold flex items-center justify-center shrink-0 text-[12px]">
                      F
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-bold text-slate-900 truncate leading-snug">Fintech Students</p>
                      <p className="text-[9.5px] text-slate-400 mt-0.5 truncate font-medium">Discovery • 2d ago</p>
                    </div>
                  </div>

                  {/* View all projects */}
                  <div
                    onClick={() => window.location.assign("/projects")}
                    className="p-3.5 bg-slate-50 border border-slate-150/75 hover:bg-slate-100 hover:border-slate-350 hover:shadow-2xs transition-all cursor-pointer rounded-xl flex items-center justify-center"
                  >
                    <p className="text-[11.5px] font-bold text-slate-600 flex items-center gap-1.5">
                      View all projects
                      <ArrowRight className="size-3" />
                    </p>
                  </div>

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
                  {activeConv.activeStep === "Discovery" ? (
                    <>
                      <button onClick={() => handleSendMessage("Analyze reviews for Zepto Checkout")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Analyze Reviews</button>
                      <button onClick={() => handleSendMessage("Set target users to students in university campuses")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Identify Users</button>
                      <button onClick={() => handleSendMessage("Define success metrics as Quality score >= 90")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Define Metrics</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleSendMessage("Add India compliance laws to Section 8")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Add Compliance</button>
                      <button onClick={() => handleSendMessage("Perform PRD audit checks")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• PRD Audit</button>
                      <button onClick={() => handleSendMessage("Transition to Design & Develop stage")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Build Roadmap</button>
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
