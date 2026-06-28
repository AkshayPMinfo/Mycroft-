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
  FileCheck,
  Zap,
  ArrowRight,
  Activity,
  History,
  AlertTriangle,
  Download,
  Edit2,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  ChevronRight
} from "lucide-react";

// Stepper steps representing PM Lifecycle
const STEPS = ["Discovery", "Define", "Design", "Develop", "Deliver", "Debrief"];

interface Message {
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  action?: { label: string; stage: string };
}

interface PRDSection {
  title: string;
  content: string;
}

export default function AIHomePage() {
  const [activeStep, setActiveStep] = useState("Discovery");
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"Discovery" | "PRD" | "Stats">("Discovery");
  
  // Chat History
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Welcome back, Akshay. I am Mycroft. Describe your product idea below, and I will guide you through the Product Management lifecycle. We will start with Product Discovery.",
      timestamp: "Just now"
    }
  ]);

  // Mock Discovery State
  const [appName, setAppName] = useState("Zepto");
  const [sentiment, setSentiment] = useState("82% Positive • 18% Negative");
  const [positiveThemes, setPositiveThemes] = useState([
    "Genuinely delivers in 10 minutes for major items.",
    "Fresh produce quality matches catalog snapshots.",
    "Extremely clean payment checkout flow."
  ]);
  const [complaints, setComplaints] = useState([
    "Items frequently display 'out of stock' midway through cart creation.",
    "Recent increases in packaging and delivery convenience fees.",
    "Riders speed dangerously to maintain delivery timelines."
  ]);
  const [opportunityRecommendations, setOpportunityRecommendations] = useState([
    "Launch a '60-Second Add-On' buffer mechanism that lets users append forgotten items to an active packing order to reduce duplicate deliveries."
  ]);

  // Mock PRD State
  const [prdTitle, setPrdTitle] = useState("10-Min Campuses Grocery Delivery Spec");
  const [prdVersion, setPrdVersion] = useState(1);
  const [prdStatus, setPrdStatus] = useState<"Draft" | "Review" | "Approved">("Draft");
  const [prdSections, setPrdSections] = useState<Record<string, PRDSection>>({
    objective: { title: "Objective", content: "Build a 10-minute grocery delivery app designed for university campuses." },
    targetUsers: { title: "Target Users", content: "Students in university campuses in Bangalore." },
    successMetrics: { title: "Success Metrics", content: "Target Quality score >= 90/100, and packing times under 60 seconds." },
    compliance: { title: "Compliance", content: "Standard GDPR residency rules and local data protection compliance apply." }
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat conversation
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handles state machine logic as user inputs prompts
  const handleSendMessage = (textToSend?: string) => {
    const input = textToSend || chatInput;
    if (!input.trim()) return;

    // Append User message
    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsGenerating(true);

    setTimeout(() => {
      let aiText = "";
      let targetStage = activeStep;
      let nextAction: { label: string; stage: string } | undefined;

      const userText = input.toLowerCase();

      // Lifecycle Flow Transitions
      if (activeStep === "Discovery") {
        if (userText.includes("grocery") || userText.includes("zepto") || userText.includes("delivery")) {
          aiText = "Excellent. I have analyzed review clusters for grocery delivery apps in India. You can see the target themes for Zepto in the right pane. Let me ask: What is the primary customer profile and target region we want to capture first?";
          setAppName("Zepto");
          setActiveTab("Discovery");
        } else if (userText.includes("student") || userText.includes("bangalore") || userText.includes("campuses")) {
          aiText = "Got it. I have logged 'Students in university campuses in Bangalore' under Target Users in our active workspace schema. Next: What are the core success metrics or KPI targets we need to achieve?";
          setPrdSections(prev => ({
            ...prev,
            targetUsers: { title: "Target Users", content: "Students in university campuses in Bangalore." }
          }));
        } else if (userText.includes("metrics") || userText.includes("score") || userText.includes("seconds")) {
          aiText = "Understood. The Discovery phase is complete. I have successfully gathered the requirements baseline. I recommend we move to the Define stage to generate the PRD Spec.";
          setPrdSections(prev => ({
            ...prev,
            successMetrics: { title: "Success Metrics", content: "Target Quality score >= 90/100, and packing times under 60 seconds." }
          }));
          nextAction = { label: "Move to Define (PRD)", stage: "Define" };
        } else {
          aiText = "I have logged that research topic. Let me know if you would like me to calculate the sentiment metrics or outline the compliance maps.";
        }
      } 
      else if (activeStep === "Define") {
        if (userText.includes("compliance") || userText.includes("rbi") || userText.includes("dpdp")) {
          aiText = "Updated. I have added India DPDP Act 2023 regulations and RBI payment guidelines to Section 8 (Compliance). Let me know if you are ready to transition to the Design & Develop phase.";
          setPrdSections(prev => ({
            ...prev,
            compliance: { title: "Compliance", content: "RBI FinTech Guidelines, DPDP Act 2023 compliance audits, and PCI-DSS payment tokenization protocols." }
          }));
          setPrdVersion(v => v + 1);
        } else if (userText.includes("audit") || userText.includes("review")) {
          aiText = "Spec quality score is currently 95/100. All 8 requirements sections are populated cleanly. The spec is audit ready.";
          setPrdStatus("Review");
        } else if (userText.includes("move") || userText.includes("design") || userText.includes("develop")) {
          aiText = "PRD is approved. I have populated the engineering milestone targets and Q3 core payments roadmap. Let's move to the Design & Develop stage.";
          setPrdStatus("Approved");
          targetStage = "Design";
          setActiveTab("Stats");
          nextAction = { label: "Move to Develop", stage: "Develop" };
        } else {
          aiText = "PRD sections updated. You can review the Notion Spec canvas in the right pane.";
          setPrdVersion(v => v + 1);
        }
      }
      else {
        aiText = "Engineering milestones are active. We are currently tracking sprint capacity and tokenization constraints. Let me know what to analyze next.";
      }

      const aiMsg: Message = {
        sender: "ai",
        text: aiText,
        timestamp: "Just now",
        action: nextAction
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 800);
  };

  const handleAction = (action: { label: string; stage: string }) => {
    setActiveStep(action.stage);
    
    // Auto toggle tab view
    if (action.stage === "Define") {
      setActiveTab("PRD");
    } else if (action.stage === "Design" || action.stage === "Develop") {
      setActiveTab("Stats");
    } else {
      setActiveTab("Discovery");
    }

    const sysMsg: Message = {
      sender: "ai",
      text: `Lifecycle stage transitioned to: **${action.stage}**. Supporting workspaces have been populated automatically in the right pane.`,
      timestamp: "Just now"
    };
    setMessages(prev => [...prev, sysMsg]);
  };

  const handleEditSection = (key: string, currentValue: string) => {
    setEditingSection(key);
    setEditValue(currentValue);
  };

  const handleSaveSection = (key: string) => {
    setPrdSections(prev => ({
      ...prev,
      [key]: { ...prev[key], content: editValue }
    }));
    setPrdVersion(v => v + 1);
    setEditingSection(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans antialiased text-slate-800">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 flex justify-between items-center bg-white px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Bot className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-900">AI Workspace Home</h1>
            <p className="text-xs text-slate-500 font-medium">Mycroft PM lifecycle assistant</p>
          </div>
        </div>

        {/* Stepper Progress Tracker */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === step;
            const isCompleted = STEPS.indexOf(activeStep) > idx;
            return (
              <React.Fragment key={step}>
                {idx > 0 && <span className="text-[10px] text-slate-300 font-bold">→</span>}
                <button
                  onClick={() => handleAction({ label: `Goto ${step}`, stage: step })}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${isActive ? 'bg-slate-900 text-white shadow-xs' : isCompleted ? 'bg-slate-200 text-slate-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {step}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </header>

      {/* Main Split-Screen Workspace (Left Pane: Chat | Right Pane: Interactive Workspace Canvas) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Pane (AI Copilot Chat Interface - 6 cols / 50%) */}
        <section className="lg:col-span-6 bg-white border-r border-slate-100 p-6 flex flex-col h-full overflow-y-auto pb-28">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
            <div className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-primary">
              <Sparkles className="size-3.5" />
            </div>
            <h2 className="text-sm font-bold text-slate-950 tracking-tight">Active Conversation</h2>
            <StatusBadge tone="info" className="ml-auto">Stage: {activeStep}</StatusBadge>
          </div>

          {/* Conversation History Stream */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 max-h-[500px]">
            {messages.map((msg, idx) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={idx} className={`flex gap-3 ${!isAi && 'justify-end'}`}>
                  {isAi && (
                    <div className="flex size-7 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 flex-shrink-0">M</div>
                  )}
                  <div className="space-y-2 max-w-[85%]">
                    <div 
                      className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${isAi ? 'bg-slate-100/80 text-slate-800 rounded-tl-xs' : 'bg-slate-900 text-white rounded-tr-xs shadow-xs'}`}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {msg.text}
                    </div>
                    {isAi && msg.action && (
                      <Button 
                        onClick={() => handleAction(msg.action!)}
                        className="h-8 px-3 rounded-lg bg-primary text-white hover:bg-blue-700 text-[11px] font-semibold flex items-center gap-1 mt-2"
                      >
                        {msg.action.label}
                        <ArrowRight className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {isGenerating && (
              <div className="flex gap-3">
                <div className="flex size-7 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 flex-shrink-0">M</div>
                <div className="bg-slate-100/80 text-slate-400 px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-xs animate-pulse">
                  Mycroft is compiling workspace details...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Fixed Chat Input Composer at the bottom */}
          <div className="border-t border-slate-100 pt-4 mt-auto flex flex-col gap-2.5">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask Mycroft about ${activeStep} details...`}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50 font-sans"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={isGenerating || !chatInput.trim()}
                className="h-9 px-4 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
              >
                Send
                <Send className="size-3" />
              </Button>
            </div>
            
            {/* Quick action chips */}
            <div className="flex flex-wrap items-center gap-1.5 pl-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Prompts:</span>
              {activeStep === "Discovery" ? (
                <>
                  <button onClick={() => handleSendMessage("Analyze Zepto grocery delivery reviews")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Analyze Zepto reviews</button>
                  <button onClick={() => handleSendMessage("Set target users to students in university campuses")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Set target users</button>
                  <button onClick={() => handleSendMessage("Define success metrics as Quality score >= 90")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Define success metrics</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleSendMessage("Add RBI compliance guidelines to Section 8")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Add RBI Guidelines</button>
                  <button onClick={() => handleSendMessage("Run compliance spec audit")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Audit spec quality</button>
                  <button onClick={() => handleSendMessage("Lock and Approve PRD")} className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950">Approve PRD</button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Right Pane: Interactive Supporting Workspace Canvas (6 cols / 50%) */}
        <main className="lg:col-span-6 bg-white p-6 overflow-y-auto h-full flex flex-col border-l border-slate-50">
          
          {/* Tab Selector Headers */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-6">
            <div className="flex gap-2">
              {(["Discovery", "PRD", "Stats"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-8 px-3 text-xs font-semibold rounded-lg transition-all border ${activeTab === tab ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                >
                  {tab === "Discovery" ? "Discovery Spec" : tab === "PRD" ? "PRD Spec Editor" : "Workspace Stats"}
                </button>
              ))}
            </div>
            
            {/* Direct Link Anchor Button */}
            <Button 
              variant="secondary" 
              className="h-8 px-2.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 font-semibold text-slate-600 shadow-2xs"
              onClick={() => {
                const target = activeTab === "Discovery" ? "/product/discovery" : activeTab === "PRD" ? "/product/prds" : "/product/dashboard";
                window.location.assign(target);
              }}
            >
              Open Workspace
              <ArrowUpRight className="size-3" />
            </Button>
          </div>

          {/* Content Pane depending on Active Tab */}
          <div className="flex-1">
            
            {/* Discovery Workspace View */}
            {activeTab === "Discovery" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{appName} Reviews Summary</h3>
                    <p className="text-[10px] text-slate-450 font-semibold uppercase tracking-wider mt-0.5">Sentiment analysis</p>
                  </div>
                  <StatusBadge tone="info">{sentiment}</StatusBadge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
                      <ThumbsUp className="size-3.5" />
                      Positive Themes
                    </span>
                    <ul className="text-xs text-slate-650 space-y-1.5 font-medium bg-green-50/20 border border-green-100/50 p-3 rounded-xl leading-relaxed">
                      {positiveThemes.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                      <ThumbsDown className="size-3.5" />
                      Complaints
                    </span>
                    <ul className="text-xs text-slate-650 space-y-1.5 font-medium bg-red-50/10 border border-red-100/30 p-3 rounded-xl leading-relaxed">
                      {complaints.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl space-y-1.5 text-xs leading-relaxed">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <Zap className="size-3.5 text-primary" />
                    AI Opportunity Recommendation
                  </span>
                  <div className="font-semibold text-slate-700">
                    {opportunityRecommendations.map((rec, i) => (
                      <p key={i} className="mt-1">{rec}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PRD Workspace Editor View */}
            {activeTab === "PRD" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{prdTitle}</h3>
                    <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Version v{prdVersion} • Status: {prdStatus}</p>
                  </div>
                  <StatusBadge tone={prdStatus === "Approved" ? "healthy" : "warning"}>{prdStatus}</StatusBadge>
                </div>

                <div className="space-y-6">
                  {Object.keys(prdSections).map((key) => {
                    const sec = prdSections[key];
                    const isEditing = editingSection === key;
                    return (
                      <div key={key} className="group flex flex-col gap-1 border-b border-slate-50 pb-3 last:border-0">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{sec.title}</span>
                          {!isEditing && (
                            <button
                              onClick={() => handleEditSection(key, sec.content)}
                              className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="flex flex-col gap-2 mt-1 bg-slate-50 p-2 rounded-lg">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={3}
                              className="w-full p-2 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                            />
                            <div className="flex gap-1.5 justify-end">
                              <Button variant="secondary" className="h-7 px-2 text-[10px] border" onClick={() => setEditingSection(null)}>Cancel</Button>
                              <Button className="h-7 px-2 text-[10px]" onClick={() => handleSaveSection(key)}>Save</Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[13px] text-slate-650 leading-relaxed font-normal whitespace-pre-line bg-slate-50/30 p-2 rounded-lg border border-slate-100/50">
                            {sec.content}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Workspace Stats View */}
            {activeTab === "Stats" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-white border border-slate-100 shadow-2xs flex flex-col justify-between h-20 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PRDs Created</span>
                    <span className="text-xl font-bold tracking-tight text-slate-900">12</span>
                  </Card>
                  <Card className="p-4 bg-white border border-slate-100 shadow-2xs flex flex-col justify-between h-20 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Generations</span>
                    <span className="text-xl font-bold tracking-tight text-slate-900">240</span>
                  </Card>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Governance & Milestones</span>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="size-4 text-slate-400" />
                        MAS Compliance Audit Submission
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">July 15, 2026</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="size-4 text-slate-400" />
                        Sandbox Merchant Launch
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">August 1, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </main>

      </div>

    </div>
  );
}
