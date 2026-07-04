"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { 
  Compass, 
  Search, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Globe, 
  MapPin, 
  Zap, 
  Filter,
  CheckCircle2,
  FileText
} from "lucide-react";

// Mock news data
interface NewsArticle {
  id: string;
  title: string;
  source: string;
  region: "India" | "Global";
  category: "FinTech" | "HealthTech" | "AI" | "SaaS" | "Ecommerce" | "EdTech" | "Gaming";
  summary: string;
  date: string;
}

interface AppReviewSummary {
  appName: string;
  sentiment: string;
  positiveThemes: string[];
  complaints: string[];
  requestedFeatures: string[];
  opportunityAreas: string[];
  recommendations: string[];
}

export default function DiscoveryPage() {
  // Industry News states
  const [regionFilter, setRegionFilter] = useState<"All" | "India" | "Global">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // App Intelligence states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAnalysis, setActiveAnalysis] = useState<AppReviewSummary | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Industry News states
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsNewsLoading(true);
      setNewsError(null);
      try {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: categoryFilter, region: regionFilter })
        });
        if (res.ok) {
          const data = await res.json();
          setNewsArticles(data.articles || []);
        } else {
          const errData = await res.json().catch(() => ({}));
          setNewsError(errData.error || "Failed to fetch news from NewsData.io.");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setNewsError("Network error — could not fetch news.");
      } finally {
        setIsNewsLoading(false);
      }
    };
    fetchNews();
  }, [categoryFilter, regionFilter]);

  useEffect(() => {
    const saved = localStorage.getItem("mycroft_active_discovery");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveAnalysis(parsed);
        setSearchQuery(parsed.appName);
      } catch (err) {
        console.error("Failed to load saved discovery data:", err);
      }
    }
  }, []);

  const categories = ["All", "FinTech", "HealthTech", "AI", "SaaS", "Ecommerce", "EdTech", "Gaming"];

  const analyzeCompany = async (name: string) => {
    setIsSearching(true);
    setError(null);

    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: name })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.error === "NO_COMPANY_FOUND" || data.error) {
          setError("No company found");
          setActiveAnalysis(null);
        } else {
          setActiveAnalysis(data);
          localStorage.setItem("mycroft_active_discovery", JSON.stringify(data));
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Discovery API error status:", res.status, errData);
        setError(errData.error || "Failed to analyze the company. Please try again.");
        setActiveAnalysis(null);
      }
    } catch (err) {
      console.error("Failed to fetch discovery analysis:", err);
      setError("Network error — could not reach the discovery engine.");
      setActiveAnalysis(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    analyzeCompany(searchQuery);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans antialiased text-slate-800 p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Compass className="size-5 text-primary" />
            Product Opportunity Discovery
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5 font-sans">
            Research dashboard: industry developments and application review intelligence.
          </p>
        </div>
      </header>

      {/* Main Grid: Section A (News: 45%) & Section B (Review Intelligence: 55%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-start">
        
        {/* Section A: Industry News (5 cols / 45%) */}
        <section className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider text-slate-400">Industry News</h2>
            <StatusBadge tone="neutral">Real-time</StatusBadge>
          </div>

          {/* Region and Category filters */}
          <div className="space-y-3 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100/60">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 min-w-[70px]">Region:</span>
              <div className="flex gap-1.5">
                {(["All", "India", "Global"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegionFilter(r)}
                    className={`h-7 px-3 text-[11px] font-semibold rounded-lg border transition-all ${regionFilter === r ? 'bg-slate-950 text-white border-slate-950' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-xs">
              <span className="font-semibold text-slate-500 min-w-[70px] mt-1.5">Category:</span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`h-7 px-3 text-[11px] font-semibold rounded-lg border transition-all ${categoryFilter === c ? 'bg-slate-950 text-white border-slate-950' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* News Stream */}
          <div className="space-y-5 flex-1 overflow-y-auto max-h-[550px] pr-1">
            {isNewsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-3" />
                <p className="text-xs text-slate-500 font-medium">Fetching GNews developments...</p>
              </div>
            ) : newsError ? (
              <div className="text-center py-12 text-xs text-red-500 font-semibold">
                {newsError}
              </div>
            ) : newsArticles.length > 0 ? (
              newsArticles.map((art) => (
                <div key={art.id} className="group border-b border-slate-50 pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{art.date}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors cursor-pointer">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{art.summary}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-xs text-slate-400 italic">
                No matching developments found under this filter combination.
              </div>
            )}
          </div>
        </section>

        {/* Section B: Product Review Intelligence (7 cols / 55%) */}
        <section className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col h-full min-h-[500px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-primary">
              <Sparkles className="size-3.5" />
            </div>
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider text-slate-400">Review Intelligence</h2>
          </div>

          {/* Search form and preset templates */}
          <div className="mb-6 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter app or company name (e.g. Swiggy, Zepto...)"
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50 font-sans"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSearching || !searchQuery.trim()} 
                className="h-9 px-4 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold"
              >
                Analyze App
              </Button>
            </form>
            
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 mr-1.5">Examples:</span>
              {["Swiggy", "Zepto", "PhonePe", "Google Pay", "Paytm"].map((app) => (
                <button
                  key={app}
                  onClick={() => {
                    setSearchQuery(app);
                    analyzeCompany(app);
                  }}
                  className="h-6 px-2.5 text-[10px] font-semibold rounded-md border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition-colors"
                >
                  {app}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Viewport */}
          <div className="flex-1 border-t border-slate-50 pt-5">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-3" />
                <p className="text-xs text-slate-500 font-medium">Ingesting Play Store & App Store reviews...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-red-500 font-semibold text-xs">
                <AlertTriangle className="size-8 mb-2.5 text-red-500 animate-pulse" />
                <p>{error}</p>
              </div>
            ) : activeAnalysis ? (
              <div className="space-y-6 overflow-y-auto max-h-[500px] pr-1">
                {/* Header overview */}
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{activeAnalysis.appName}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Sentiment Metrics</p>
                  </div>
                  <StatusBadge tone="info">{activeAnalysis.sentiment}</StatusBadge>
                </div>

                {/* Grid columns for positive and negative review themes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
                      <ThumbsUp className="size-3.5" />
                      Positive Themes
                    </span>
                    <ul className="text-xs text-slate-600 space-y-2 font-medium bg-green-50/20 border border-green-100/50 p-3 rounded-xl">
                      {activeAnalysis.positiveThemes.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                      <ThumbsDown className="size-3.5" />
                      Common Complaints
                    </span>
                    <ul className="text-xs text-slate-600 space-y-2 font-medium bg-red-50/10 border border-red-100/30 p-3 rounded-xl">
                      {activeAnalysis.complaints.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Requested features & Opportunity Areas */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Requested Features</span>
                    <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
                      {activeAnalysis.requestedFeatures.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Opportunity Areas</span>
                    <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
                      {activeAnalysis.opportunityAreas.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Product Recommendation Recommendation Box */}
                <div className="p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl space-y-2 text-xs leading-relaxed">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <Zap className="size-3.5 text-primary" />
                    AI Opportunity Recommendation
                  </span>
                  <div className="font-semibold text-slate-700">
                    {activeAnalysis.recommendations.map((rec, i) => (
                      <p key={i} className="mt-1 leading-relaxed">{rec}</p>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 text-slate-400 italic">
                <Search className="size-10 text-slate-200 mb-2.5" />
                <p className="text-xs">Search for an app above to parse Play Store & App Store review clusters.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
