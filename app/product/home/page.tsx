"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PM_KNOWLEDGE_BASE, retrieveRelevantKnowledge } from "@/lib/pmKnowledge";
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
  History as HistoryIcon,
  Paperclip,
  Bell,
  ChevronDown,
  GitBranch,
  Users,
  Target,
  FileText,
  Mic,
  ChevronLeft,
  MoreHorizontal,
  MoreVertical,
  Pin
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

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-900 bg-slate-100/40 px-0.5 rounded-sm">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="font-mono text-[11.5px] bg-slate-105 text-violet-700 px-1 py-0.5 rounded border border-slate-200/50">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

// ─── Inline Framework SVG Rendering Components ──────────────────────────────
interface TextSegment {
  type: "text" | "kano" | "matrix" | "tree";
  content: string;
}

function parseAttributes(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /(\w+)=(['"])([\s\S]*?)\2/gi;
  let match;
  while ((match = attrRegex.exec(attrStr)) !== null) {
    attrs[match[1]] = match[3];
  }
  return attrs;
}

function parseMessageSegments(text: string): TextSegment[] {
  if (!text) return [];
  const tagRegex = /(<(?:KanoModelChart|PrioritizationMatrix|OpportunityTree)\s+[\s\S]*?\s*\/>)/gi;
  const parts = text.split(tagRegex);
  return parts.map(part => {
    if (part.startsWith("<KanoModelChart")) {
      return { type: "kano" as const, content: part };
    } else if (part.startsWith("<PrioritizationMatrix")) {
      return { type: "matrix" as const, content: part };
    } else if (part.startsWith("<OpportunityTree")) {
      return { type: "tree" as const, content: part };
    } else {
      return { type: "text" as const, content: part };
    }
  }).filter(seg => seg.content !== "");
}

function KanoModelChart({
  title,
  basic,
  performance,
  excitement,
}: {
  title: string;
  basic: string;
  performance: string;
  excitement: string;
}) {
  const basicList = basic ? basic.split(",").map(s => s.trim()) : [];
  const performanceList = performance ? performance.split(",").map(s => s.trim()) : [];
  const excitementList = excitement ? excitement.split(",").map(s => s.trim()) : [];

  return (
    <div className="my-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
      <h4 className="text-sm font-bold text-slate-800 mb-3">{title}</h4>
      <div className="relative w-full max-w-lg mx-auto bg-slate-50/50 rounded-xl p-2 border border-slate-100">
        <svg viewBox="0 0 500 350" className="w-full h-auto">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          <rect x="50" y="50" width="200" height="125" fill="#f8fafc" opacity="0.5" />
          <rect x="250" y="50" width="200" height="125" fill="#f8fafc" opacity="0.3" />
          <rect x="50" y="175" width="200" height="125" fill="#f8fafc" opacity="0.3" />
          <rect x="250" y="175" width="200" height="125" fill="#f8fafc" opacity="0.5" />

          <line x1="50" y1="175" x2="450" y2="175" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="450" y1="175" x2="455" y2="175" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />
          
          <line x1="250" y1="300" x2="250" y2="50" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="250" y1="50" x2="250" y2="45" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />

          <text x="450" y="195" fontSize="10" fontWeight="600" fill="#475569" textAnchor="end">Fully Implemented</text>
          <text x="50" y="195" fontSize="10" fontWeight="600" fill="#475569">Absent</text>
          <text x="260" y="45" fontSize="10" fontWeight="600" fill="#475569">Delighted / Satisfied</text>
          <text x="260" y="305" fontSize="10" fontWeight="600" fill="#475569">Frustrated / Dissatisfied</text>

          <path d="M 90 170 C 230 165, 300 130, 410 70" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
          <text x="415" y="65" fontSize="9" fontWeight="700" fill="#8b5cf6" textAnchor="start">Excitement (Attractive)</text>

          <line x1="90" y1="270" x2="410" y2="70" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <text x="415" y="77" fontSize="9" fontWeight="700" fill="#10b981" textAnchor="start">Performance</text>

          <path d="M 90 280 C 200 220, 270 185, 410 180" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <text x="415" y="185" fontSize="9" fontWeight="700" fill="#ef4444" textAnchor="start">Basic (Must-Be)</text>

          <line x1="90" y1="175" x2="410" y2="175" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />

          {excitementList.map((feat, i) => {
            const x = 320 + i * 35;
            const y = 120 - i * 15;
            return (
              <g key={`ex-${i}`}>
                <circle cx={x} cy={y} r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="1.5" />
                <rect x={x - 4} y={y - 18} width={feat.length * 6 + 8} height="13" rx="3" fill="#8b5cf6" opacity="0.9" />
                <text x={x} y={y - 9} fontSize="7" fontWeight="bold" fill="#fff" dx="2">{feat}</text>
              </g>
            );
          })}

          {performanceList.map((feat, i) => {
            const x = 200 + i * 40;
            const y = 200 - i * 25;
            return (
              <g key={`perf-${i}`}>
                <circle cx={x} cy={y} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                <rect x={x - 4} y={y - 18} width={feat.length * 6 + 8} height="13" rx="3" fill="#10b981" opacity="0.9" />
                <text x={x} y={y - 9} fontSize="7" fontWeight="bold" fill="#fff" dx="2">{feat}</text>
              </g>
            );
          })}

          {basicList.map((feat, i) => {
            const x = 160 + i * 50;
            const y = 230 - i * 12;
            return (
              <g key={`bas-${i}`}>
                <circle cx={x} cy={y} r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                <rect x={x - 4} y={y - 18} width={feat.length * 6 + 8} height="13" rx="3" fill="#ef4444" opacity="0.9" />
                <text x={x} y={y - 9} fontSize="7" fontWeight="bold" fill="#fff" dx="2">{feat}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function PrioritizationMatrix({
  title,
  featuresStr,
}: {
  title: string;
  featuresStr: string;
}) {
  let features: Array<{ name: string; value: number; effort: number }> = [];
  try {
    const normalized = featuresStr.replace(/'/g, '"');
    features = JSON.parse(normalized);
  } catch (e) {
    console.error("Error parsing prioritization matrix features:", e);
  }

  return (
    <div className="my-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
      <h4 className="text-sm font-bold text-slate-800 mb-3">{title}</h4>
      <div className="relative w-full max-w-lg mx-auto bg-slate-50/50 rounded-xl p-2 border border-slate-100">
        <svg viewBox="0 0 500 400" className="w-full h-auto">
          <rect x="50" y="50" width="200" height="150" fill="#f0fdf4" stroke="#e2e8f0" strokeWidth="0.5" />
          <text x="60" y="70" fontSize="11" fontWeight="700" fill="#15803d">Quick Wins (High Value, Low Effort)</text>

          <rect x="250" y="50" width="200" height="150" fill="#eff6ff" stroke="#e2e8f0" strokeWidth="0.5" />
          <text x="260" y="70" fontSize="11" fontWeight="700" fill="#1d4ed8">Major Projects (High Value, High Effort)</text>

          <rect x="50" y="200" width="200" height="150" fill="#fefce8" stroke="#e2e8f0" strokeWidth="0.5" />
          <text x="60" y="220" fontSize="11" fontWeight="700" fill="#a16207">Fill-Ins (Low Value, Low Effort)</text>

          <rect x="250" y="200" width="200" height="150" fill="#fff5f5" stroke="#e2e8f0" strokeWidth="0.5" />
          <text x="260" y="220" fontSize="11" fontWeight="700" fill="#b91c1c">Thankless Tasks (Low Value, High Effort)</text>

          <line x1="250" y1="50" x2="250" y2="350" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="50" y1="200" x2="450" y2="200" stroke="#cbd5e1" strokeWidth="2" />

          <text x="250" y="375" fontSize="11" fontWeight="700" fill="#475569" textAnchor="middle">EFFORT →</text>
          <text x="25" y="200" fontSize="11" fontWeight="700" fill="#475569" textAnchor="middle" transform="rotate(-90, 25, 200)">VALUE / IMPACT →</text>

          {features.map((feat, i) => {
            const effortVal = Math.min(Math.max(feat.effort, 0), 10);
            const x = 50 + effortVal * 40;
            const valueVal = Math.min(Math.max(feat.value, 0), 10);
            const y = 350 - valueVal * 30;

            const isHighValue = valueVal > 5;
            const isLowEffort = effortVal <= 5;
            let dotColor = "#8b5cf6";
            if (isHighValue && isLowEffort) dotColor = "#10b981";
            else if (isHighValue && !isLowEffort) dotColor = "#3b82f6";
            else if (!isHighValue && isLowEffort) dotColor = "#eab308";
            else dotColor = "#ef4444";

            return (
              <g key={`feat-${i}`}>
                <circle cx={x} cy={y} r="6.5" fill={dotColor} stroke="#fff" strokeWidth="2" />
                <rect x={x + 8} y={y - 10} width={feat.name.length * 6 + 10} height="15" rx="3" fill="#1e293b" opacity="0.85" />
                <text x={x + 13} y={y + 1} fontSize="8" fontWeight="bold" fill="#fff">{feat.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function OpportunityTree({
  outcome,
  opportunitiesStr,
}: {
  outcome: string;
  opportunitiesStr: string;
}) {
  let opportunities: Array<{ title: string; solutions: string[] }> = [];
  try {
    const normalized = opportunitiesStr.replace(/'/g, '"');
    opportunities = JSON.parse(normalized);
  } catch (e) {
    console.error("Error parsing opportunity tree:", e);
  }

  return (
    <div className="my-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
      <h4 className="text-sm font-bold text-slate-800 mb-3">Opportunity Solution Tree</h4>
      <div className="relative w-full max-w-xl mx-auto bg-slate-50/50 rounded-xl p-4 border border-slate-100">
        <svg viewBox="0 0 600 350" className="w-full h-auto">
          <rect x="200" y="10" width="200" height="40" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <text x="300" y="34" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">OUTCOME</text>
          <text x="300" y="44" fontSize="8" fill="#e2e8f0" textAnchor="middle">{outcome}</text>

          {opportunities.map((opp, idx) => {
            const oppWidth = 140;
            const oppGap = 30;
            const startX = 300;
            const startY = 50;
            const endY = 100;
            
            const totalWidth = opportunities.length * oppWidth + (opportunities.length - 1) * oppGap;
            const leftOffset = (600 - totalWidth) / 2;
            const x = leftOffset + idx * (oppWidth + oppGap) + oppWidth / 2;

            return (
              <g key={`line-opp-${idx}`}>
                <path d={`M ${startX} ${startY} C ${startX} ${startY + 25}, ${x} ${endY - 25}, ${x} ${endY}`} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
              </g>
            );
          })}

          {opportunities.map((opp, idx) => {
            const oppWidth = 140;
            const oppGap = 30;
            const totalWidth = opportunities.length * oppWidth + (opportunities.length - 1) * oppGap;
            const leftOffset = (600 - totalWidth) / 2;
            const x = leftOffset + idx * (oppWidth + oppGap);
            const y = 100;

            return (
              <g key={`opp-${idx}`}>
                <rect x={x} y={y} width={oppWidth} height="40" rx="6" fill="#f3e8ff" stroke="#c084fc" strokeWidth="1" />
                <text x={x + oppWidth / 2} y={y + 18} fontSize="9" fontWeight="bold" fill="#6b21a8" textAnchor="middle">OPPORTUNITY</text>
                <text x={x + oppWidth / 2} y={y + 30} fontSize="8" fontWeight="medium" fill="#701a75" textAnchor="middle">{opp.title}</text>

                {opp.solutions.map((sol, sIdx) => {
                  const solWidth = 100;
                  const solGap = 10;
                  const solTotalWidth = opp.solutions.length * solWidth + (opp.solutions.length - 1) * solGap;
                  const solLeftOffset = x + (oppWidth - solTotalWidth) / 2;
                  const sX = solLeftOffset + sIdx * (solWidth + solGap) + solWidth / 2;
                  const sY = 200;

                  return (
                    <path key={`line-sol-${sIdx}`} d={`M ${x + oppWidth / 2} ${y + 40} C ${x + oppWidth / 2} ${y + 60}, ${sX} ${sY - 20}, ${sX} ${sY}`} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                  );
                })}

                {opp.solutions.map((sol, sIdx) => {
                  const solWidth = 100;
                  const solGap = 10;
                  const solTotalWidth = opp.solutions.length * solWidth + (opp.solutions.length - 1) * solGap;
                  const solLeftOffset = x + (oppWidth - solTotalWidth) / 2;
                  const sX = solLeftOffset + sIdx * (solWidth + solGap);
                  const sY = 200;

                  return (
                    <g key={`sol-${sIdx}`}>
                      <rect x={sX} y={sY} width={solWidth} height="45" rx="6" fill="#ecfdf5" stroke="#34d399" strokeWidth="1" />
                      <text x={sX + solWidth / 2} y={sY + 16} fontSize="9" fontWeight="bold" fill="#065f46" textAnchor="middle">SOLUTION</text>
                      <text x={sX + solWidth / 2} y={sY + 28} fontSize="7.5" fill="#047857" textAnchor="middle">{sol}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function renderMessageContent(text: string): React.ReactNode {
  const segments = parseMessageSegments(text);
  if (segments.length === 0) return null;
  
  return (
    <div className="space-y-3">
      {segments.map((seg, idx) => {
        if (seg.type === "text") {
          return <div key={idx}>{renderMarkdown(seg.content)}</div>;
        }
        
        const attrRegex = /<(\w+)\s+([\s\S]*?)\s*\/>/gi;
        const match = attrRegex.exec(seg.content);
        attrRegex.lastIndex = 0;
        
        if (!match) return <div key={idx} className="text-red-500">Broken tag: {seg.content}</div>;
        
        const attrs = parseAttributes(match[2]);
        
        if (seg.type === "kano") {
          return (
            <KanoModelChart
              key={idx}
              title={attrs.title || "Kano Model"}
              basic={attrs.basic || ""}
              performance={attrs.performance || ""}
              excitement={attrs.excitement || ""}
            />
          );
        } else if (seg.type === "matrix") {
          return (
            <PrioritizationMatrix
              key={idx}
              title={attrs.title || "Prioritization Matrix"}
              featuresStr={attrs.features || "[]"}
            />
          );
        } else if (seg.type === "tree") {
          return (
            <OpportunityTree
              key={idx}
              outcome={attrs.outcome || ""}
              opportunitiesStr={attrs.opportunities || "[]"}
            />
          );
        }
        
        return null;
      })}
    </div>
  );
}

function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        let cleanLine = line.trim();

        // 1. Headings (###### down to #)
        if (cleanLine.startsWith("###### ")) {
          return (
            <h6 key={idx} className="text-[11.5px] font-semibold text-slate-700 mt-2 mb-0.5 tracking-tight">
              {renderInlineMarkdown(cleanLine.substring(7))}
            </h6>
          );
        }
        if (cleanLine.startsWith("##### ")) {
          return (
            <h5 key={idx} className="text-[12.5px] font-bold text-slate-800 mt-2.5 mb-1 tracking-tight">
              {renderInlineMarkdown(cleanLine.substring(6))}
            </h5>
          );
        }
        if (cleanLine.startsWith("#### ")) {
          return (
            <h4 key={idx} className="text-[13.5px] font-bold text-slate-900 mt-3 mb-1 tracking-tight">
              {renderInlineMarkdown(cleanLine.substring(5))}
            </h4>
          );
        }
        if (cleanLine.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-[14.5px] font-bold text-slate-900 mt-3.5 mb-1.5 tracking-tight">
              {renderInlineMarkdown(cleanLine.substring(4))}
            </h3>
          );
        }
        if (cleanLine.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-[15.5px] font-bold text-slate-950 mt-4 mb-1.8 tracking-tight">
              {renderInlineMarkdown(cleanLine.substring(3))}
            </h2>
          );
        }
        if (cleanLine.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-[17px] font-extrabold text-slate-950 mt-4.5 mb-2.5 tracking-tight">
              {renderInlineMarkdown(cleanLine.substring(2))}
            </h1>
          );
        }

        // 2. Unordered lists (- or *)
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          const listContent = line.trim().substring(2);
          const indentClass = line.startsWith("  ") ? "pl-6" : "pl-3";
          return (
            <div key={idx} className={cn("flex items-start gap-1.5 text-[13px]", indentClass)}>
              <span className="text-slate-400 mt-1 select-none font-semibold">•</span>
              <span className="flex-1">{renderInlineMarkdown(listContent)}</span>
            </div>
          );
        }

        // 3. Ordered lists (e.g. 1. or 2.)
        const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const num = numMatch[1];
          const content = numMatch[2];
          const indentClass = line.startsWith("  ") ? "pl-6" : "pl-3";
          return (
            <div key={idx} className={cn("flex items-start gap-1.5 text-[13px]", indentClass)}>
              <span className="text-slate-500 font-bold mt-0.5 min-w-[14px] select-none text-[11px]">{num}.</span>
              <span className="flex-1">{renderInlineMarkdown(content)}</span>
            </div>
          );
        }

        // 4. Empty line (represented as spacer)
        if (cleanLine === "") {
          return <div key={idx} className="h-1" />;
        }

        // 5. Default Paragraph
        return (
          <p key={idx} className="text-[13px] leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

function getCleanActivity(step: string): string {
  if (!step) return "General Chat";
  const lower = step.toLowerCase();
  if (lower === "discovery" || lower === "research") return "Product Research";
  if (lower === "define" || lower === "prd") return "Spec Drafting";
  if (lower === "design") return "User Flows";
  if (lower === "develop") return "Code Setup";
  if (lower === "deliver") return "Release Prep";
  if (lower === "debrief") return "Post-Launch Audit";
  return "General Chat";
}

function generateCleanTitle(input: string): string {
  const clean = input.trim();
  if (!clean) return "Untitled Chat";

  // Handle identity, greeting and help queries
  const cleanLower = clean.toLowerCase();
  if (
    cleanLower.includes("who are you") ||
    cleanLower.includes("who is mycroft") ||
    cleanLower.includes("your name") ||
    cleanLower.includes("what is your name") ||
    cleanLower === "hi" ||
    cleanLower === "hello" ||
    cleanLower === "hey" ||
    cleanLower.includes("help")
  ) {
    return "About Mycroft";
  }

  // Clean trailing punctuation and spaces
  let title = clean.replace(/[?\s!.,]+$/g, "");

  // Capitalize nicely
  const ABBREVIATIONS = ["ai", "upi", "prd", "rice", "ice", "moscow", "jtbd", "okr", "okrs", "mvp"];
  const words = title.split(/\s+/);
  title = words.map(word => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (ABBREVIATIONS.includes(cleanWord)) {
      return word.toUpperCase();
    }
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(" ");

  // Intelligently truncate to ~40 chars preserving whole words
  if (title.length > 40) {
    const subset = title.substring(0, 40);
    const lastSpace = subset.lastIndexOf(" ");
    if (lastSpace > 20) {
      title = subset.substring(0, lastSpace) + "...";
    } else {
      title = subset + "...";
    }
  }

  return title;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string; // base64 resized data for images
  textContent?: string; // parsed text for documents
}

interface Message {
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  attachments?: Attachment[];
  workspaceCard?: {
    type: "Discovery" | "PRD" | "Dashboard";
    title: string;
    description: string;
    targetUrl: string;
  };
  action?: { label: string; stage: string };
  isError?: boolean;
}

const isErrorMessage = (msg: Message): boolean => {
  if (msg.isError) return true;
  if (msg.sender !== "ai") return false;
  const text = msg.text.toLowerCase();
  return (
    text.includes("network error") ||
    text.includes("trouble connecting") ||
    text.includes("encountered an issue generating") ||
    text.includes("groq api error") ||
    text.includes("groq api returned") ||
    text.includes("decommissioned") ||
    text.includes("reasoning engine")
  );
};


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
  reasoningPhase?: "Understand" | "Research" | "Reason" | "Prioritize" | "Recommend" | "Document";
  retrievedModels?: string[];
  isPinned?: boolean;
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
  text: "Welcome back, Akshay. I'm Mycroft, your AI Product Manager. I'm here to help you research, analyze, challenge ideas, and build exceptional products together. Describe your product idea below, and we can get started!",
  timestamp: "Just now"
});

const makeDefaultConv = (): Conversation => ({
  id: `conv_${Date.now()}`,
  title: "New Chat",
  activeStep: "Discovery",
  messages: [],
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
  prdSections: defaultPRDSections(),
  reasoningPhase: "Understand",
  retrievedModels: ["philosophy", "thinking"]
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
        text: "Hi Akshay! I'm Mycroft, your AI Product Manager. I'm here to help you research, analyze, challenge ideas, and build exceptional products together.\n\nFirst decision: Is this an existing product or a completely new startup concept?",
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
        text: "Hi Akshay! I'm Mycroft, your AI Product Manager. I'm here to help you research, analyze, challenge ideas, and build exceptional products together.\n\n**Step 1: Understand the Objective**\nWhat is the core business objective or vision for this Student Fintech product? What is the main problem we want to solve first?",
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
  const [convSidebarCollapsed, setConvSidebarCollapsed] = useState(true);
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);

  // Conversation management states
  const [editingConvId, setEditingConvId] = useState<string>("");
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [activeMenuConvId, setActiveMenuConvId] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const activeTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize active composer textarea dynamically
  useEffect(() => {
    const textarea = activeTextareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 160);
    textarea.style.height = `${nextHeight}px`;
  }, [chatInput]);

  // Greeting based on time
  const [greeting, setGreeting] = useState("Good morning");

  // Search Query for Conversation history (Claude-like search)
  const [searchOpen, setSearchOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");

  // Bootstrap state
  useEffect(() => {
    const savedConvs = localStorage.getItem("mycroft_home_conversations");

    let loadedConvs: Conversation[] = [];
    if (savedConvs) {
      try {
        const parsed = JSON.parse(savedConvs);
        if (Array.isArray(parsed)) {
          loadedConvs = parsed.filter((c: Conversation) => c.messages && c.messages.length > 0);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (loadedConvs.length === 0) {
      loadedConvs = makeSeededConversations();
      localStorage.setItem("mycroft_home_conversations", JSON.stringify(loadedConvs));
    }

    setConversations(loadedConvs);

    // Always start on clean landing page (New Chat) on load/refresh
    setActiveConvId("");
    setShowChatView(false);

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

  // Listen to external/sidebar mycroft_sync event
  useEffect(() => {
    const handleSync = () => {
      const savedConvs = localStorage.getItem("mycroft_home_conversations");
      const savedActiveId = localStorage.getItem("mycroft_home_active_conv_id");
      if (savedConvs) {
        try {
          const parsed = JSON.parse(savedConvs);
          if (Array.isArray(parsed)) {
            setConversations(prev => {
              if (JSON.stringify(prev) === savedConvs) return prev;
              return parsed;
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (savedActiveId !== undefined) {
        setActiveConvId(prev => {
          const next = savedActiveId || "";
          if (prev === next) return prev;
          return next;
        });
        if (savedActiveId) {
          setShowChatView(true);
        } else {
          setShowChatView(false);
        }
      }
    };
    window.addEventListener("mycroft_sync", handleSync);
    return () => window.removeEventListener("mycroft_sync", handleSync);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    const cleanConvs = conversations.filter(c => c.messages && c.messages.length > 0);
    localStorage.setItem("mycroft_home_conversations", JSON.stringify(cleanConvs));
    localStorage.setItem("mycroft_home_active_conv_id", activeConvId);
    
    // Notify sidebar and rest of app
    window.dispatchEvent(new Event("mycroft_sync"));

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
          targetUsers: active.activeStep === "Discovery" ? "Students in Bangalore campuses" : active.prdSections.targetUsers.content,
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
    setConvSidebarCollapsed(!convSidebarCollapsed);
  };

  // Start new clean conversation (landing view, does not create an object in list)
  const handleNewChat = useCallback(() => {
    setActiveConvId("");
    setShowChatView(false);
    setChatInput("");
    setAttachedFiles([]);
  }, []);

  const handleDeleteChat = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this conversation?")) return;
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (activeConvId === id) {
      setActiveConvId("");
      setShowChatView(false);
    }
    setActiveMenuConvId("");
  }, [conversations, activeConvId]);

  // Start renaming a conversation
  const startRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(id);
    setEditingTitle(currentTitle);
    setActiveMenuConvId("");
  };

  // Save renamed conversation
  const handleSaveRename = (id: string) => {
    if (!editingTitle.trim()) return;
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, title: editingTitle.trim() } : c
    ));
    setEditingConvId("");
    setEditingTitle("");
  };

  // Cancel renaming
  const handleCancelRename = () => {
    setEditingConvId("");
    setEditingTitle("");
  };

  // Pin / Unpin conversation
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, isPinned: !c.isPinned } : c
    ));
    setActiveMenuConvId("");
  };

  const handleAction = useCallback((action: { label: string; stage: string }) => {
    if (!activeConv) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          activeStep: action.stage,
          messages: [...c.messages, {
            sender: "ai" as const,
            text: `Activity transitioned to: **${action.stage}**. Relevant workspace cards have been generated inline.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }]
        };
      }
      return c;
    }));
  }, [activeConv, activeConvId]);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const input = textToSend || chatInput;
    if (!input.trim() && attachedFiles.length === 0) return;

    // Transition to chat view
    setShowChatView(true);

    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachments: attachedFiles.length > 0 ? attachedFiles : undefined
    };

    let currentConvId = activeConvId;
    let targetConv = activeConv;

    if (!targetConv) {
      // Create fresh conversation object lazily on first user prompt
      const generatedId = `conv_${Date.now()}`;
      const newTitle = generateCleanTitle(input || (attachedFiles.length > 0 ? attachedFiles[0].name : "Attached File"));
      targetConv = {
        ...makeDefaultConv(),
        id: generatedId,
        title: newTitle,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      currentConvId = generatedId;
    }

    const updatedTitle = targetConv.title === "New Chat" || targetConv.title === "" ? generateCleanTitle(input || (attachedFiles.length > 0 ? attachedFiles[0].name : "Attached File")) : targetConv.title;
    const retrieved = retrieveRelevantKnowledge(input);
    const previousMessages = targetConv.messages;

    setConversations(prev => {
      const exists = prev.some(c => c.id === currentConvId);
      if (exists) {
        return prev.map(c =>
          c.id === currentConvId ? {
            ...c,
            title: updatedTitle,
            messages: [...c.messages, userMsg],
            retrievedModels: retrieved
          } : c
        );
      } else {
        return [
          {
            ...targetConv!,
            title: updatedTitle,
            messages: [userMsg],
            retrievedModels: retrieved
          },
          ...prev
        ];
      }
    });

    setActiveConvId(currentConvId);

    const currentMsgAttachments = [...attachedFiles];

    if (!textToSend) setChatInput("");
    setAttachedFiles([]);
    setIsGenerating(true);

    // Filter out failed message exchanges (user query + its failed AI response)
    const validMessages: Message[] = [];
    for (let i = 0; i < previousMessages.length; i++) {
      const msg = previousMessages[i];
      if (isErrorMessage(msg)) {
        // Discard the failed AI response, and also discard the preceding user prompt if there is one
        if (validMessages.length > 0 && validMessages[validMessages.length - 1].sender === "user") {
          validMessages.pop();
        }
      } else {
        validMessages.push(msg);
      }
    }

    // Build conversation history for Groq (last 10 messages for context window)
    const historyForApi = validMessages.slice(-10).map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
      attachments: m.attachments
    }));
    historyForApi.push({
      role: "user",
      content: input,
      attachments: currentMsgAttachments.length > 0 ? currentMsgAttachments : undefined
    });

    let aiText = "";
    let targetStage = targetConv.activeStep;
    let nextAction: Message["action"] = undefined;
    let card: Message["workspaceCard"] = undefined;
    let hasError = false;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi })
      });

      if (res.ok) {
        const data = await res.json();
        aiText = data.reply || "I encountered an issue generating a response. Please try again.";
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Chat API error:", res.status, errData);
        aiText = errData.error || "I'm having trouble connecting to my reasoning engine right now. Please try again in a moment.";
        hasError = true;
      }
    } catch (err) {
      console.error("Failed to call /api/chat:", err);
      aiText = "Network error — I could not reach my reasoning engine. Please check your connection and try again.";
      hasError = true;
    }

    const aiMsg: Message = {
      sender: "ai",
      text: aiText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      workspaceCard: card,
      action: nextAction,
      isError: hasError
    };

    setConversations(prev => prev.map(c => {
      if (c.id !== currentConvId) return c;
      return {
        ...c,
        activeStep: targetStage,
        messages: [...c.messages, aiMsg]
      };
    }));

    setIsGenerating(false);
  }, [chatInput, activeConv, activeConvId]);

  // Esc key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !convSidebarCollapsed) {
        setConvSidebarCollapsed(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [convSidebarCollapsed]);

  // Handle Attachment trigger
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // State for drag and drop visual overlay
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File): Promise<Attachment> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        reader.onerror = (err) => {
          console.error("FileReader error for file:", file.name, err);
          reject(new Error(`Failed to read file "${file.name}": ${reader.error?.message || "unknown error"}`));
        };

        if (file.type.startsWith("image/")) {
          reader.onload = (event) => {
            try {
              const img = new window.Image();
              img.onload = () => {
                try {
                  const canvas = document.createElement("canvas");
                  const maxDim = 1024;
                  let width = img.width;
                  let height = img.height;
                  if (width > height) {
                    if (width > maxDim) {
                      height = Math.round((height * maxDim) / width);
                      width = maxDim;
                    }
                  } else {
                    if (height > maxDim) {
                      width = Math.round((width * maxDim) / height);
                      height = maxDim;
                    }
                  }
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                    resolve({
                      id: fileId,
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      dataUrl,
                    });
                  } else {
                    resolve({
                      id: fileId,
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      dataUrl: event.target?.result as string,
                    });
                  }
                } catch (canvasErr) {
                  console.warn("Canvas resizing failed, using raw data url:", canvasErr);
                  resolve({
                    id: fileId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    dataUrl: event.target?.result as string,
                  });
                }
              };
              img.onerror = (imgErr) => {
                console.error("Image load error for file:", file.name, imgErr);
                reject(new Error(`Failed to parse image "${file.name}". The file might be corrupted or in an unsupported format.`));
              };
              img.src = event.target?.result as string;
            } catch (imgSetupErr) {
              console.error("Image element setup failed:", imgSetupErr);
              reject(new Error(`Failed to process image "${file.name}": ${imgSetupErr instanceof Error ? imgSetupErr.message : "unknown error"}`));
            }
          };
          reader.readAsDataURL(file);
        } else if (
          file.type.startsWith("text/") ||
          file.name.endsWith(".json") ||
          file.name.endsWith(".js") ||
          file.name.endsWith(".ts") ||
          file.name.endsWith(".csv") ||
          file.name.endsWith(".md")
        ) {
          reader.onload = (event) => {
            resolve({
              id: fileId,
              name: file.name,
              type: file.type,
              size: file.size,
              textContent: event.target?.result as string,
            });
          };
          reader.readAsText(file);
        } else {
          reader.onload = (event) => {
            resolve({
              id: fileId,
              name: file.name,
              type: file.type,
              size: file.size,
              dataUrl: event.target?.result as string,
            });
          };
          reader.readAsDataURL(file);
        }
      } catch (err) {
        console.error("File processing error:", err);
        reject(new Error(`File processing error for "${file.name}": ${err instanceof Error ? err.message : "unknown error"}`));
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const filesArray = Array.from(e.target.files);
        const processed = await Promise.all(filesArray.map(processFile));
        setAttachedFiles((prev) => [...prev, ...processed]);
      } catch (err) {
        console.error("Error attaching files:", err);
        alert(err instanceof Error ? err.message : "Failed to read one or more files.");
      } finally {
        e.target.value = ""; // Reset the input value so the same file can be re-selected
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const files = items
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (files.length > 0) {
      e.preventDefault();
      try {
        const processed = await Promise.all(files.map(processFile));
        setAttachedFiles((prev) => [...prev, ...processed]);
      } catch (err) {
        console.error("Error pasting files:", err);
        alert(err instanceof Error ? err.message : "Failed to read one or more pasted files.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      try {
        const filesArray = Array.from(e.dataTransfer.files);
        const processed = await Promise.all(filesArray.map(processFile));
        setAttachedFiles((prev) => [...prev, ...processed]);
      } catch (err) {
        console.error("Error dropping files:", err);
        alert(err instanceof Error ? err.message : "Failed to read one or more dropped files.");
      }
    }
  };

  const renderAttachmentPreviews = () => {
    if (attachedFiles.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-2 pointer-events-auto">
        {attachedFiles.map((file) => {
          const isImg = file.type.startsWith("image/");
          return (
            <div 
              key={file.id} 
              className={cn(
                "relative border rounded-xl overflow-hidden shadow-2xs group flex items-center bg-slate-50 border-slate-200 transition-all hover:border-slate-350 shrink-0",
                isImg ? "w-24 h-16" : "px-3 py-1.5 w-[200px]"
              )}
            >
              {isImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={file.dataUrl} 
                  alt={file.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-700 w-full min-w-0">
                  <div className="size-6 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <FileText className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">{file.name}</p>
                    <p className="text-[8px] text-slate-400 font-semibold leading-tight mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setAttachedFiles(prev => prev.filter(f => f.id !== file.id))}
                className="absolute top-0.5 right-0.5 size-4 rounded-full bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 shadow-sm"
                title="Remove file"
              >
                <X className="size-2.5" />
              </button>
            </div>
          );
        })}
      </div>
    );
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
        multiple
      />

      {/* Backdrop overlay (clicking outside closes history drawer) */}
      {!convSidebarCollapsed && (
        <div 
          onClick={() => setConvSidebarCollapsed(true)} 
          className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* ── Collapsible Conversation History Drawer (Slide-out Overlay) ── */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-[280px] bg-white border-r border-slate-100 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out",
        convSidebarCollapsed ? "-translate-x-full" : "translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-white">
          <span className="text-sm font-semibold text-slate-800 tracking-tight">Recents</span>
          <button
            onClick={toggleConvSidebar}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Collapse Panel"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>

        {/* Sidebar List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {(() => {
            const validConvs = conversations.filter(c => c.messages && c.messages.length > 0);
            const pinnedConvs = validConvs
              .filter(c => c.isPinned)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            const regularConvs = validConvs
              .filter(c => !c.isPinned)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const renderChatItem = (c: Conversation) => {
              const isActive = c.id === activeConvId;
              const isEditing = editingConvId === c.id;

              if (isEditing) {
                return (
                  <div
                    key={c.id}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50/20"
                  >
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(c.id);
                        if (e.key === "Escape") handleCancelRename();
                      }}
                      className="flex-1 bg-transparent text-[13px] text-slate-900 focus:outline-none py-0.5"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(c.id)}
                      className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Save rename"
                    >
                      <Check className="size-3.5" />
                    </button>
                    <button
                      onClick={handleCancelRename}
                      className="p-1 rounded-md text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Cancel rename"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                );
              }

              const isMenuOpen = activeMenuConvId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConvId(c.id);
                    setShowChatView(true);
                    setConvSidebarCollapsed(true);
                  }}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all relative border border-transparent",
                    isActive
                      ? "bg-violet-50/70 border-violet-100 text-slate-900 font-semibold"
                      : "hover:bg-slate-50 text-slate-650 hover:text-slate-955"
                  )}
                >
                  <span className="text-[13px] truncate flex-1 leading-snug">
                    {c.title}
                  </span>

                  {/* Three dots menu container */}
                  <div className="relative shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveMenuConvId(isMenuOpen ? "" : c.id)}
                      className="text-slate-400 hover:text-slate-700 transition-all p-1 ml-1 rounded-md hover:bg-slate-100/80 shrink-0"
                      title="Conversation actions"
                    >
                      <MoreVertical className="size-3.5" />
                    </button>

                    {isMenuOpen && (
                      <>
                        {/* Invisible overlay to close menu */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setActiveMenuConvId("")}
                        />
                        {/* Dropdown Card */}
                        <div className="absolute right-0 top-6 z-50 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1 text-left">
                          <button
                            onClick={(e) => startRename(c.id, c.title, e)}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit className="size-3 text-slate-400" />
                            Rename
                          </button>
                          <button
                            onClick={(e) => handleTogglePin(c.id, e)}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Pin className="size-3 text-slate-400" />
                            {c.isPinned ? "Unpin" : "Pin"}
                          </button>
                          <hr className="border-slate-50 my-1" />
                          <button
                            onClick={(e) => handleDeleteChat(c.id, e)}
                            className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50/50 flex items-center gap-2"
                          >
                            <Trash2 className="size-3 text-rose-500" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            };

            return (
              <>
                {/* Pinned Section */}
                {pinnedConvs.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                      <Pin className="size-3 text-slate-400 rotate-45" />
                      <span>Pinned</span>
                    </div>
                    <div className="space-y-0.5">
                      {pinnedConvs.map(renderChatItem)}
                    </div>
                  </div>
                )}

                {/* Recent Section */}
                <div className="space-y-1">
                  {pinnedConvs.length > 0 && regularConvs.length > 0 && (
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                      <span>Recent</span>
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {regularConvs.map(renderChatItem)}
                  </div>
                </div>

                {validConvs.length === 0 && (
                  <div className="text-center py-8 text-[12px] text-slate-400 italic">
                    No conversations yet.
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* ── Column 2: Main Workspace Canvas ── */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">

        {/* ── Top Navigation Bar ── */}
        <header className="shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-white z-20">
          
          {/* Left Controls: Minimal layout displaying only back button when active */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleConvSidebar}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center border border-slate-200/40"
              title="Toggle Chat History"
              aria-label="Toggle chat history"
            >
              <HistoryIcon className="size-4.5" />
            </button>
            {showChatView && (
              <button
                onClick={() => setShowChatView(false)}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-955 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-200/40"
              >
                ← Back to Home
              </button>
            )}
          </div>
          
          {/* Middle: Reasoning Phase Indicator */}
          {activeConv && showChatView && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Phase:</span>
              <span className="px-2.5 py-1 rounded-full bg-violet-600 text-white text-[10.5px] font-bold shadow-2xs flex items-center gap-1.5">
                <Activity className="size-3.5" />
                {activeConv.reasoningPhase || "Understand"}
              </span>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* New Chat Button */}
            <Button
              onClick={handleNewChat}
              variant="secondary"
              className="h-8 px-3 rounded-lg border-violet-200 text-violet-600 hover:bg-violet-50/50 text-[12px] font-semibold flex items-center transition-all shadow-2xs shrink-0"
            >
              New Chat
            </Button>

            {/* Search Interface */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 w-[220px]">
                  <Search className="size-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-xs focus:ring-0 focus:outline-none"
                    autoFocus
                    onBlur={() => {
                      setTimeout(() => setSearchOpen(false), 250);
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-center"
                  aria-label="Search conversations"
                >
                  <Search className="size-4.5" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {searchOpen && historySearchQuery.trim() !== "" && (
                <div className="absolute right-0 mt-1.5 w-[280px] max-h-[260px] overflow-y-auto bg-white border border-slate-150 rounded-xl shadow-lg z-50 p-1.5 space-y-1">
                  {(() => {
                    const query = historySearchQuery.toLowerCase();
                    const results = conversations.filter(c => {
                      const matchesTitle = c.title.toLowerCase().includes(query);
                      const matchesContent = c.messages.some(m => m.text.toLowerCase().includes(query));
                      return matchesTitle || matchesContent;
                    });

                    if (results.length > 0) {
                      return results.map(c => {
                        const matchingMsg = c.messages.find(m => 
                          m.text.toLowerCase().includes(query)
                        );
                        const snippet = matchingMsg ? matchingMsg.text : "";
                        return (
                          <button
                            key={c.id}
                            onMouseDown={() => {
                              setActiveConvId(c.id);
                              setShowChatView(true);
                              setHistorySearchQuery("");
                              setSearchOpen(false);
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors flex flex-col gap-0.5"
                          >
                            <span className="text-[12px] font-semibold text-slate-800 truncate">
                              {c.title}
                            </span>
                            {snippet && (
                              <span className="text-[10px] text-slate-400 truncate leading-tight text-left">
                                {snippet.replace(/[#*`]/g, "")}
                              </span>
                            )}
                          </button>
                        );
                      });
                    } else {
                      return (
                        <div className="text-center py-4 text-[11px] text-slate-400">
                          No matching conversations
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── View Container ── */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">

          {/* ==================== VIEW 1: WIREFRAME LANDING SCREEN ==================== */}
          {!showChatView ? (
            <div className="flex-1 flex flex-col justify-center items-center max-w-3xl mx-auto w-full px-6 py-12 space-y-8 pb-20">
              
              {/* Header Titles */}
              <div className="space-y-2 text-center w-full">
                <p className="text-[13px] font-semibold text-slate-500">{greeting}, Akshay! 👋</p>
                <h2 className="text-[36px] font-bold text-slate-900 tracking-tight leading-tight">What are we building today?</h2>
                <p className="text-[13.5px] text-slate-500 font-medium">I&apos;m here to help you research, analyze, challenge ideas, and build exceptional products together.</p>
              </div>

              {/* Large Prompt Input Box */}
              <div 
                className="border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100/50 bg-white w-full relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Drag and drop overlay */}
                {isDragging && (
                  <div className="absolute inset-0 bg-violet-600/10 backdrop-blur-xs border-2 border-dashed border-violet-500 rounded-2xl flex flex-col items-center justify-center z-50 pointer-events-none transition-all">
                    <Paperclip className="size-8 text-violet-600 animate-bounce mb-2" />
                    <p className="text-xs font-bold text-violet-700">Drop files here to attach</p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {/* Attached Files previews */}
                  {renderAttachmentPreviews()}

                  {/* Textarea */}
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onPaste={handlePaste}
                    placeholder="Describe your product idea or improvement goal..."
                    rows={5}
                    className="w-full text-[14px] text-slate-800 placeholder:text-slate-400 resize-none bg-transparent focus:outline-none leading-relaxed"
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  />
                  
                  {/* Toolbar */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-1">
                    <div className="flex items-center gap-1.5">
                      {/* Attach button */}
                      <button
                        onClick={handleAttachmentClick}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all duration-150"
                        title="Attach files (Drag & Drop or Paste)"
                      >
                        <Paperclip className="size-4.5" />
                      </button>
                      {/* Voice button */}
                      <button
                        onClick={() => alert("Voice transcription feature is coming soon!")}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all duration-150"
                        title="Voice Command"
                      >
                        <Mic className="size-4.5" />
                      </button>
                    </div>

                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!chatInput.trim() && attachedFiles.length === 0}
                      className="h-9 px-4 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-40"
                    >
                      <Send className="size-3.5" />
                      <span>Send</span>
                    </Button>
                  </div>
                </div>
              </div>



            </div>
          ) : (
            /* ==================== VIEW 2: ACTIVE CONVERSATION / CHAT INTERFACE ==================== */
            <div className="flex-1 w-full max-w-4xl mx-auto px-6 pt-6 pb-[280px]">
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
                            {/* Message attachments rendering */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className={cn("flex flex-wrap gap-2 pointer-events-auto", !isAi && "justify-end")}>
                                {msg.attachments.map((file) => {
                                  const isImg = file.type.startsWith("image/");
                                  return (
                                    <div 
                                      key={file.id} 
                                      className={cn(
                                        "relative border rounded-xl overflow-hidden shadow-2xs flex items-center bg-slate-50 shrink-0",
                                        isImg ? "p-0 border-slate-100" : "p-2 border-slate-200 bg-white"
                                      )}
                                    >
                                      {isImg ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img 
                                          src={file.dataUrl} 
                                          alt={file.name} 
                                          className="h-28 w-auto object-cover max-w-full"
                                        />
                                      ) : (
                                        <div className="flex items-center gap-2 text-slate-700 w-full min-w-0">
                                          <FileText className="size-5 text-slate-500 shrink-0" />
                                          <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-semibold truncate leading-tight text-slate-800">{file.name}</p>
                                            <p className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Message bubble */}
                            <div
                              className={cn(
                                "px-4 py-3 rounded-2xl text-[13px] leading-relaxed",
                                isAi
                                  ? isErrorMessage(msg)
                                    ? "bg-red-50 text-red-700 border border-red-200 rounded-tl-[4px]"
                                    : "bg-slate-50 text-slate-800 rounded-tl-[4px] border border-slate-100"
                                  : "bg-violet-600 text-white rounded-tr-[4px]"
                              )}
                            >
                              {isAi && isErrorMessage(msg) && (
                                <span className="inline-flex items-center gap-1.5 font-semibold text-red-800 mr-1.5">
                                  ⚠️ Error:
                                </span>
                              )}
                              {renderMessageContent(msg.text)}
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
          <div 
            className={cn("absolute left-0 right-0 flex justify-center px-6 pointer-events-none z-10", disclaimerVisible ? "bottom-16" : "bottom-8")}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-3.5 pointer-events-auto transition-all relative">
              
              {/* Drag and drop overlay */}
              {isDragging && (
                <div className="absolute inset-0 bg-violet-600/10 backdrop-blur-xs border-2 border-dashed border-violet-500 rounded-2xl flex flex-col items-center justify-center z-50 pointer-events-none transition-all">
                  <Paperclip className="size-8 text-violet-600 animate-bounce mb-2" />
                  <p className="text-xs font-bold text-violet-700">Drop files here to attach</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {/* Uploaded Files previews */}
                {renderAttachmentPreviews()}

                {/* Textarea */}
                <textarea
                  ref={activeTextareaRef}
                  rows={2}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onPaste={handlePaste}
                  placeholder={
                    activeConv?.reasoningPhase === "Understand" ? "Understand Phase: Describe your objective & target users..." :
                    activeConv?.reasoningPhase === "Research" ? "Research Phase: Analyze user feedback and competitor gaps..." :
                    activeConv?.reasoningPhase === "Reason" ? "Reason Phase: Frame your Job-to-be-Done and trade-offs..." :
                    activeConv?.reasoningPhase === "Prioritize" ? "Prioritization Phase: Map Kano categories & RICE scoring..." :
                    activeConv?.reasoningPhase === "Recommend" ? "Recommend Phase: Define North Star metrics & MVP scope..." :
                    "Document Phase: Review compiled PRD and next steps..."
                  }
                  className="w-full px-4 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-slate-50/60 placeholder:text-slate-400 leading-relaxed transition-shadow resize-none max-h-[160px] overflow-y-auto"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isGenerating || !activeConv}
                />
                
                {/* Toolbar */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-1">
                  <div className="flex items-center gap-1.5">
                    {/* Attach button */}
                    <button
                      onClick={handleAttachmentClick}
                      className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all duration-150 shrink-0"
                      title="Attach files (Drag & Drop or Paste)"
                    >
                      <Paperclip className="size-4.5" />
                    </button>
                    {/* Voice button */}
                    <button
                      onClick={() => alert("Voice transcription feature is coming soon!")}
                      className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all duration-150 shrink-0"
                      title="Voice Command"
                    >
                      <Mic className="size-4.5" />
                    </button>
                  </div>

                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isGenerating || (!chatInput.trim() && attachedFiles.length === 0) || !activeConv}
                    className="h-9 px-4 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-40"
                  >
                    <Send className="size-3.5" />
                    <span>Send</span>
                  </Button>
                </div>
              </div>
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
