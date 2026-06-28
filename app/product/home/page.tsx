"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Bot, 
  Sparkles, 
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
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

// Stepper steps representing PM Lifecycle
const STEPS = ["Discovery", "Define", "Design", "Develop", "Deliver", "Debrief"];

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
}

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

export default function AIHomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Rename inline states
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Sidebar collapse states
  const [convSidebarCollapsed, setConvSidebarCollapsed] = useState(false);
  const [mainSidebarCollapsed, setMainSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversations and sidebar prefs from localStorage on mount
  useEffect(() => {
    const savedConvs = localStorage.getItem("mycroft_home_conversations");
    const savedActiveId = localStorage.getItem("mycroft_home_active_conv_id");
    const convCollapsed = localStorage.getItem("conv_sidebar_collapsed");
    const mainCollapsed = localStorage.getItem("sidebar_collapsed_pref");

    let loadedConvs: Conversation[] = [];
    let activeId = "";

    if (savedConvs) {
      try {
        loadedConvs = JSON.parse(savedConvs);
      } catch (e) {
        console.error("Failed to parse conversations:", e);
      }
    }

    if (loadedConvs.length === 0) {
      const initialConv: Conversation = {
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
      };
      loadedConvs = [initialConv];
      activeId = initialConv.id;
    } else {
      activeId = savedActiveId || loadedConvs[0].id;
    }

    setConversations(loadedConvs);
    setActiveConvId(activeId);
    if (convCollapsed !== null) setConvSidebarCollapsed(convCollapsed === "true");
    if (mainCollapsed !== null) setMainSidebarCollapsed(mainCollapsed === "true");
    setIsLoaded(true);
  }, []);

  // Listen for main sidebar toggle event from sidebar.tsx
  useEffect(() => {
    const sync = () => {
      setMainSidebarCollapsed(localStorage.getItem("sidebar_collapsed_pref") === "true");
    };
    window.addEventListener("sidebar_toggle", sync);
    return () => window.removeEventListener("sidebar_toggle", sync);
  }, []);

  // Save conversations and active ID to localStorage when they change
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
        try { history = JSON.parse(savedPrdsHistory); } catch (e) { console.error(e); }
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

      if (history.length > 0) { history[0] = activePrd; } else { history = [activePrd]; }
      localStorage.setItem("mycroft_prds_history", JSON.stringify(history));
    }
  }, [conversations, activeConvId, isLoaded]);

  // Auto scroll chat conversation
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeConvId]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const toggleConvSidebar = () => {
    const val = !convSidebarCollapsed;
    setConvSidebarCollapsed(val);
    localStorage.setItem("conv_sidebar_collapsed", String(val));
  };

  const handleNewChat = () => {
    const newConv: Conversation = {
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
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  };

  const handleRenameChat = (id: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) return { ...c, title: renameValue.trim() || c.title };
      return c;
    }));
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);

    if (activeConvId === id) {
      if (updated.length > 0) {
        setActiveConvId(updated[0].id);
      } else {
        const resetConv: Conversation = {
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
        };
        setConversations([resetConv]);
        setActiveConvId(resetConv.id);
      }
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const input = textToSend || chatInput;
    if (!input.trim() || !activeConv) return;

    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let updatedTitle = activeConv.title;
    if (activeConv.title === "New Chat") {
      updatedTitle = input.length > 25 ? `${input.substring(0, 25)}...` : input;
    }

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, title: updatedTitle, messages: [...c.messages, userMsg] };
      }
      return c;
    }));

    if (!textToSend) setChatInput("");
    setIsGenerating(true);

    setTimeout(() => {
      let aiText = "";
      let targetStage = activeConv.activeStep;
      let nextAction: { label: string; stage: string } | undefined;
      let card: Message["workspaceCard"] = undefined;

      const userText = input.toLowerCase();

      if (activeConv.activeStep === "Discovery") {
        if (userText.includes("grocery") || userText.includes("zepto") || userText.includes("delivery")) {
          aiText = "Excellent. I have analyzed review clusters for grocery delivery apps in India. Opportunity discovery details are ready in your Discovery Workspace. What is the primary customer profile and target region we want to capture first?";
          card = { type: "Discovery", title: "Discovery Workspace Updated", description: "Review Intelligence clusters synced for Zepto.", targetUrl: "/product/discovery" };
        } else if (userText.includes("student") || userText.includes("bangalore") || userText.includes("campuses")) {
          aiText = "Got it. I have logged 'Students in university campuses in Bangalore' under Target Users in our active workspace schema. Next: What are the core success metrics or KPI targets we need to achieve?";
        } else if (userText.includes("metrics") || userText.includes("score") || userText.includes("seconds")) {
          aiText = "Understood. The Discovery phase is complete. I have successfully gathered the requirements baseline. We can now transition to Define to generate the PRD Specification.";
          nextAction = { label: "Move to Define (PRD)", stage: "Define" };
        } else {
          aiText = "I have logged that research topic. Let me know if you would like me to calculate the sentiment metrics or outline the compliance maps.";
        }
      } else if (activeConv.activeStep === "Define") {
        if (userText.includes("compliance") || userText.includes("rbi") || userText.includes("dpdp")) {
          aiText = "Updated. I have added India DPDP Act 2023 regulations and RBI payment guidelines to Section 8 (Compliance). Let me know if you are ready to transition to the Design & Develop phase.";
          card = { type: "PRD", title: "PRD Draft Updated (v2)", description: "Section 8 Compliance rules appended with India regulatory acts.", targetUrl: "/product/prds" };
        } else if (userText.includes("audit") || userText.includes("review")) {
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        workspaceCard: card,
        action: nextAction
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          const nextStep = nextAction ? nextAction.stage : targetStage;
          const updatedSections = { ...c.prdSections };
          let updatedVersion = c.prdVersion;
          let updatedStatus = c.prdStatus;

          if (userText.includes("student") || userText.includes("bangalore")) {
            updatedSections.targetUsers.content = "Students in university campuses in Bangalore.";
          }
          if (userText.includes("metrics") || userText.includes("score")) {
            updatedSections.successMetrics.content = "Target Quality score >= 90/100, and packing times under 60 seconds.";
          }
          if (userText.includes("compliance") || userText.includes("rbi")) {
            updatedSections.compliance.content = "RBI FinTech Guidelines, DPDP Act 2023 compliance audits, and PCI-DSS payment tokenization protocols.";
            updatedVersion += 1;
          }
          if (userText.includes("move") || userText.includes("design") || userText.includes("develop")) {
            updatedStatus = "Approved";
          }

          return {
            ...c,
            activeStep: nextStep,
            prdSections: updatedSections,
            prdVersion: updatedVersion,
            prdStatus: updatedStatus,
            messages: [...c.messages, aiMsg]
          };
        }
        return c;
      }));

      setIsGenerating(false);
    }, 800);
  };

  const handleAction = (action: { label: string; stage: string }) => {
    if (!activeConv) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        const sysMsg: Message = {
          sender: "ai",
          text: `Lifecycle stage transitioned to: **${action.stage}**. Relevant workspace cards have been generated inline.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return { ...c, activeStep: action.stage, messages: [...c.messages, sysMsg] };
      }
      return c;
    }));
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus mode: both sidebars collapsed => deep work, ultra-wide canvas
  const isFocusMode = convSidebarCollapsed && mainSidebarCollapsed;

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] font-sans antialiased text-slate-800 overflow-hidden">

      {/* ─── Top Header Bar ─── */}
      <header className="shrink-0 sticky top-0 z-30 flex justify-between items-center bg-white/95 backdrop-blur-sm px-5 py-3 border-b border-slate-100 gap-4">
        
        {/* Left: Mycroft brand + lifecycle stepper */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Bot className="size-4" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-none">Mycroft AI</h1>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Conversational Product Workspace</p>
            </div>
          </div>

          {/* Stepper Progress Tracker */}
          {activeConv && (
            <div className="hidden lg:flex items-center gap-0.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-150 text-[10px] font-semibold text-slate-400 select-none">
              {STEPS.map((step, idx) => {
                const isActive = activeConv.activeStep === step;
                const isCompleted = STEPS.indexOf(activeConv.activeStep) > idx;
                return (
                  <React.Fragment key={step}>
                    {idx > 0 && <ChevronRight className="size-3 text-slate-250 mx-0.5" />}
                    <button
                      onClick={() => handleAction({ label: `Goto ${step}`, stage: step })}
                      className={cn(
                        "px-1.5 py-0.5 rounded-md transition-all duration-200",
                        isActive ? "bg-slate-950 text-white font-bold px-2" :
                        isCompleted ? "text-slate-700 hover:text-slate-950" :
                        "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {step}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: New Chat + Search + Conv sidebar toggle */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Search conversations (expandable inline) */}
          <div className="flex items-center">
            {searchOpen ? (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs">
                <Search className="size-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-44 text-[11px] bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400"
                  autoFocus
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  onKeyDown={(e) => e.key === "Escape" && (setSearchOpen(false), setSearchQuery(""))}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="text-slate-400 hover:text-slate-600">
                    <X className="size-3" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                title="Search conversations"
                className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Search className="size-4" />
              </button>
            )}
          </div>

          {/* New Chat */}
          <button
            onClick={handleNewChat}
            title="New Chat"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Plus className="size-4" />
          </button>

          {/* Conv sidebar toggle */}
          <button
            onClick={toggleConvSidebar}
            title={convSidebarCollapsed ? "Show Conversations" : "Hide Conversations"}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors",
              convSidebarCollapsed
                ? "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {convSidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>

          {/* Focus mode indicator badge */}
          {isFocusMode && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              <Sparkles className="size-2.5" /> Deep Work
            </span>
          )}
        </div>
      </header>

      {/* ─── Main Workspace: Conversation sidebar + Chat canvas ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Conversation History Sidebar (independently collapsible) */}
        <aside className={cn(
          "shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-hidden transition-all duration-300 ease-in-out hidden md:flex",
          convSidebarCollapsed ? "w-[52px]" : "w-[240px]"
        )}>
          {convSidebarCollapsed ? (
            /* Icon-only collapsed state */
            <div className="flex flex-col items-center gap-2 py-4">
              <button
                onClick={toggleConvSidebar}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title="Expand conversations"
              >
                <MessageSquare className="size-4" />
              </button>
              <div className="w-6 border-t border-slate-100 mt-1 mb-1" />
              {filteredConversations.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  title={c.title}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors text-[10px] font-bold uppercase",
                    c.id === activeConvId
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  )}
                >
                  {c.title.charAt(0)}
                </button>
              ))}
            </div>
          ) : (
            /* Expanded conversation list */
            <div className="flex flex-col h-full p-3 gap-3">
              
              {/* Previous Conversations label */}
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1 pt-1">Conversations</span>

              {/* Chat list */}
              <div className="flex-1 overflow-y-auto space-y-0.5 -mx-0.5">
                {filteredConversations.length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center py-8 italic">No conversations found</p>
                )}
                {filteredConversations.map((c) => {
                  const isActive = c.id === activeConvId;
                  const isRenaming = renamingId === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => { if (!isRenaming) setActiveConvId(c.id); }}
                      className={cn(
                        "group w-full text-left p-2 rounded-lg transition-all cursor-pointer flex items-center justify-between gap-1",
                        isActive ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MessageSquare className={cn("size-3.5 shrink-0", isActive ? "text-white/60" : "text-slate-350")} />
                        {isRenaming ? (
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="w-full px-1 py-0.5 text-xs border rounded bg-white text-slate-900"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRenameChat(c.id);
                              if (e.key === "Escape") setRenamingId(null);
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-medium truncate block">{c.title}</span>
                            <span className={cn("text-[9px] truncate block", isActive ? "text-white/50" : "text-slate-400")}>
                              {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        )}
                      </div>

                      {!isRenaming && (
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); setRenamingId(c.id); setRenameValue(c.title); }}
                            className={cn("p-1 rounded hover:bg-white/20 transition-colors", isActive ? "text-white/70" : "text-slate-400")}
                          >
                            <Edit className="size-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteChat(c.id, e)}
                            className={cn("p-1 rounded hover:bg-red-100 transition-colors", isActive ? "text-white/70 hover:text-red-500" : "text-slate-400 hover:text-red-500")}
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      )}

                      {isRenaming && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); handleRenameChat(c.id); }} className="p-1 rounded hover:bg-green-100 text-green-600">
                            <Check className="size-3" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setRenamingId(null); }} className="p-1 rounded hover:bg-red-100 text-red-500">
                            <X className="size-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* ─── Main Chat Canvas ─── */}
        <main className="flex-1 flex flex-col bg-white relative overflow-hidden">

          {/* Scroll area */}
          <div className="flex-1 overflow-y-auto">
            <div className={cn(
              "mx-auto px-6 pt-8 pb-40 transition-all duration-300",
              isFocusMode ? "max-w-4xl" : "max-w-3xl"
            )}>
              {activeConv ? (
                <div className="space-y-6">
                  {activeConv.messages.map((msg, idx) => {
                    const isAi = msg.sender === "ai";
                    return (
                      <div key={idx} className="space-y-3">
                        <div className={`flex gap-3.5 ${!isAi && "justify-end"}`}>
                          {isAi && (
                            <div className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0 mt-0.5">M</div>
                          )}
                          <div className="space-y-2 max-w-[85%]">
                            <div
                              className={cn(
                                "px-4 py-3 rounded-2xl text-[13px] leading-relaxed",
                                isAi
                                  ? "bg-slate-50 text-slate-800 rounded-tl-xs border border-slate-100"
                                  : "bg-slate-900 text-white rounded-tr-xs"
                              )}
                              style={{ whiteSpace: "pre-line" }}
                            >
                              {msg.text}
                            </div>

                            {/* Workspace update card */}
                            {isAi && msg.workspaceCard && (
                              <Card className="p-4 border border-slate-100 bg-slate-50/50 shadow-xs rounded-xl flex items-center justify-between gap-4 mt-2 max-w-md">
                                <div className="flex items-center gap-3">
                                  <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    {msg.workspaceCard.type === "Discovery" ? (
                                      <Compass className="size-4" />
                                    ) : msg.workspaceCard.type === "PRD" ? (
                                      <ClipboardList className="size-4" />
                                    ) : (
                                      <Activity className="size-4" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-900">{msg.workspaceCard.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{msg.workspaceCard.description}</p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => window.location.assign(msg.workspaceCard!.targetUrl)}
                                  className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs shrink-0"
                                >
                                  Open Workspace
                                  <ArrowUpRight className="size-3.5" />
                                </Button>
                              </Card>
                            )}

                            {/* Next step action */}
                            {isAi && msg.action && (
                              <Button
                                onClick={() => handleAction(msg.action!)}
                                className="h-8 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1.5 mt-1"
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

                  {isGenerating && (
                    <div className="flex gap-3.5">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0 mt-0.5">M</div>
                      <div className="bg-slate-50 border border-slate-100 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-xs text-[13px] animate-pulse">
                        Mycroft is thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-24 text-slate-400">
                  <Bot className="size-10 text-slate-200 mb-3" />
                  <p className="text-xs italic">No active conversation. Use + New Chat to begin.</p>
                </div>
              )}
            </div>
          </div>

          {/* ─── Floating Composer ─── */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center px-6 pb-6 pt-4 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-20">
            <div className={cn(
              "w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-3.5 pointer-events-auto flex flex-col gap-2.5 transition-all duration-300",
              isFocusMode ? "max-w-4xl" : "max-w-3xl"
            )}>
              <div className="flex gap-2.5 items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={activeConv ? `Ask Mycroft about ${activeConv.activeStep} stage...` : "Type a message..."}
                  className="flex-1 px-4 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-slate-50/50 font-sans leading-relaxed"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isGenerating || !activeConv}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isGenerating || !chatInput.trim() || !activeConv}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
                >
                  Send
                  <Send className="size-3" />
                </Button>
              </div>

              {/* Suggestion chips */}
              {activeConv && (
                <div className="flex flex-wrap items-center gap-1.5 pl-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">Try:</span>
                  {activeConv.activeStep === "Discovery" ? (
                    <>
                      <button onClick={() => handleSendMessage("Analyze Zepto reviews")} className="h-6 px-2.5 text-[10px] font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">• Analyze Reviews</button>
                      <button onClick={() => handleSendMessage("Set target users to students in university campuses")} className="h-6 px-2.5 text-[10px] font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">• Identify Target Users</button>
                      <button onClick={() => handleSendMessage("Define success metrics as Quality score >= 90")} className="h-6 px-2.5 text-[10px] font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">• Define Metrics</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleSendMessage("Add India compliance laws")} className="h-6 px-2.5 text-[10px] font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">• Add Compliance</button>
                      <button onClick={() => handleSendMessage("Perform PRD audit checks")} className="h-6 px-2.5 text-[10px] font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">• PRD Audit</button>
                      <button onClick={() => handleSendMessage("Transition to Design & Develop stage")} className="h-6 px-2.5 text-[10px] font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">• Build Roadmap</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
