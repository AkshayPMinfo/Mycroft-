"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  Send,
  ArrowUpRight,
  ClipboardList,
  Compass,
  Zap,
  ArrowRight,
  Plus,
  Search,
  Trash2,
  Edit,
  Check,
  X,
  MessageSquare,
  Activity
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
  // Synced states
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

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConvs = localStorage.getItem("mycroft_home_conversations");
    const savedActiveId = localStorage.getItem("mycroft_home_active_conv_id");

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
      // Initialize with a default conversation
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
    setIsLoaded(true);
  }, []);

  // Save conversations and active ID to localStorage when they change
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("mycroft_home_conversations", JSON.stringify(conversations));
    localStorage.setItem("mycroft_home_active_conv_id", activeConvId);

    // Sync discovery outputs and PRD values of the active conversation to global mycroft storage
    const active = conversations.find(c => c.id === activeConvId);
    if (active) {
      // Sync Discovery
      const discoveryObj = {
        appName: active.appName,
        sentiment: active.sentiment,
        positiveThemes: active.positiveThemes,
        complaints: active.complaints,
        recommendations: active.opportunityRecommendations,
        requestedFeatures: [
          "60-Second Add-On buffer",
          "Adaptive regional delivery splits"
        ],
        opportunityAreas: [
          "Bengaluru student corridors",
          "Out-of-stock optimization"
        ]
      };
      localStorage.setItem("mycroft_active_discovery", JSON.stringify(discoveryObj));

      // Sync PRD Spec into mycroft_prds_history (active index 0)
      const savedPrdsHistory = localStorage.getItem("mycroft_prds_history");
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
          businessValue: active.prdSections.businessValue?.content || "Enables campus expansions and hyper-local monetization.",
          userValue: active.prdSections.userValue?.content || "Ensures predictable under-10-minute grocery delivery.",
          targetUsers: active.prdSections.targetUsers.content,
          userProblems: active.prdSections.userProblems?.content || "Campus gate access constraints, out-of-stock items mid-checkout.",
          proposedSolution: active.prdSections.proposedSolution?.content || "Hyperlocal university warehouse hub mapping.",
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

  // Auto scroll chat conversation
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeConvId]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Create new conversation (New Chat)
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
      if (c.id === id) {
        return { ...c, title: renameValue.trim() || c.title };
      }
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
        // Reset with default if all deleted
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

  // Handles state machine logic as user inputs prompts
  const handleSendMessage = (textToSend?: string) => {
    const input = textToSend || chatInput;
    if (!input.trim() || !activeConv) return;

    // Append User message
    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let updatedTitle = activeConv.title;
    if (activeConv.title === "New Chat") {
      // Auto-generate title from first prompt
      updatedTitle = input.length > 25 ? `${input.substring(0, 25)}...` : input;
    }

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          title: updatedTitle,
          messages: [...c.messages, userMsg]
        };
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

      // Lifecycle Flow Transitions
      if (activeConv.activeStep === "Discovery") {
        if (userText.includes("grocery") || userText.includes("zepto") || userText.includes("delivery")) {
          aiText = "Excellent. I have analyzed review clusters for grocery delivery apps in India. Opportunity discovery details are ready in your Discovery Workspace. What is the primary customer profile and target region we want to capture first?";
          card = {
            type: "Discovery",
            title: "Discovery Workspace Updated",
            description: "Review Intelligence clusters synced for Zepto.",
            targetUrl: "/product/discovery"
          };
        } else if (userText.includes("student") || userText.includes("bangalore") || userText.includes("campuses")) {
          aiText = "Got it. I have logged 'Students in university campuses in Bangalore' under Target Users in our active workspace schema. Next: What are the core success metrics or KPI targets we need to achieve?";
        } else if (userText.includes("metrics") || userText.includes("score") || userText.includes("seconds")) {
          aiText = "Understood. The Discovery phase is complete. I have successfully gathered the requirements baseline. We can now transition to Define to generate the PRD Specification.";
          nextAction = { label: "Move to Define (PRD)", stage: "Define" };
        } else {
          aiText = "I have logged that research topic. Let me know if you would like me to calculate the sentiment metrics or outline the compliance maps.";
        }
      } 
      else if (activeConv.activeStep === "Define") {
        if (userText.includes("compliance") || userText.includes("rbi") || userText.includes("dpdp")) {
          aiText = "Updated. I have added India DPDP Act 2023 regulations and RBI payment guidelines to Section 8 (Compliance). Let me know if you are ready to transition to the Design & Develop phase.";
          card = {
            type: "PRD",
            title: "PRD Draft Updated (v2)",
            description: "Section 8 Compliance rules appended with India regulatory acts.",
            targetUrl: "/product/prds"
          };
        } else if (userText.includes("audit") || userText.includes("review")) {
          aiText = "Spec quality score is currently 95/100. All 8 requirements sections are populated cleanly. The spec is audit ready.";
        } else if (userText.includes("move") || userText.includes("design") || userText.includes("develop")) {
          aiText = "PRD is approved. I have populated the engineering milestone targets and Q3 core payments roadmap. Let's move to the Design & Develop stage.";
          targetStage = "Design";
          nextAction = { label: "Move to Develop", stage: "Develop" };
          card = {
            type: "Dashboard",
            title: "Roadmap Milestones Loaded",
            description: "Payments roadmap generated on active Dashboard.",
            targetUrl: "/product/dashboard"
          };
        } else {
          aiText = "PRD sections updated. You can review the Notion Spec canvas inside the PRD Workspace.";
        }
      }
      else {
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
          // Update active step if changed
          const nextStep = nextAction ? nextAction.stage : targetStage;
          
          // Modify sections dynamically based on answers
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
        return {
          ...c,
          activeStep: action.stage,
          messages: [...c.messages, sysMsg]
        };
      }
      return c;
    }));
  };

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans antialiased text-slate-800">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 flex justify-between items-center bg-white px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Bot className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-900">Mycroft AI</h1>
            <p className="text-xs text-slate-500 font-medium">Conversational Product Workspace</p>
          </div>
        </div>

        {/* Stepper Progress Tracker */}
        {activeConv && (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            {STEPS.map((step, idx) => {
              const isActive = activeConv.activeStep === step;
              const isCompleted = STEPS.indexOf(activeConv.activeStep) > idx;
              return (
                <React.Fragment key={step}>
                  {idx > 0 && <span className="text-[10px] text-slate-300 font-bold">→</span>}
                  <button
                    onClick={() => handleAction({ label: `Goto ${step}`, stage: step })}
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg transition-all ${isActive ? 'bg-slate-900 text-white shadow-xs' : isCompleted ? 'bg-slate-200 text-slate-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {step}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Split-Screen Workspace (Left Area: Chats List Sidebar | Right Area: Clean Claude Chat Screen) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Area (Conversations Sidebar Panel - 260px) */}
        <aside className="w-64 bg-slate-50 border-r border-slate-150 flex flex-col h-full p-4 flex-shrink-0 hidden md:flex">
          
          {/* New Chat Action */}
          <Button 
            onClick={handleNewChat}
            className="w-full h-9 rounded-xl bg-white hover:bg-slate-55 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs mb-4"
          >
            <Plus className="size-3.5" />
            New Chat
          </Button>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-[11px] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            />
          </div>

          {/* Chat List Stream */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block pl-2 mb-1">Previous Conversations</span>
            {filteredConversations.map((c) => {
              const isActive = c.id === activeConvId;
              const isRenaming = renamingId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    if (!isRenaming) setActiveConvId(c.id);
                  }}
                  className={`group w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${isActive ? 'bg-white border border-slate-200 shadow-2xs text-slate-950 font-semibold' : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-850'}`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 mr-1.5">
                    <MessageSquare className="size-3.5 text-slate-400 flex-shrink-0" />
                    {isRenaming ? (
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="w-full px-1.5 py-0.5 text-xs border rounded bg-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameChat(c.id);
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="text-xs truncate">{c.title}</span>
                    )}
                  </div>

                  {/* Actions (Rename, Delete) */}
                  {!isRenaming && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(c.id);
                          setRenameValue(c.title);
                        }}
                        className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-650"
                      >
                        <Edit className="size-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(c.id, e)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  )}

                  {isRenaming && (
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameChat(c.id);
                        }}
                        className="p-1 rounded hover:bg-green-100 text-green-600"
                      >
                        <Check className="size-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(null);
                        }}
                        className="p-1 rounded hover:bg-red-100 text-red-500"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Area (Clean centered Conversation stream - Hero element) */}
        <main className="flex-1 bg-white flex flex-col items-center justify-between p-6 relative overflow-y-auto">
          
          {/* Centered clean container */}
          <div className="w-full max-w-2xl flex-1 flex flex-col justify-between pb-28">
            
            {activeConv ? (
              <div className="space-y-6 pt-4">
                {activeConv.messages.map((msg, idx) => {
                  const isAi = msg.sender === "ai";
                  return (
                    <div key={idx} className="space-y-3">
                      <div className={`flex gap-3.5 ${!isAi && 'justify-end'}`}>
                        {isAi && (
                          <div className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0">M</div>
                        )}
                        <div className="space-y-2 max-w-[85%]">
                          <div 
                            className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-3xs ${isAi ? 'bg-slate-50 text-slate-800 rounded-tl-xs border border-slate-100' : 'bg-slate-900 text-white rounded-tr-xs'}`}
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {msg.text}
                          </div>
                          
                          {/* Embedded workspace update card */}
                          {isAi && msg.workspaceCard && (
                            <Card className="p-4 border border-slate-100 bg-slate-50 shadow-2xs rounded-xl flex items-center justify-between gap-4 mt-2 max-w-md">
                              <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-primary">
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
                                className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs shrink-0"
                              >
                                Open Workspace
                                <ArrowUpRight className="size-3.5" />
                              </Button>
                            </Card>
                          )}

                          {/* Suggested next step transition button */}
                          {isAi && msg.action && (
                            <Button 
                              onClick={() => handleAction(msg.action!)}
                              className="h-8 px-3.5 rounded-lg bg-primary text-white hover:bg-blue-700 text-[11px] font-semibold flex items-center gap-1.5 mt-2"
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
                    <div className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0">M</div>
                    <div className="bg-slate-50 border border-slate-100 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-xs text-[13px] animate-pulse">
                      Mycroft is thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 text-slate-400 italic">
                <Bot className="size-10 text-slate-200 mb-2.5" />
                <p className="text-xs">No active conversation. Create or select a conversation on the left.</p>
              </div>
            )}

          </div>

          {/* Floating Composer Area at bottom of main area */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6 pointer-events-none z-20">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-lg p-3 pointer-events-auto flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={activeConv ? `Ask Mycroft about ${activeConv.activeStep} stage...` : "Type a message..."}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/30 font-sans"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isGenerating || !activeConv}
                />
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={isGenerating || !chatInput.trim() || !activeConv}
                  className="px-4 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  Send
                  <Send className="size-3" />
                </Button>
              </div>

              {/* Quick sample chips depending on step */}
              {activeConv && (
                <div className="flex flex-wrap items-center gap-1.5 pl-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Examples:</span>
                  {activeConv.activeStep === "Discovery" ? (
                    <>
                      <button onClick={() => handleSendMessage("Analyze Zepto reviews")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Analyze reviews</button>
                      <button onClick={() => handleSendMessage("Set target users to student corridors")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Set target users</button>
                      <button onClick={() => handleSendMessage("Lock Discovery details")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Lock Discovery</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleSendMessage("Add India compliance laws")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Add compliance rules</button>
                      <button onClick={() => handleSendMessage("Perform PRD audit checks")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Audit checks</button>
                      <button onClick={() => handleSendMessage("Transition to Design stage")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Transition to Design</button>
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
