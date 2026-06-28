"use client";

import React, { useState, useEffect, useRef } from "react";
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

export default function PRDsPage() {
  const [prompt, setPrompt] = useState("");
  const [activePrd, setActivePrd] = useState<PRD | null>(null);
  const [prdHistory, setPrdHistory] = useState<PRD[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Conversational flow state
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat conversation
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentQuestionIdx, answers]);

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

    setIsGenerating(true);
    const score = calculateDetailScore(prompt);

    if (score < 55) {
      // Vague prompt: trigger conversational clarifying questions
      const questions = [
        "What target geographic region and regulatory rules should apply to this initiative?",
        "Describe the primary target users and whether they will access it via mobile or web.",
        "What are the core success metrics or KPI targets we need to achieve?"
      ];
      setClarifyingQuestions(questions);
      setCurrentQuestionIdx(0);
      setAnswers([]);
      setIsGenerating(false);
    } else {
      // Detailed prompt: compile immediately
      const newPrd: PRD = {
        id: `prd-${Date.now()}`,
        title: prompt.split(" ").slice(0, 4).join(" ") + " Spec",
        prompt: prompt,
        score: score,
        currentVersion: 1,
        status: "Draft",
        sections: generateSectionsFromPrompt(prompt, score, [])
      };

      const updatedHistory = [newPrd, ...prdHistory];
      saveHistory(updatedHistory);
      setActivePrd(newPrd);
      setPrompt("");
      setIsGenerating(false);
    }
  };

  const handleSendAnswer = () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIdx < clarifyingQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // All questions answered: compile final PRD
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

      const updatedHistory = [newPrd, ...prdHistory];
      saveHistory(updatedHistory);
      setActivePrd(newPrd);
      setPrompt("");
      setClarifyingQuestions([]);
      setCurrentQuestionIdx(-1);
    }
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
          <Button 
            variant="secondary" 
            onClick={() => setIsHistoryOpen(true)} 
            className="h-9 px-3 text-xs bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 font-medium text-slate-600 shadow-xs"
          >
            <History className="size-3.5" />
            History ({prdHistory.length})
          </Button>
        </div>
      </header>

      {/* Balanced 3-Column Layout (AI Composer: 25% | Notion Doc: 50% | Review Panel: 25%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Column: AI Composer (Claude/ChatGPT feel - 3 cols / 25%) */}
        <aside className="lg:col-span-3 bg-white border-r border-slate-100 p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-primary">
              <Sparkles className="size-3.5" />
            </div>
            <h2 className="text-sm font-bold text-slate-950 tracking-tight">AI Copilot Composer</h2>
          </div>
          
          {currentQuestionIdx === -1 ? (
            <div className="flex flex-col flex-1 gap-4">
              <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 text-xs text-slate-500 leading-relaxed">
                Describe your product idea. Mycroft will analyze specifications, clarify details, and compile a compliant PRD structure.
                <div className="mt-3 space-y-1.5">
                  <span className="block font-semibold text-slate-600">Examples:</span>
                  <button 
                    onClick={() => setPrompt("Build a mobile wallet for students in India with peer-to-peer payments up to 500 rupees")} 
                    className="block text-left text-primary hover:underline"
                  >
                    • Mobile wallet for students in India
                  </button>
                  <button 
                    onClick={() => setPrompt("Design an API gateway integration service for fintech platforms in Singapore")} 
                    className="block text-left text-primary hover:underline"
                  >
                    • API gateway integration in Singapore
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your product idea in detail..."
                  rows={6}
                  className="w-full p-3.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-950 resize-none bg-slate-50/30 transition-all font-sans"
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()} 
                  className="w-full h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  Collaborate & Generate
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            // Claude-like Conversational Stream
            <div className="flex flex-col flex-1 gap-4 min-h-[300px]">
              <div className="flex-1 overflow-y-auto space-y-4 max-h-[350px] pr-1">
                {/* Initial Prompt Bubble */}
                <div className="flex flex-col items-end">
                  <div className="bg-slate-900 text-white px-3 py-2 rounded-2xl rounded-tr-xs text-xs max-w-[85%] shadow-xs leading-relaxed">
                    {prompt}
                  </div>
                </div>

                {/* Completed QA bubbles */}
                {answers.map((ans, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 flex-shrink-0">M</div>
                      <div className="bg-slate-100/80 text-slate-800 px-3 py-2 rounded-2xl rounded-tl-xs text-xs max-w-[85%] leading-relaxed">
                        {clarifyingQuestions[idx]}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-2xl rounded-tr-xs text-xs max-w-[85%] shadow-xs leading-relaxed">
                        {ans}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Current Bot Question */}
                <div className="flex items-start gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 flex-shrink-0">M</div>
                  <div className="bg-slate-100/80 text-slate-800 px-3 py-2 rounded-2xl rounded-tl-xs text-xs max-w-[85%] leading-relaxed">
                    {clarifyingQuestions[currentQuestionIdx]}
                  </div>
                </div>
                <div ref={chatEndRef} />
              </div>

              {/* Conversational Input Box */}
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer to Mycroft..."
                  rows={2}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-950 resize-none bg-slate-50/50 font-sans"
                />
                <div className="flex gap-2 justify-between items-center">
                  <button 
                    onClick={() => setClarifyingQuestions([])} 
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Reset
                  </button>
                  <Button 
                    onClick={handleSendAnswer} 
                    disabled={!currentAnswer.trim()} 
                    className="h-8 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-1"
                  >
                    Send Answer
                    <Send className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Center Column: Notion-style PRD Canvas (6 cols / 50%) */}
        <main className="lg:col-span-6 bg-white p-8 lg:p-12 overflow-y-auto h-full flex flex-col items-center">
          <div className="w-full max-w-2xl flex flex-col flex-1">
            
            {activePrd ? (
              <div className="flex flex-col flex-1">
                {/* Sticky Layout Options Toolbar */}
                <div className="sticky top-0 z-20 flex justify-between items-center bg-white/90 backdrop-blur-md pb-4 mb-8 border-b border-slate-100">
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
                      className="h-8 px-2.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 font-medium text-slate-600 shadow-2xs" 
                      onClick={() => alert("PDF downloaded successfully!")}
                    >
                      <Download className="size-3" />
                      PDF
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="h-8 px-2.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 font-medium text-slate-600 shadow-2xs" 
                      onClick={() => alert("DOCX downloaded successfully!")}
                    >
                      <Download className="size-3" />
                      DOCX
                    </Button>
                  </div>
                </div>

                {/* Notion Document Canvas */}
                <article className="flex-1 space-y-8">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 outline-none font-sans">
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
                            <p className="text-[15px] text-slate-600 leading-relaxed font-normal py-1 pr-4 whitespace-pre-line">
                              {section?.content || <span className="text-slate-400 italic">No content generated. Click Edit to add context.</span>}
                            </p>
                          )}
                        </section>
                      );
                    })}
                  </div>
                </article>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center py-20">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4 border border-slate-100">
                  <ClipboardList className="size-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Create a new product spec</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Start mapping your project details by writing a prompt to the AI Copilot on the left.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right Column: Review & Meta Panel (Compact - 3 cols / 25%) */}
        <aside className="lg:col-span-3 bg-white border-l border-slate-100 p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex size-6 items-center justify-center rounded-md bg-green-50 text-green-600">
              <FileCheck className="size-3.5" />
            </div>
            <h2 className="text-sm font-bold text-slate-950 tracking-tight">Review & Audit</h2>
          </div>

          {activePrd ? (
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
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 italic">
              Generate a document to run compliance audits.
            </div>
          )}
        </aside>

      </div>

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
