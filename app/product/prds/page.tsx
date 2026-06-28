"use client";

import React, { useState, useEffect } from "react";
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
  ClipboardList
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
  objective: "1. Objective",
  businessValue: "2. Business Value",
  userValue: "3. User Value",
  targetUsers: "4. Target Users",
  userProblems: "5. User Problems",
  proposedSolution: "6. Proposed Solution",
  successMetrics: "7. Success Metrics",
  compliance: "8. Compliance"
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
    let score = 20;
    if (text.length > 30) score += 15;
    if (text.length > 100) score += 15;
    
    const keywords = ["user", "payment", "metrics", "database", "scale", "security", "rbi", "compliance", "singapore", "germany", "india", "mobile"];
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

    if (score < 50) {
      // Vague prompt: trigger conversational clarifying questions
      const questions = [
        "What is the target geographic region and industry sector?",
        "Who are the primary target users and what platforms should be supported (mobile, web)?",
        "What are the core success metrics or key performance indicators (KPIs)?"
      ];
      setClarifyingQuestions(questions);
      setCurrentQuestionIdx(0);
      setAnswers([]);
      setIsGenerating(false);
    } else {
      // Detailed prompt: compile immediately
      const newPrd: PRD = {
        id: `prd-${Date.now()}`,
        title: prompt.split(" ").slice(0, 4).join(" ") + " PRD",
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
      const score = Math.min(calculateDetailScore(prompt) + 30, 100);
      const newPrd: PRD = {
        id: `prd-${Date.now()}`,
        title: prompt.split(" ").slice(0, 4).join(" ") + " PRD",
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
      ? "RBI Fintech Guidelines, DPDP Act 2023, PCI-DSS compliance required."
      : region === "Singapore"
      ? "MAS Guidelines, PDPA standards, and IMDA regulations required."
      : "Standard GDPR and data protection regulations apply.";

    return {
      objective: {
        title: "1. Objective",
        content: `Build out a comprehensive system to support the core objective: ${rawPrompt}. Highly targeted implementation focusing on scalability and reliability.`
      },
      businessValue: {
        title: "2. Business Value",
        content: `Increases market footprint by providing a streamlined workspace. Target efficiency improvements calculated at +15% velocity.`
      },
      userValue: {
        title: "3. User Value",
        content: "Allows product managers to collaborate with AI and build out structured documentation in under 5 minutes."
      },
      targetUsers: {
        title: "4. Target Users",
        content: qaAnswers[1] || "Product Managers, Tech Leads, and compliance operations officers."
      },
      userProblems: {
        title: "5. User Problems",
        content: "Drafting compliance documentation requires multiple manual cross-references, leading to slow release schedules."
      },
      proposedSolution: {
        title: "6. Proposed Solution",
        content: "Integrate a real-time regulatory compliance mapping engine inside the editor workspace."
      },
      successMetrics: {
        title: "7. Success Metrics",
        content: qaAnswers[2] || "Target Quality score >= 85/100, and compilation errors reduced by 40%."
      },
      compliance: {
        title: "8. Compliance",
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f7fe] p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardList className="size-6 text-primary" />
            PRD Workspace
          </h1>
          <p className="text-sm text-slate-500">Collaborate with Mycroft to build regulatory compliant product requirements.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2">
            <History className="size-4" />
            History ({prdHistory.length})
          </Button>
        </div>
      </header>

      {/* 3-Column Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* Left Column: AI Composer (4 Cols) */}
        <section className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI Composer
          </h2>
          
          {currentQuestionIdx === -1 ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-500">
                Describe your product idea to collaborate with Mycroft. We will analyze your specifications, clarify details, and compile a compliant PRD framework.
              </p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your product idea (e.g. Build a mobile wallet for students in India...)"
                rows={5}
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full rounded-xl">
                Collaborate & Generate PRD
              </Button>
            </div>
          ) : (
            // Conversational Flow
            <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Clarifying Question {currentQuestionIdx + 1} of 3</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{clarifyingQuestions[currentQuestionIdx]}</p>
              </div>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Enter your answer..."
                rows={3}
                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => setClarifyingQuestions([])} className="text-xs px-3 h-9 rounded-lg">Cancel</Button>
                <Button onClick={handleSendAnswer} disabled={!currentAnswer.trim()} className="text-xs px-3 h-9 rounded-lg flex items-center gap-1">
                  Send Answer
                  <Send className="size-3" />
                </Button>
              </div>
            </div>
          )}

          {activePrd && (
            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-500">Prompt Quality Scorer</span>
                <StatusBadge tone={activePrd.score >= 80 ? "healthy" : "warning"}>
                  {activePrd.score}/100
                </StatusBadge>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${activePrd.score >= 80 ? 'bg-green-500' : activePrd.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${activePrd.score}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Center Column: PRD Document Viewer/Editor (5 Cols) */}
        <section className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[500px]">
          {activePrd ? (
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{activePrd.title}</h2>
                  <p className="text-xs text-slate-500">Version v{activePrd.currentVersion} • Status: {activePrd.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="h-9 px-3 text-xs flex items-center gap-1" onClick={() => alert("PDF generated successfully!")}>
                    <Download className="size-3.5" />
                    PDF
                  </Button>
                  <Button variant="secondary" className="h-9 px-3 text-xs flex items-center gap-1" onClick={() => alert("DOCX generated successfully!")}>
                    <Download className="size-3.5" />
                    DOCX
                  </Button>
                </div>
              </div>

              {/* Editable Sections List */}
              <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                {SECTION_KEYS.map((key) => {
                  const section = activePrd.sections[key];
                  const isEditing = editingSection === key;
                  return (
                    <div key={key} className="group border-b border-slate-50 pb-4 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-bold text-slate-800">{SECTION_LABELS[key]}</h3>
                        {!isEditing && (
                          <button
                            onClick={() => handleEditSection(key, section?.content || "")}
                            className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="flex flex-col gap-2 mt-1">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={3}
                            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="secondary" className="h-8 px-2 text-xs" onClick={() => setEditingSection(null)}>Cancel</Button>
                            <Button className="h-8 px-2 text-xs" onClick={() => handleSaveSection(key)}>Save</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50">
                          {section?.content || <span className="text-slate-400 italic">No content generated. Edit to add context.</span>}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
              <ClipboardList className="size-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No Active PRD</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Use the AI Composer on the left to collaborate and draft your first product requirement document framework.
              </p>
            </div>
          )}
        </section>

        {/* Right Column: Review Panel (3 Cols) */}
        <section className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Check className="size-5 text-green-500" />
            Review & Compliance
          </h2>

          {activePrd ? (
            <div className="flex flex-col gap-4">
              {/* Quality Audit Block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Audit Verdict</h3>
                {activePrd.score >= 80 ? (
                  <div className="flex items-start gap-2 text-green-700">
                    <Check className="size-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs leading-relaxed">
                      Requirements score meets production readiness. Document structure maps directly to all 8 MVP metrics cleanly.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-amber-700">
                    <AlertTriangle className="size-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs leading-relaxed">
                      Low score warning: Some fields utilize short placeholder sentences. Consider elaborating on objectives and success criteria to bypass QA warnings.
                    </p>
                  </div>
                )}
              </div>

              {/* Regulatory Mapping Indicator */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Regulatory Mappings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">India (RBI Guidelines)</span>
                    <StatusBadge tone="info">Active</StatusBadge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">Singapore (MAS Standards)</span>
                    <StatusBadge tone="info">Active</StatusBadge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">Germany (GDPR Rules)</span>
                    <StatusBadge tone="info">Active</StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 text-xs text-slate-400 italic">
              Generate a document to activate the Review & Audit tools.
            </div>
          )}
        </section>

      </div>

      {/* History Drawer Overlay */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-white h-full shadow-2xl p-6 flex flex-col gap-4 transition-transform">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                <History className="size-5 text-primary" />
                PRD History
              </h2>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsHistoryOpen(false)}>×</Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {prdHistory.length > 0 ? (
                prdHistory.map((prd) => (
                  <div 
                    key={prd.id} 
                    onClick={() => {
                      setActivePrd(prd);
                      setIsHistoryOpen(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer hover:border-primary/50 transition-all ${activePrd?.id === prd.id ? 'border-primary bg-blue-50/30' : 'border-slate-100 bg-slate-50/50'}`}
                  >
                    <p className="text-sm font-bold text-slate-800 truncate">{prd.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Version v{prd.currentVersion} • Score {prd.score}/100</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-slate-400 py-8 italic">No saved documents found in local storage.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
