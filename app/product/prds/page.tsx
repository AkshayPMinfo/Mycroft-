"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Download, 
  History, 
  Check, 
  AlertTriangle, 
  Send,
  Plus,
  ArrowRight,
  ClipboardList,
  ChevronRight,
  Edit2,
  CheckCircle,
  FileText,
  FileCheck,
  Activity,
  Layers,
  ArrowUpRight
} from "lucide-react";

interface PRDSection {
  title: string;
  content: string;
}

interface PRD {
  id: string;
  title: string;
  prompt: string;
  score: number;
  currentVersion: number;
  status: "Draft" | "Review" | "Approved";
  sections: Record<string, PRDSection>;
}

// 8 core MVP sections
const SECTION_KEYS = [
  "objective",
  "businessValue",
  "userValue",
  "targetUsers",
  "userProblems",
  "proposedSolution",
  "successMetrics",
  "compliance"
];

const SECTION_LABELS: Record<string, string> = {
  objective: "Objective",
  businessValue: "Business Value",
  userValue: "User Value",
  targetUsers: "Target Users",
  userProblems: "User Problems",
  proposedSolution: "Proposed Solution",
  successMetrics: "Success Metrics",
  compliance: "Compliance"
};

const SUGGESTION_CHIPS = [
  { label: "Improve an Existing Product", text: "Objective: Improve checkout retention for our grocery app by solving out-of-stock drop-offs." },
  { label: "Build a New Product", text: "Objective: Build a new peer-to-peer student micro-wallet app." },
  { label: "Analyze Competitors", text: "Objective: Run a competitor landscape audit for our checkout flow." },
  { label: "Start Product Discovery", text: "Objective: Analyze App Store reviews to discover main user pain points." }
];

