"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  Calendar,
  Send,
  ChevronDown,
  ArrowUpRight,
  Newspaper,
  TerminalSquare
} from "lucide-react";

// Mock news data (Section 4)
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

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [dateString, setDateString] = useState("");
  const [newsRegion, setNewsRegion] = useState<"India" | "Global">("India");
  const [askInput, setAskInput] = useState("");
  const [askStatus, setAskStatus] = useState<string | null>(null);

  // Section 3: Today's Priorities state
  const [priorities, setPriorities] = useState([
    { id: 1, label: "Finish UPI P2P payments PRD compliance check", done: false },
    { id: 2, label: "Review Swiggy feedback Discovery Report", done: false },
    { id: 3, label: "Validate user research tags in settings", done: true },
    { id: 4, label: "Approve Q3 core payments roadmap scope", done: false },
    { id: 5, label: "Complete competitive checkout analysis logs", done: false }
  ]);

  // Set greeting and date dynamically on mount
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Format date: June 28, 2026
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDateString(new Date().toLocaleDateString('en-US', options));
  }, []);

  const togglePriority = (id: number) => {
    setPriorities(current => 
      current.map(p => p.id === id ? { ...p, done: !p.done } : p)
    );
  };

  const handleAsk = () => {
    if (!askInput.trim()) return;
    setAskStatus(`Processing query: "${askInput}"`);
    setTimeout(() => {
      setAskStatus(null);
      setAskInput("");
      alert(`Mycroft processed suggestion: ${askInput}`);
    }, 1000);
  };

  // Filter and limit to top 3 stories
  const filteredStories = mockNewsStories
    .filter(story => story.region === newsRegion)
    .slice(0, 3);

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
          
          {/* Left Panel (7 cols / 58%): Executive Summary & Priorities */}
          <div className="md:col-span-7 space-y-10">
            
            {/* Section 2: AI Executive Summary */}
            <section className="space-y-4">
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

            {/* Section 3: Today's Priorities */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="flex size-5 items-center justify-center rounded-md bg-green-50 text-green-600">
                  <CheckCircle2 className="size-3" />
                </div>
                <h2 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Today's Priorities</h2>
              </div>
              <div className="space-y-1.5">
                {priorities.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => togglePriority(item.id)}
                    className="group flex items-start gap-3 p-2.5 -mx-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    {item.done ? (
                      <CheckCircle2 className="size-4.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="size-4.5 text-slate-300 group-hover:text-slate-500 flex-shrink-0 mt-0.5 transition-colors" />
                    )}
                    <span className={`text-[13px] font-semibold leading-relaxed transition-all ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {item.label}
                    </span>
                  </div>
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
                
                {/* Region Filter Toggle */}
                <div className="relative inline-block text-left">
                  <select
                    value={newsRegion}
                    onChange={(e) => setNewsRegion(e.target.value as any)}
                    className="h-6 text-[10px] font-bold uppercase tracking-wider border border-slate-200 rounded-md bg-white pl-2 pr-6 focus:outline-none cursor-pointer appearance-none text-slate-500"
                  >
                    <option value="India">India</option>
                    <option value="Global">Global</option>
                  </select>
                  <ChevronDown className="absolute right-1.5 top-2 size-2.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* News list - top 3 stories */}
              <div className="space-y-4">
                {filteredStories.map((story) => (
                  <Card key={story.id} className="p-3.5 bg-white border border-slate-100 shadow-2xs hover:shadow-xs transition-all space-y-2 rounded-xl">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                      <span>{story.source}</span>
                      <span>{story.time}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{story.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{story.aiSummary}</p>
                    <button 
                      onClick={() => window.location.assign("/product/discovery")}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5 pt-1"
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
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-lg p-3.5 pointer-events-auto flex flex-col gap-2.5">
          
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
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/30 font-sans"
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button 
              onClick={handleAsk}
              disabled={!askInput.trim()}
              className="px-3.5 py-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
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
