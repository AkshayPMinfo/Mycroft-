"use client";

import React, { useState } from "react";
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

const mockNews: NewsArticle[] = [
  {
    id: "n1",
    title: "RBI mandates strict DPDP Act compliance metrics for domestic payment gateways",
    source: "Inc42",
    region: "India",
    category: "FinTech",
    summary: "New directives require instant authorization loops to secure transaction credentials locally under DPDP protocols.",
    date: "1 hour ago"
  },
  {
    id: "n2",
    title: "Stripe launches unified regional invoicing engine for multi-entity SaaS models",
    source: "TechCrunch",
    region: "Global",
    category: "SaaS",
    summary: "Automates multi-currency collection compliance, integrating direct tax mappings globally.",
    date: "3 hours ago"
  },
  {
    id: "n3",
    title: "HealthTech AI platforms secure MAS sandboxing exemptions in Singapore regulations",
    source: "e27",
    region: "Global",
    category: "HealthTech",
    summary: "MAS sandbox permits testing under reduced operational limits for AI diagnostic integrations.",
    date: "Yesterday"
  },
  {
    id: "n4",
    title: "Ecommerce logistics giant leverages LLMs for route optimization in metro cities",
    source: "YourStory",
    region: "India",
    category: "Ecommerce",
    summary: "Reduced final-mile delivery delays by 14% using real-time dispatch route adjustments.",
    date: "2 days ago"
  },
  {
    id: "n5",
    title: "EdTech platforms pivot to local tutoring micro-spaces under DPDP Act limits",
    source: "Financial Express",
    region: "India",
    category: "EdTech",
    summary: "Limits student data retention periods, forcing platforms to build on-device memory paradigms.",
    date: "3 days ago"
  },
  {
    id: "n6",
    title: "Global SaaS memory platforms experience massive outage due to cloud node latency",
    source: "VentureBeat",
    region: "Global",
    category: "SaaS",
    summary: "Database synchronization latency triggered chain failures across multiple integration points.",
    date: "4 days ago"
  }
];

// Mock Play Store/App Store review intelligence data
interface AppReviewSummary {
  appName: string;
  sentiment: string;
  positiveThemes: string[];
  complaints: string[];
  requestedFeatures: string[];
  opportunityAreas: string[];
  recommendations: string[];
}

const mockReviewData: Record<string, AppReviewSummary> = {
  swiggy: {
    appName: "Swiggy",
    sentiment: "78% Positive • 22% Negative",
    positiveThemes: [
      "Instamart delivers consistently under 15 minutes.",
      "Vast restaurant selection across urban regions.",
      "Clear live tracking display during heavy downpours."
    ],
    complaints: [
      "Surge pricing is perceived as arbitrary and excessively high.",
      "Customer support uses rigid bot scripts rather than solving issues.",
      "Refund status generation lags up to 7 working days on failed payments."
    ],
    requestedFeatures: [
      "Ability to create shared carts for group order split bills.",
      "Option to exclude plastic cutlery and add custom instructions for riders.",
      "Loyalty rewards tier directly convertible to Instamart wallet cash."
    ],
    opportunityAreas: [
      "Unified cart checkouts combining food items and Instamart groceries.",
      "Instant refunds for certified payment failures to reduce support overhead by 30%."
    ],
    recommendations: [
      "Implement a 'Co-Cart' split-order functionality for group checkouts, targeting a +12% increase in Average Order Value (AOV)."
    ]
  },
  zepto: {
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
    requestedFeatures: [
      "Monthly subscription passes to waive handling fees on small orders.",
      "60-second grace window to add forgotten items post-payment.",
      "Eco-friendly bag return-and-refund points."
    ],
    opportunityAreas: [
      "Predictive local warehouse stocking during high-demand peak hours.",
      "Adding a quick post-purchase item annexing window."
    ],
    recommendations: [
      "Launch a '60-Second Add-On' buffer mechanism that lets users append forgotten items to an active packing order to reduce duplicate deliveries."
    ]
  },
  phonepe: {
    appName: "PhonePe",
    sentiment: "85% Positive • 15% Negative",
    positiveThemes: [
      "High transaction success rate even during peak bank latency hours.",
      "Automatic bill payment reminders prevent missing dues.",
      "Minimalist transaction screen loads fast."
    ],
    complaints: [
      "Scratch cards reward users with irrelevant brand coupons rather than cash.",
      "Frequent promotional notifications and banner advertisements in the main viewport.",
      "Interface feels cluttered due to the inclusion of gold investments and insurance."
    ],
    requestedFeatures: [
      "Shared family wallet balances with customizable monthly limits.",
      "Advanced categorization of monthly expenses (Food, Bills, Rent) with charts.",
      "Direct dark mode setting toggle."
    ],
    opportunityAreas: [
      "A streamlined 'UPI Lite' separate focus tab to hide financial product ads.",
      "Auto-tagging transaction description fields using local LLMs."
    ],
    recommendations: [
      "Introduce an automated 'Spend Insights Engine' that groups merchant transactions into tags, reducing manual logging for active budgeters."
    ]
  },
  "google pay": {
    appName: "Google Pay",
    sentiment: "80% Positive • 20% Negative",
    positiveThemes: [
      "Seamless integration with Android security biometric keys.",
      "Group chat split bills functionality is highly functional.",
      "Fast contact selection matching bank registry."
    ],
    complaints: [
      "Failed payments block bank balances for up to 3 working days.",
      "Reward mechanism requires tedious manual clicking of scratch cards.",
      "Customer support lacks a quick escalation channel for failed high-value transfers."
    ],
    requestedFeatures: [
      "International QR code scanner supporting cross-border payments.",
      "Custom notification settings for specific contact transactions.",
      "Exportable transaction logs in standard PDF and CSV spreadsheets."
    ],
    opportunityAreas: [
      "Failed transaction insurance pooling to instantly refund users up to 2000 rupees.",
      "Unified global payments map for travelers."
    ],
    recommendations: [
      "Build a 'Failed Transaction Buffer' vault that guarantees instant credits on server errors, retaining user confidence during bank outages."
    ]
  },
  slack: {
    appName: "Slack",
    sentiment: "75% Positive • 25% Negative",
    positiveThemes: [
      "Integration ecosystem (GitHub, Jira, Zoom) is world class.",
      "Huddles feature has excellent audio clarity and fast connection.",
      "Powerful search filters locate files and comments quickly."
    ],
    complaints: [
      "Desktop desktop client consumes excessive RAM, causing system slowdowns.",
      "Mobile push notifications frequently delay and fail to sync with active desktop sessions.",
      "Channel sidebar gets cluttered in large workspaces."
    ],
    requestedFeatures: [
      "Native AI thread summarization directly in channel viewport.",
      "Custom sidebar tabs and workspaces grouping capabilities.",
      "Scheduled channel muting rules."
    ],
    opportunityAreas: [
      "Integrating local machine translation engines.",
      "Consolidating stale channels automatically."
    ],
    recommendations: [
      "Introduce a 'Thread Synthesis' utility that uses locally-run models to generate a 3-sentence summary of long unread threads, decreasing cognitive overhead."
    ]
  }
};

