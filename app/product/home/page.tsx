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
  Sparkles
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

// ─── History Drawer Component ─────────────────────────────────────────────────
function HistoryDrawer({
  open,
  onClose,
  conversations,
  activeConvId,
  onSelect,
  onNewChat,
  renamingId,
  renameValue,
  setRenamingId,
  setRenameValue,
  onRename,
  onDelete
}: {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConvId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  renamingId: string | null;
  renameValue: string;
  setRenamingId: (id: string | null) => void;
  setRenameValue: (v: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}) {
  const [search, setSearch] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-250",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 left-0 h-full z-50 w-[320px] bg-white border-r border-slate-100 shadow-2xl flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-label="Conversation History"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Clock className="size-3.5" />
            </div>
            <span className="text-sm font-semibold text-slate-900 tracking-tight">History</span>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 text-[12px] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 placeholder:text-slate-400 text-slate-800"
              autoFocus
            />
          </div>
        </div>

        {/* Section label */}
        <div className="px-5 py-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {filtered.length} conversation{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <MessageSquare className="size-8 mb-2 text-slate-200" />
              <p className="text-xs italic">No conversations found</p>
            </div>
          )}
          {filtered.map((c) => {
            const isActive = c.id === activeConvId;
            const isRenaming = renamingId === c.id;

            return (
              <div
                key={c.id}
                onClick={() => { if (!isRenaming) { onSelect(c.id); onClose(); } }}
                className={cn(
                  "group w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer",
                  isActive
                    ? "bg-slate-950 text-white"
                    : "hover:bg-slate-50 text-slate-600"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {isRenaming ? (
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="w-full px-1.5 py-0.5 text-xs border rounded bg-white text-slate-900 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onRename(c.id);
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    ) : (
                      <p className="text-[12px] font-medium truncate leading-snug">{c.title}</p>
                    )}
                    <div className={cn("flex items-center gap-1.5 mt-0.5", isActive ? "text-white/50" : "text-slate-400")}>
                      <span className="text-[10px]">{formatDate(c.createdAt)}</span>
                      <span className="text-[10px]">·</span>
                      <span className={cn(
                        "text-[10px] px-1 py-px rounded font-medium",
                        isActive ? "bg-white/10" : "bg-slate-100 text-slate-500"
                      )}>
                        {c.activeStep}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isRenaming && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setRenamingId(c.id); setRenameValue(c.title); }}
                        className={cn("p-1 rounded-md transition-colors", isActive ? "hover:bg-white/20 text-white/60" : "hover:bg-slate-200 text-slate-400")}
                      >
                        <Edit className="size-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(c.id, e); }}
                        className={cn("p-1 rounded-md transition-colors", isActive ? "hover:bg-red-500/30 text-white/60" : "hover:bg-red-50 text-slate-400 hover:text-red-500")}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  )}

                  {isRenaming && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); onRename(c.id); }} className="p-1 rounded hover:bg-green-100 text-green-600">
                        <Check className="size-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setRenamingId(null); }} className="p-1 rounded hover:bg-red-100 text-red-400">
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: New Chat CTA */}
        <div className="px-4 py-4 border-t border-slate-100">
          <Button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full h-10 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-[12px] font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="size-4" />
            New Conversation
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIHomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // History drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Rename inline states
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // ── Bootstrap from localStorage ──
  useEffect(() => {
    const savedConvs = localStorage.getItem("mycroft_home_conversations");
    const savedActiveId = localStorage.getItem("mycroft_home_active_conv_id");

    let loadedConvs: Conversation[] = [];
    if (savedConvs) {
      try { loadedConvs = JSON.parse(savedConvs); } catch (e) { console.error(e); }
    }

    if (loadedConvs.length === 0) {
      const initial = makeDefaultConv();
      setConversations([initial]);
      setActiveConvId(initial.id);
    } else {
      setConversations(loadedConvs);
      setActiveConvId(savedActiveId || loadedConvs[0].id);
    }
    setIsLoaded(true);
  }, []);

  // ── Cmd/Ctrl + K to open drawer ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ── Persist state to localStorage ──
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
      if (savedPrdsHistory) { try { history = JSON.parse(savedPrdsHistory); } catch (e) { console.error(e); } }

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

  // ── Auto-scroll ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConvId]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // ── Handlers ──
  const handleNewChat = useCallback(() => {
    const newConv = makeDefaultConv();
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  }, []);

  const handleRenameChat = useCallback((id: string) => {
    setConversations(prev => prev.map(c =>
      c.id === id ? { ...c, title: renameValue.trim() || c.title } : c
    ));
    setRenamingId(null);
    setRenameValue("");
  }, [renameValue]);

  const handleDeleteChat = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated.length > 0 ? updated : [makeDefaultConv()]);
    if (activeConvId === id) {
      setActiveConvId(updated.length > 0 ? updated[0].id : "");
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

    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedTitle = activeConv.title === "New Chat"
      ? (input.length > 28 ? `${input.substring(0, 28)}...` : input)
      : activeConv.title;

    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, title: updatedTitle, messages: [...c.messages, userMsg] } : c
    ));
    if (!textToSend) setChatInput("");
    setIsGenerating(true);

    setTimeout(() => {
      const userText = input.toLowerCase();
      let aiText = "";
      let targetStage = activeConv.activeStep;
      let nextAction: Message["action"] = undefined;
      let card: Message["workspaceCard"] = undefined;

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

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-white font-sans antialiased text-slate-800 overflow-hidden">

      {/* ── History Drawer (overlays, does not push content) ── */}
      <HistoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        conversations={conversations}
        activeConvId={activeConvId}
        onSelect={(id) => setActiveConvId(id)}
        onNewChat={handleNewChat}
        renamingId={renamingId}
        renameValue={renameValue}
        setRenamingId={setRenamingId}
        setRenameValue={setRenameValue}
        onRename={handleRenameChat}
        onDelete={handleDeleteChat}
      />

      {/* ── Top Header ── */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-sm z-20">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
            <Bot className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-none">Mycroft AI</h1>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-none">Product Workspace</p>
          </div>
        </div>

        {/* Center: Lifecycle stepper */}
        {activeConv && (
          <div className="hidden lg:flex items-center gap-0.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-150 select-none">
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

        {/* Right: History toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            title="History (⌘K)"
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-[12px] font-medium"
          >
            <Clock className="size-3.5" />
            <span className="hidden sm:inline">History</span>
            <kbd className="hidden md:inline ml-1 text-[9px] font-mono bg-slate-100 text-slate-400 px-1 py-0.5 rounded border border-slate-200">⌘K</kbd>
          </button>
        </div>
      </header>

      {/* ── Full-width Chat Canvas ── */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-48">

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
                              : "bg-slate-900 text-white rounded-tr-[4px]"
                          )}
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {msg.text}
                        </div>

                        {/* Timestamp */}
                        <p className={cn(
                          "text-[10px] font-medium px-1",
                          isAi ? "text-slate-400" : "text-right text-slate-400"
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
                            className="h-8 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
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
              <p className="text-xs text-slate-400 mt-1">Use History (⌘K) to browse past conversations</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Floating Composer (pinned above FAB) ── */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center px-6 pointer-events-none z-10">
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
            <Button
              onClick={() => handleSendMessage()}
              disabled={isGenerating || !chatInput.trim() || !activeConv}
              className="h-[42px] px-4 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-40"
            >
              <Send className="size-3.5" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>

          {/* Suggestion chips */}
          {activeConv && (
            <div className="flex flex-wrap items-center gap-1.5 pl-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">Try:</span>
              {activeConv.activeStep === "Discovery" ? (
                <>
                  <button onClick={() => handleSendMessage("Analyze Zepto reviews")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Analyze Reviews</button>
                  <button onClick={() => handleSendMessage("Set target users to students in university campuses")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Identify Users</button>
                  <button onClick={() => handleSendMessage("Define success metrics as Quality score >= 90")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Define Metrics</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleSendMessage("Add India compliance laws")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Add Compliance</button>
                  <button onClick={() => handleSendMessage("Perform PRD audit checks")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• PRD Audit</button>
                  <button onClick={() => handleSendMessage("Transition to Design & Develop stage")} className="h-6 px-2.5 text-[10px] font-medium rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">• Build Roadmap</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── FAB: New Chat ── */}
      <button
        onClick={handleNewChat}
        title="New Chat"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 h-12 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-[13px] font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 group"
      >
        <Plus className="size-4 transition-transform duration-200 group-hover:rotate-90" />
        <span>New Chat</span>
        <Sparkles className="size-3.5 text-white/50" />
      </button>

    </div>
  );
}
