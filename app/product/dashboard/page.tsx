"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  Send,
  ArrowUpRight,
  Newspaper,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

// Mock news data
interface NewsStory {
  id: string;
  title: string;
  source: string;
  time: string;
  region: "India" | "Global";
  aiSummary: string;
}

const mockNewsStories: NewsStory[] = [
  {
    id: "ns1",
    title: "RBI mandates strict DPDP Act compliance metrics for domestic gateways",
    source: "Inc42",
    time: "1h ago",
    region: "India",
    aiSummary: "Domestic gateways must enforce data residency rules and local storage limits immediately."
  },
  {
    id: "ns2",
    title: "Stripe launches unified regional invoicing engine for multi-entity SaaS models",
    source: "TechCrunch",
    time: "3h ago",
    region: "Global",
    aiSummary: "Automates complex multi-currency tax audits and regional billing splits."
  },
  {
    id: "ns3",
    title: "MAS permissions permit sandbox exemptions for AI HealthTech projects",
    source: "e27",
    time: "5h ago",
    region: "Global",
    aiSummary: "Allows rapid testing under reduced compliance overheads within Singapore limits."
  },
  {
    id: "ns4",
    title: "UPI transactions cross record monthly transaction threshold across urban hubs",
    source: "YourStory",
    time: "Yesterday",
    region: "India",
    aiSummary: "P2P micropayments fuel 14% growth in retail transaction velocities."
  },
  {
    id: "ns5",
    title: "EU antitrust watchdogs announce digital payments interoperability probe",
    source: "VentureBeat",
    time: "2 days ago",
    region: "Global",
    aiSummary: "Targets communication syncing protocols across messaging and banking platforms."
  }
];

// Mock KPI metrics based on timeframe representing user productivity
interface KpiData {
  created: { count: number; trend: string; positive: boolean };
  downloaded: { count: number; trend: string; positive: boolean };
  aiGenerations: { count: number; trend: string; positive: boolean };
  discoveryGenerated: { count: number; trend: string; positive: boolean };
}