export default function DiscoveryPage() {
  // Industry News states
  const [regionFilter, setRegionFilter] = useState<"All" | "India" | "Global">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // App Intelligence states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAnalysis, setActiveAnalysis] = useState<AppReviewSummary | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const categories = ["All", "FinTech", "HealthTech", "AI", "SaaS", "Ecommerce", "EdTech", "Gaming"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const q = searchQuery.toLowerCase().trim();
      const matchKey = Object.keys(mockReviewData).find(key => q.includes(key) || key.includes(q));
      
      if (matchKey) {
        setActiveAnalysis(mockReviewData[matchKey]);
      } else {
        // Fallback mock app review summary
        setActiveAnalysis({
          appName: searchQuery,
          sentiment: "72% Positive • 28% Negative",
          positiveThemes: [
            "User interface design feels intuitive and smooth.",
            "Fast load times on urban cellular connections."
          ],
          complaints: [
            "Customer support replies lack contextual intelligence.",
            "Frequent minor update downloads required."
          ],
          requestedFeatures: [
            "Enhanced search filtering inside search query tabs.",
            "Direct integration with cloud storage adapters."
          ],
          opportunityAreas: [
            "Simplifying the user registration checklist.",
            "Dynamic localized language localization profiles."
          ],
          recommendations: [
            `For ${searchQuery}, optimize the core data synchronization pipelines to lower latency and increase retention rates among new signups.`
          ]
        });
      }
      setIsSearching(false);
    }, 600);
  };

  const filteredNews = mockNews.filter(art => {
    const matchesRegion = regionFilter === "All" || art.region === regionFilter;
    const matchesCat = categoryFilter === "All" || art.category === categoryFilter;
    return matchesRegion && matchesCat;
  });

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
            
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 min-w-[70px]">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-7 text-[11px] font-semibold border border-slate-200 rounded-lg bg-white px-2 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* News Stream */}
          <div className="space-y-5 flex-1 overflow-y-auto max-h-[550px] pr-1">
            {filteredNews.length > 0 ? (
              filteredNews.map((art) => (
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
              {["Swiggy", "Zepto", "PhonePe", "Google Pay", "Slack"].map((app) => (
                <button
                  key={app}
                  onClick={() => {
                    setSearchQuery(app);
                    setActiveAnalysis(mockReviewData[app.toLowerCase()]);
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
