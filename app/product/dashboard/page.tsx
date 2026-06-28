"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  FileText,
  Search,
  Calendar,
  Send
} from "lucide-react";

// Mock metrics
const metadataStats = [
  { label: "Product Workspace", val: "Mycroft PM" },
  { label: "Quarter Objective", val: "+20% Active Adoption" },
  { label: "Sprint Scope", val: "Sprint 12 (May 28 - Jun 10)" },
  { label: "Development Phase", val: "Alpha Stage" }
];

const todayFocus = [
  { title: "Review Checkout Flow PRD compliance anomalies", count: 2, tone: "critical" },
  { title: "Features awaiting active prioritization score", count: 3, tone: "warning" },
  { title: "User research logs requiring regulatory validation", count: 4, tone: "info" }
];

const recentWork = [
  { title: "Checkout flow payment mapping", type: "PRD Spec", date: "2 hours ago", link: "/product/prds" },
  { title: "Onboarding drop-off opportunity discovery", type: "Discovery", date: "Yesterday", link: "/product/discovery" },
  { title: "UPI Auto-pay compliance parameters", type: "Research Spec", date: "3 days ago", link: "/product/prds" },
  { title: "Q3 Core Payments Roadmap", type: "Roadmap Scope", date: "4 days ago", link: "/product/dashboard" }
];

const pendingDecisions = [
  { title: "Feature X global launch date confirmation", owner: "Alex Chen", due: "July 5, 2026", status: "Blocked" },
  { title: "FinTech subscription tier pricing structure", owner: "Meera Nair", due: "July 8, 2026", status: "Pending" }
];

const upcomingMilestones = [
  { title: "Phase 2 Sandbox Launch (MAS Compliance)", date: "July 15, 2026" },
  { title: "Merchant Beta Group Signups", date: "August 1, 2026" }
];

const aiRecommendations = [
  "Checkout PRD requires DPDP Act data auditing before merchant staging.",
  "Consider merging P2P onboarding feedback from Discovery with your Product Roadmap.",
  "Analyse compliance logs for India (RBI Guidelines) to clear blocked launch dates."
];

const aiRisks = [
  "Staging latency on international SMS gateways might slip launch by 3 days.",
  "Missing PCI-DSS compliance tags on payment-token APIs."
];

export default function DashboardPage() {
  const [askInput, setAskInput] = useState("");
  const [askHistory, setAskHistory] = useState<string[]>([]);

  const handleAsk = () => {
    if (!askInput.trim()) return;
    setAskHistory([askInput, ...askHistory]);
    setAskInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans antialiased text-slate-800 p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Workspace Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">PM daily operating desk • Context and metrics summary</p>
          </div>
          <StatusBadge tone="healthy">Active Sprint</StatusBadge>
        </div>
        
        {/* Flat metadata items */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-50">
          {metadataStats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
              <span className="text-sm font-semibold text-slate-700 mt-1">{stat.val}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Grid columns - 75% Left (Workspace) / 25% Right (AI Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-start">
        
        {/* Left Column: Workspace (9 cols / 75%) */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Today's Priorities */}
          <section>
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider text-slate-400 mb-4">Today's Priorities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todayFocus.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[105px]"
                >
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">{item.title}</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-medium">Pending items</span>
                    <StatusBadge tone={item.tone as any}>{item.count}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Product Workspace Logs & Pending Decisions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Product Workspace Logs */}
            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-950 uppercase tracking-wider text-slate-400 mb-4">Recent Workspace Activity</h2>
              <div className="space-y-3.5">
                {recentWork.map((work, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => window.location.assign(work.link)}
                    className="flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 p-2 -mx-2 rounded-lg transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{work.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">{work.type} • {work.date}</span>
                    </div>
                    <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                ))}
              </div>
            </section>

            {/* Pending Decisions */}
            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-950 uppercase tracking-wider text-slate-400 mb-4">Pending Decisions</h2>
              <div className="space-y-4">
                {pendingDecisions.map((dec, idx) => (
                  <div key={idx} className="pb-3 last:pb-0 border-b last:border-0 border-slate-50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">{dec.title}</span>
                      <StatusBadge tone={dec.status === "Blocked" ? "critical" : "warning"}>
                        {dec.status}
                      </StatusBadge>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Owner: {dec.owner} • Target: {dec.due}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Upcoming Roadmaps Milestones */}
          <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
            <h2 className="text-xs font-bold text-slate-950 uppercase tracking-wider text-slate-400 mb-4">Roadmap & Governance Milestones</h2>
            <div className="space-y-3">
              {upcomingMilestones.map((mil, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Calendar className="size-4 text-slate-400" />
                    {mil.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{mil.date}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: AI Insights & Quick Inquiries (3 cols / 25%) */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Morning Brief */}
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-bold tracking-wider">
              <Bot className="size-4 text-slate-600" />
              <span>Morning Brief</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Geographic regulatory mappings have updated for APAC. Review the Checkout Spec anomalies to ensure MAS compatibility holds during beta.
            </p>
          </div>

          {/* AI Recommendations */}
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-bold tracking-wider">
              <Sparkles className="size-4 text-primary" />
              <span>AI Recommendations</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 font-medium pl-1">
              {aiRecommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="text-slate-300">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Staging Risks */}
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-bold tracking-wider">
              <AlertCircle className="size-4 text-red-500" />
              <span>Staging & Release Risks</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 font-medium pl-1">
              {aiRisks.map((risk, i) => (
                <li key={i} className="flex gap-2 leading-relaxed text-red-950/80">
                  <span className="text-red-300">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ask Mycroft Command Line */}
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-2.5">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Ask Mycroft</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask about PRDs, Discovery, or Rules..."
                className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50 font-sans"
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              />
              <button 
                onClick={handleAsk}
                className="p-2 rounded-lg bg-slate-950 text-white hover:bg-slate-800 transition-colors"
              >
                <Send className="size-3.5" />
              </button>
            </div>

            {/* Quick history snippet */}
            {askHistory.length > 0 && (
              <div className="mt-2 border-t pt-2 max-h-[85px] overflow-y-auto space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Previous Inquiries</span>
                {askHistory.map((q, idx) => (
                  <p key={idx} className="text-[10px] text-slate-500 truncate font-medium">Q: {q}</p>
                ))}
              </div>
            )}
          </div>

        </aside>

      </div>

      {/* Global Quick Actions Footer */}
      <footer className="mt-8 flex flex-wrap gap-2.5 justify-center border-t border-slate-100 pt-6">
        {[
          { label: "Create PRD Spec", link: "/product/prds" },
          { label: "Start Opportunity Discovery", link: "/product/discovery" },
          { label: "Prioritize Initiatives", link: "/projects" },
          { label: "Review Compliance Logs", link: "/product/prds" }
        ].map((act, i) => (
          <Button 
            key={i} 
            variant="secondary" 
            className="h-9 px-3.5 text-xs border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-lg font-medium shadow-2xs flex items-center gap-1"
            onClick={() => window.location.assign(act.link)}
          >
            {act.label}
            <ArrowUpRight className="size-3" />
          </Button>
        ))}
      </footer>
    </div>
  );
}