const mockKpiData: Record<"Today" | "This Week" | "This Month", KpiData> = {
  Today: {
    created: { count: 3, trend: "+20%", positive: true },
    downloaded: { count: 5, trend: "+12%", positive: true },
    aiGenerations: { count: 14, trend: "+35%", positive: true },
    discoveryGenerated: { count: 2, trend: "+100%", positive: true }
  },
  "This Week": {
    created: { count: 12, trend: "+8%", positive: true },
    downloaded: { count: 28, trend: "+18%", positive: true },
    aiGenerations: { count: 58, trend: "+22%", positive: true },
    discoveryGenerated: { count: 6, trend: "+20%", positive: true }
  },
  "This Month": {
    created: { count: 45, trend: "+15%", positive: true },
    downloaded: { count: 98, trend: "+22%", positive: true },
    aiGenerations: { count: 240, trend: "+18%", positive: true },
    discoveryGenerated: { count: 18, trend: "+25%", positive: true }
  }
};

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [dateString, setDateString] = useState("");
  const [newsRegion, setNewsRegion] = useState<"India" | "Global">("India");
  const [kpiTimeframe, setKpiTimeframe] = useState<"Today" | "This Week" | "This Month">("This Week");
  const [askInput, setAskInput] = useState("");
  const [askStatus, setAskStatus] = useState<string | null>(null);

  // Set greeting and date dynamically on mount
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDateString(new Date().toLocaleDateString('en-US', options));
  }, []);

  const handleAsk = () => {
    if (!askInput.trim()) return;
    setAskStatus(`Processing query: "${askInput}"`);
    setTimeout(() => {
      setAskStatus(null);
      setAskInput("");
      alert(`Mycroft processed suggestion: ${askInput}`);
    }, 1000);
  };

  const filteredStories = mockNewsStories
    .filter(story => story.region === newsRegion)
    .slice(0, 3);

  const activeKpis = mockKpiData[kpiTimeframe];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans antialiased text-slate-800 pb-36">
      
      {/* Centered Calm Workspace Canvas */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 space-y-12">
        
        {/* Section 1: Good Morning / Evening Brief */}
        <header className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{dateString}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {greeting}, Akshay.
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Here's what happened while you were away. Let's build something great today.
          </p>
        </header>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Left Panel (7 cols / 58%): Executive Summary & Activity Snapshot */}
          <div className="md:col-span-7 space-y-10">
            
            {/* Section 2: AI Executive Summary */}
            <section className="space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="flex size-5 items-center justify-center rounded-md bg-blue-50 text-primary">
                  <Sparkles className="size-3" />
                </div>
                <h2 className="text-xs font-bold text-slate-950 uppercase tracking-wider">AI Executive Brief</h2>
              </div>
              <ul className="space-y-3 pl-1 text-[13px] font-medium text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="flex size-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span>3 important FinTech updates detected overnight for India.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span>Your Razorpay PRD Spec is currently awaiting regulatory compliance verification.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span>PhonePe users reporting 14% increase in checkout gateway timeouts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                  <span>Sandbox milestone (MAS Compliance audits) is due tomorrow.</span>
                </li>
              </ul>
            </section>

            {/* Section 3: Product Activity Snapshot */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                    <Activity className="size-3" />
                  </div>
                  <h2 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Product Activity Snapshot</h2>
                </div>
                
                {/* Time filter controls */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40">
                  {(["Today", "This Week", "This Month"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setKpiTimeframe(t)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all ${kpiTimeframe === t ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-400 hover:text-slate-750'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of 4 Compact KPI Cards */}
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { label: "PRDs Created", kpi: activeKpis.created },
                  { label: "PRDs Downloaded", kpi: activeKpis.downloaded },
                  { label: "AI Generations", kpi: activeKpis.aiGenerations },
                  { label: "Discovery Reports Generated", kpi: activeKpis.discoveryGenerated }
                ].map((item, idx) => (
                  <Card key={idx} className="p-3 bg-white border border-slate-100 shadow-2xs flex flex-col justify-between h-20 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</span>
                    <div className="flex justify-between items-baseline mt-2">
                      <span className="text-xl font-bold tracking-tight text-slate-900">{item.kpi.count}</span>
                      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${item.kpi.positive ? 'text-green-600' : item.kpi.trend === "0%" ? 'text-slate-400' : 'text-red-500'}`}>
                        {item.kpi.positive ? <TrendingUp className="size-2.5" /> : item.kpi.trend === "0%" ? null : <TrendingDown className="size-2.5" />}
                        {item.kpi.trend}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

          </div>

          {/* Right Panel (5 cols / 42%): Top Industry News */}
          <div className="md:col-span-5 space-y-10">
            
            {/* Section 4: Top Industry News */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                    <Newspaper className="size-3" />
                  </div>
                  <h2 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Industry News</h2>
                </div>
                
                {/* Horizontal Filter Chips */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40">
                  {(["India", "Global"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setNewsRegion(r)}
                      className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${newsRegion === r ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-400 hover:text-slate-750'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* News list - top 3 stories */}
              <div className="space-y-3.5">
                {filteredStories.map((story) => (
                  <Card key={story.id} className="p-3 bg-white border border-slate-100 shadow-2xs hover:shadow-xs transition-all space-y-1.5 rounded-xl">
                    <div className="flex justify-between items-center text-[9px] font-semibold text-slate-450">
                      <span>{story.source}</span>
                      <span>{story.time}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{story.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{story.aiSummary}</p>
                    <button 
                      onClick={() => window.location.assign("/product/discovery")}
                      className="text-[9px] font-bold text-primary hover:underline flex items-center gap-0.5 pt-0.5"
                    >
                      Read More
                      <ArrowUpRight className="size-2.5" />
                    </button>
                  </Card>
                ))}
              </div>
            </section>

          </div>

        </div>

      </main>

      {/* Section 5: Ask Mycroft (Persistent AI Input near bottom) */}
      <div className="fixed bottom-6 left-0 lg:left-[280px] right-0 flex justify-center px-6 z-40 pointer-events-none">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-lg p-3 pointer-events-auto flex flex-col gap-2">
          
          {/* Active status result loader */}
          {askStatus && (
            <div className="text-[10px] font-semibold text-primary flex items-center gap-1.5 animate-pulse pl-1">
              <Bot className="size-3.5" />
              {askStatus}
            </div>
          )}

          {/* Form wrapper */}
          <div className="flex gap-2">
            <input
              type="text"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              placeholder="Ask anything about your product..."
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/30 font-sans"
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button 
              onClick={handleAsk}
              disabled={!askInput.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              Ask
              <Send className="size-3" />
            </button>
          </div>

          {/* Preset Example commands */}
          <div className="flex flex-wrap items-center gap-1.5 pl-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Examples:</span>
            {[
              "Summarize today's news",
              "Create a PRD",
              "Explain user feedback",
              "Generate roadmap",
              "Analyze competitors"
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => setAskInput(cmd)}
                className="h-5 px-2 text-[9px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