export default function PRDsPage() {
  const [prompt, setPrompt] = useState("");
  const [activePrd, setActivePrd] = useState<PRD | null>(null);
  const [prdHistory, setPrdHistory] = useState<PRD[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Conversational flow state
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  
  // Custom Chat Logs state
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat conversation
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentQuestionIdx, answers, messages]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mycroft_prds_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPrdHistory(parsed);
        if (parsed.length > 0) {
          setActivePrd(parsed[0]);
        }
      } catch (err) {
        console.error("Failed to load PRD history:", err);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: PRD[]) => {
    setPrdHistory(newHistory);
    localStorage.setItem("mycroft_prds_history", JSON.stringify(newHistory));
  };

  const calculateDetailScore = (text: string) => {
    let score = 25;
    if (text.length > 40) score += 15;
    if (text.length > 120) score += 20;
    
    const keywords = ["user", "payment", "metrics", "database", "scale", "security", "rbi", "compliance", "singapore", "germany", "india", "mobile", "architecture", "api"];
    keywords.forEach(kw => {
      if (text.toLowerCase().includes(kw)) {
        score += 5;
      }
    });
    return Math.min(score, 100);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    const initialPrompt = prompt;
    setIsGenerating(true);
    
    // Always trigger conversational clarifying questions first
    const questions = [
      "What target geographic region and regulatory rules should apply to this initiative?",
      "Describe the primary target users and whether they will access it via mobile or web.",
      "What are the core success metrics or KPI targets we need to achieve?"
    ];
    setClarifyingQuestions(questions);
    setCurrentQuestionIdx(0);
    setAnswers([]);

    setMessages([
      { sender: "user", text: initialPrompt },
      { sender: "ai", text: "Got it! Before I compile the PRD, let me ask a few clarifying questions to ensure research depth. " + questions[0] }
    ]);
    
    setIsGenerating(false);
  };

  const handleSendAnswer = () => {
    if (!currentAnswer.trim()) return;

    const userAns = currentAnswer;
    const newAnswers = [...answers, userAns];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    // Append user answer to chat logs
    setMessages(prev => [...prev, { sender: "user", text: userAns }]);

    if (currentQuestionIdx < clarifyingQuestions.length - 1) {
      const nextQIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextQIdx);
      
      // Append next AI question
      setMessages(prev => [...prev, { sender: "ai", text: clarifyingQuestions[nextQIdx] }]);
    } else {
      // All questions answered: compile final PRD
      setIsGenerating(true);
      
      const score = Math.min(calculateDetailScore(prompt) + 35, 100);
      const newPrd: PRD = {
        id: `prd-${Date.now()}`,
        title: prompt.split(" ").slice(0, 4).join(" ") + " Spec",
        prompt: prompt,
        score: score,
        currentVersion: 1,
        status: "Draft",
        sections: generateSectionsFromPrompt(prompt, score, newAnswers)
      };

      // Append rich PM response
      const pmSummaryText = `I have analyzed our requirements and perform some quick competitor audits. I noticed some interesting patterns.

### Core Assumptions
* **Infrastructure**: We assume college campus POS networks can sync offline tokens in under 1 second.
* **Adoption**: We assume users will switch from standard UPI to tokenized payments for transaction speed.

### Initial Recommendation
I recommend implementing a **'Phased Sandbox Launch'** targeting 50 power users first. 

I recommend this approach because it mitigates payment settlement risks in dense network areas while validating our IMDA / RBI compliance pipelines with minimal legal friction.

I don't think we should jump to a full release yet. I'd like to validate the database tokenization latencies first.

I have generated the complete 8-section compliance-ready PRD inside the editor canvas on the right. Would you like to refine the success metrics or business value next?`;

      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "ai", text: pmSummaryText }]);
        const updatedHistory = [newPrd, ...prdHistory];
        saveHistory(updatedHistory);
        setActivePrd(newPrd);
        setPrompt("");
        setCurrentQuestionIdx(-1);
        setIsGenerating(false);
      }, 800);
    }
  };

  const handleSendFollowUp = () => {
    if (!currentAnswer.trim() || !activePrd) return;

    const userText = currentAnswer;
    setCurrentAnswer("");

    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponse = "";
      const textLower = userText.toLowerCase();

      if (textLower.includes("refine") || textLower.includes("edit") || textLower.includes("update")) {
        aiResponse = "I noticed something interesting. If we update the specifications now, we should ensure the regulatory compliance framework is updated accordingly. I recommend updating the compliance section because RBI/MAS protocols require strict alignment with our features. I've updated the PRD section version to reflect this refinement.";
      } else if (textLower.includes("metric") || textLower.includes("success") || textLower.includes("kpi")) {
        aiResponse = "One concern I have is that relying solely on transaction counts can mask onboarding churn. I recommend adding 'User Drop-off rate at token generation' as a secondary success metric because it helps us identify checkout drop-offs instantly. I have added this to our metrics list.";
      } else if (textLower.includes("competitor") || textLower.includes("blinkit") || textLower.includes("instamart")) {
        aiResponse = "Our competitor gap analysis indicates that while Blinkit has faster delivery slot booking, they lag in offline transaction recovery. I recommend focusing on our micro-wallet USP because it gives us a direct entry point to low-connectivity areas.";
      } else {
        aiResponse = `Got it. I've analyzed your suggestion: "${userText}". 

I recommend we incorporate this because it enhances our overall product value proposition. I have updated the spec draft. What other assumptions or user stories should we challenge next?`;
      }

      setMessages(prev => [...prev, { sender: "ai", text: aiResponse }]);
      setIsGenerating(false);
    }, 600);
  };

  const generateSectionsFromPrompt = (rawPrompt: string, score: number, qaAnswers: string[]): Record<string, PRDSection> => {
    const region = rawPrompt.toLowerCase().includes("india") || qaAnswers.some(a => a.toLowerCase().includes("india")) ? "India" 
                 : rawPrompt.toLowerCase().includes("singapore") || qaAnswers.some(a => a.toLowerCase().includes("singapore")) ? "Singapore"
                 : "General";

    const complianceContent = region === "India" 
      ? "RBI FinTech Guidelines, DPDP Act 2023 compliance audits, PCI-DSS payment tokenization protocols."
      : region === "Singapore"
      ? "MAS Guidelines for payment processors, PDPA data residency mappings, and IMDA API standards."
      : "Standard GDPR residency rules and data protection compliance apply.";

    return {
      objective: {
        title: "Objective",
        content: `Implement a production-grade system matching your specifications: ${rawPrompt}. Designed to scale across active regions with minimal latency.`
      },
      businessValue: {
        title: "Business Value",
        content: "Addresses primary market overheads by reducing manual configuration. Anticipates operational velocity improvements of +18%."
      },
      userValue: {
        title: "User Value",
        content: "Product managers can collaborate dynamically with AI to build compliance-ready structures under tight release limits."
      },
      targetUsers: {
        title: "Target Users",
        content: qaAnswers[1] || "Compliance operations officers, product directors, and staff-level security engineers."
      },
      userProblems: {
        title: "User Problems",
        content: "Compliance mapping requires cross-disciplinary manual reviews. This results in standard release cycles lagging by 4-6 weeks."
      },
      proposedSolution: {
        title: "Proposed Solution",
        content: "Build a dynamic context-aware policy mapping engine directly bound to the requirement document state lifecycle."
      },
      successMetrics: {
        title: "Success Metrics",
        content: qaAnswers[2] || "Establish compliance score baseline above 90/100, and ensure QA certification latency falls below 48 hours."
      },
      compliance: {
        title: "Compliance",
        content: complianceContent
      }
    };
  };

  const handleEditSection = (key: string, currentValue: string) => {
    setEditingSection(key);
    setEditValue(currentValue);
  };

  const handleSaveSection = (key: string) => {
    if (!activePrd) return;

    const updatedPrd: PRD = {
      ...activePrd,
      currentVersion: activePrd.currentVersion + 1,
      sections: {
        ...activePrd.sections,
        [key]: {
          ...activePrd.sections[key],
          content: editValue
        }
      }
    };

    const updatedHistory = prdHistory.map(p => p.id === activePrd.id ? updatedPrd : p);
    saveHistory(updatedHistory);
    setActivePrd(updatedPrd);
    setEditingSection(null);
  };

  // Find missing sections (empty or containing placeholder text)
  const getMissingSections = () => {
    if (!activePrd) return [];
    return SECTION_KEYS.filter(key => {
      const content = activePrd.sections[key]?.content || "";
      return content.trim().length === 0 || content.toLowerCase().includes("tbd");
    }).map(key => SECTION_LABELS[key]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans antialiased text-slate-800">
      {/* Global Compact Header */}
      <header className="sticky top-0 z-30 flex justify-between items-center bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-900">PRD Workspace</h1>
            <p className="text-xs text-slate-500 font-medium">Collaborative specification manager</p>
          </div>
        </div>
        <div className="flex gap-2">
          {activePrd && (
            <Button 
              variant="secondary" 
              onClick={() => setIsAuditOpen(true)} 
              className="h-9 px-3 text-xs bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all duration-200"
            >
              <FileCheck className="size-3.5 text-slate-500" />
              Review & Audit
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={() => setIsHistoryOpen(true)} 
            className="h-9 px-3 text-xs bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all duration-200"
          >
            <History className="size-3.5 text-slate-500" />
            PRD History
          </Button>
        </div>
      </header>

      {/* Balanced 2-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden h-[calc(100vh-68px)] bg-white">
        
        {/* Left Column: Mycroft AI Chat Workspace (Claude/ChatGPT feel - 5 cols) */}
        <aside className="lg:col-span-5 bg-slate-50/20 border-r border-slate-100 flex flex-col h-full overflow-hidden">
          <div className="p-5 border-b border-slate-100/80 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm shadow-violet-250">
                <Sparkles className="size-4 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Mycroft AI</h2>
                <p className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">Describe your product. I'll research, clarify specifications, and compile a compliant PRD.</p>
              </div>
            </div>
          </div>
          
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full gap-6">
              {/* Suggestion Chips Container */}
              <div className="space-y-2.5">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Suggestion Chips</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTION_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(chip.text)}
                      className="text-left p-3 text-[11.5px] bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl font-semibold text-slate-700 transition-all hover:border-slate-350 hover:shadow-2xs active:scale-98"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your product idea in detail..."
                  rows={8}
                  className="w-full p-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-950 resize-none bg-white transition-all font-sans leading-relaxed shadow-2xs"
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()} 
                  className="w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  Collaborate & Generate
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            // Claude-like Conversational Stream
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, idx) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div key={idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      {!isUser && (
                        <div className="flex items-center gap-1.5 mb-1.5 pl-1">
                          <div className="flex size-4.5 items-center justify-center rounded-md bg-violet-600 text-[9px] font-bold text-white shadow-2xs">M</div>
                          <span className="text-[10px] font-bold text-slate-400">Mycroft AI</span>
                        </div>
                      )}
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-[13px] max-w-[88%] shadow-2xs leading-relaxed whitespace-pre-line font-medium",
                        isUser 
                          ? "bg-slate-900 text-white rounded-tr-xs" 
                          : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-xs"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                {isGenerating && (
                  <div className="flex items-start gap-1.5 pl-1">
                    <div className="flex size-4.5 items-center justify-center rounded bg-violet-600 text-[9px] font-bold text-white animate-pulse">M</div>
                    <div className="bg-slate-50 text-slate-400 px-4 py-2.5 rounded-2xl rounded-tl-xs text-[11px] border border-slate-100 flex items-center gap-1.5 font-semibold animate-pulse">
                      Analyzing and drafting requirements...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Conversational Input Box */}
              <div className="border-t border-slate-100 p-5 flex flex-col gap-2.5 bg-white flex-shrink-0">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder={currentQuestionIdx !== -1 ? "Type your answer to Mycroft..." : "Type your follow-up ideas or refinement requests..."}
                  rows={3}
                  className="w-full p-3.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-950 resize-none bg-slate-50/10 font-sans shadow-2xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (currentQuestionIdx !== -1) {
                        handleSendAnswer();
                      } else {
                        handleSendFollowUp();
                      }
                    }
                  }}
                />
                <div className="flex gap-2 justify-between items-center">
                  <button 
                    onClick={() => {
                      setMessages([]);
                      setClarifyingQuestions([]);
                      setCurrentQuestionIdx(-1);
                      setAnswers([]);
                      setActivePrd(null);
                    }} 
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-semibold"
                  >
                    Reset Conversation
                  </button>
                  <Button 
                    onClick={currentQuestionIdx !== -1 ? handleSendAnswer : handleSendFollowUp} 
                    disabled={isGenerating || !currentAnswer.trim()} 
                    className="h-9 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    {currentQuestionIdx !== -1 ? "Send Answer" : "Send Follow-up"}
                    <Send className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Right Column: Notion-style PRD Canvas (7 cols) */}
        <main className="lg:col-span-7 bg-white h-full overflow-hidden flex flex-col">
          {activePrd ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Sticky Layout Options Toolbar */}
              <div className="flex justify-between items-center bg-white px-8 py-4 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="neutral">
                    Version v{activePrd.currentVersion}
                  </StatusBadge>
                  <StatusBadge tone={activePrd.status === "Approved" ? "healthy" : "warning"}>
                    {activePrd.status}
                  </StatusBadge>
                </div>
                <div className="flex gap-1.5">
                  <Button 
                    variant="secondary" 
                    className="h-8 px-2.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 font-semibold text-slate-600 shadow-2xs" 
                    onClick={() => alert("PDF downloaded successfully!")}
                  >
                    <Download className="size-3" />
                    PDF
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-8 px-2.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 font-semibold text-slate-600 shadow-2xs" 
                    onClick={() => alert("DOCX downloaded successfully!")}
                  >
                    <Download className="size-3" />
                    DOCX
                  </Button>
                </div>
              </div>

              {/* Notion Document Canvas */}
              <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-10">
                <article className="w-full max-w-2xl mx-auto space-y-8 pb-32">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 outline-none font-sans">
                    {activePrd.title}
                  </h2>

                  <div className="space-y-8">
                    {SECTION_KEYS.map((key) => {
                      const section = activePrd.sections[key];
                      const isEditing = editingSection === key;
                      return (
                        <section key={key} className="group flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {SECTION_LABELS[key]}
                            </span>
                            {!isEditing && (
                              <button
                                onClick={() => handleEditSection(key, section?.content || "")}
                                className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                              >
                                <Edit2 className="size-3" />
                                Edit
                              </button>
                            )}
                          </div>
                          
                          {isEditing ? (
                            <div className="flex flex-col gap-2 mt-1 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={4}
                                className="w-full p-3 text-sm border-0 bg-transparent focus:ring-0 focus:outline-none resize-none font-sans text-slate-700 leading-relaxed"
                              />
                              <div className="flex gap-1.5 justify-end p-1">
                                <Button 
                                  variant="secondary" 
                                  className="h-8 px-3 text-xs border border-slate-200 bg-white" 
                                  onClick={() => setEditingSection(null)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="h-8 px-3 text-xs bg-slate-900 text-white hover:bg-slate-800" 
                                  onClick={() => handleSaveSection(key)}
                                >
                                  Save Change
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[14px] text-slate-650 leading-relaxed font-normal py-1 pr-4 whitespace-pre-line">
                              {section?.content || <span className="text-slate-400 italic">No content generated. Click Edit to add context.</span>}
                            </p>
                          )}
                        </section>
                      );
                    })}
                  </div>
                </article>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-slate-50/10">
              <p className="text-xs font-semibold text-slate-400 max-w-xs leading-relaxed">
                Introduce your product idea on the left to begin drafting the specification.
              </p>
            </div>
          )}
        </main>

      </div>

      {/* Review & Audit Slide-over Drawer Overlay */}
      {isAuditOpen && activePrd && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/10 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-white h-full shadow-2xl p-6 flex flex-col gap-4 border-l border-slate-100 transition-transform overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="size-4.5 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-950 tracking-tight">Review & Audit</h2>
              </div>
              <button 
                className="text-slate-450 hover:text-slate-900 text-lg font-semibold p-1" 
                onClick={() => setIsAuditOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-5">
              {/* Quality Score Indicator */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Spec Quality Score</span>
                  <span className="text-xs font-semibold text-slate-600 mt-1">Audit Score</span>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-sm shadow-xs">
                  {activePrd.score}
                </div>
              </div>

              {/* Warnings / Missing fields list */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Requirements Audit</span>
                {getMissingSections().length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-1.5 text-xs text-amber-700">
                      <AlertTriangle className="size-4 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">Missing sections detected:</span>
                    </div>
                    <ul className="text-xs text-slate-500 pl-5 list-disc space-y-1">
                      {getMissingSections().map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-green-700 text-xs leading-relaxed">
                    <CheckCircle className="size-4 flex-shrink-0 mt-0.5 text-green-500" />
                    <span>All 8 mandatory requirements sections are populated cleanly. Specification is audit ready.</span>
                  </div>
                )}
              </div>

              {/* Regulatory Mappings List */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Compliance Maps</span>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">India (RBI Rules)</span>
                    <StatusBadge tone="info">Active</StatusBadge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">Singapore (MAS Guidelines)</span>
                    <StatusBadge tone="info">Active</StatusBadge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">Germany (GDPR Laws)</span>
                    <StatusBadge tone="info">Active</StatusBadge>
                  </div>
                </div>
              </div>

              {/* Short Audit Notes */}
              {activePrd.score < 80 && (
                <div className="p-3 bg-amber-50/30 text-amber-800 rounded-xl border border-amber-100/50 text-xs leading-relaxed flex gap-2">
                  <AlertTriangle className="size-4 flex-shrink-0 mt-0.5 text-amber-600" />
                  <span>Prompt contains placeholder elements. Add detailed user stories or metrics to automatically increment your score.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Slide-over Drawer Overlay */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/10 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-white h-full shadow-2xl p-6 flex flex-col gap-4 border-l border-slate-100 transition-transform">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="size-4.5 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-950 tracking-tight">Requirement History</h2>
              </div>
              <button 
                className="text-slate-400 hover:text-slate-900 text-lg font-bold p-1" 
                onClick={() => setIsHistoryOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {prdHistory.length > 0 ? (
                prdHistory.map((prd) => (
                  <div 
                    key={prd.id} 
                    onClick={() => {
                      setActivePrd(prd);
                      setIsHistoryOpen(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all hover:border-slate-300 ${activePrd?.id === prd.id ? 'border-slate-900 bg-slate-50' : 'border-slate-100 bg-white'}`}
                  >
                    <p className="text-xs font-bold text-slate-900 truncate">{prd.title}</p>
                    <p className="text-[10px] font-semibold text-slate-500 mt-1">Version v{prd.currentVersion} • Score {prd.score}/100</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-slate-400 py-12 italic">No history logged yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
