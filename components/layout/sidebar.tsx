"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder conversations — replace with real data later
const placeholderConversations = [
  { id: "1", title: "Onboarding flow redesign", time: "2h ago" },
  { id: "2", title: "Q3 roadmap priorities", time: "Yesterday" },
  { id: "3", title: "Competitor analysis — Notion", time: "2d ago" },
  { id: "4", title: "FinTech feature gaps", time: "3d ago" },
  { id: "5", title: "User interview synthesis", time: "4d ago" },
  { id: "6", title: "Growth metrics review", time: "5d ago" },
  { id: "7", title: "PRD for payments module", time: "1w ago" },
  { id: "8", title: "Discovery sprint plan", time: "1w ago" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const collapsedState = localStorage.getItem("sidebar_collapsed_pref");
    if (collapsedState !== null) setIsSidebarCollapsed(collapsedState === "true");
  }, []);

  const toggleSidebarCollapse = () => {
    const val = !isSidebarCollapsed;
    setIsSidebarCollapsed(val);
    localStorage.setItem("sidebar_collapsed_pref", String(val));
    window.dispatchEvent(new Event("sidebar_toggle"));
  };

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-100 bg-white py-5 lg:flex transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[64px] px-2" : "w-[220px] px-4"
      )}>

        {/* ── Logo ── */}
        <Link
          href="/product/home"
          className={cn(
            "mb-5 flex items-center gap-2.5 px-1 rounded-lg",
            isSidebarCollapsed && "justify-center px-0"
          )}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm shrink-0 shadow-sm">
            M
          </span>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <span className="block text-[13px] font-bold text-slate-900 leading-tight">Mycroft</span>
              <span className="block text-[10px] text-slate-400 font-medium leading-tight">AI Product Manager</span>
            </div>
          )}
        </Link>

        {/* ── AI Home ── */}
        <Link
          href="/product/home"
          title={isSidebarCollapsed ? "AI Home" : undefined}
          className={cn(
            "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all shrink-0",
            pathname === "/product/home"
              ? "bg-blue-50 text-blue-600"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            isSidebarCollapsed && "justify-center px-0"
          )}
        >
          <Home className="size-4 shrink-0" />
          {!isSidebarCollapsed && <span>AI Home</span>}
        </Link>

        {/* ── Conversations (scrollable, between AI Home and Discovery) ── */}
        {!isSidebarCollapsed && (
          <div className="flex flex-col min-h-0 flex-1 mt-3">
            <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Conversations
            </p>
            <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5">
              {placeholderConversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full flex items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50 transition-colors group"
                >
                  <MessageSquare className="size-3.5 shrink-0 mt-0.5 text-slate-300 group-hover:text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-slate-600 truncate leading-tight group-hover:text-slate-900">
                      {conv.title}
                    </p>
                    <p className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <Clock className="size-2.5" />
                      {conv.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer when collapsed */}
        {isSidebarCollapsed && <div className="flex-1" />}

        {/* ── Discovery (Latest News) — pinned at bottom of main area ── */}
        <div className={cn("shrink-0", !isSidebarCollapsed && "mt-3 pt-3 border-t border-slate-100")}>
          <Link
            href="/product/discovery"
            title={isSidebarCollapsed ? "Discovery (Latest News)" : undefined}
            className={cn(
              "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all",
              pathname === "/product/discovery"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              isSidebarCollapsed && "justify-center px-0"
            )}
          >
            <Search className="size-4 shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">Discovery (Latest News)</span>}
          </Link>
        </div>

        {/* ── Profile + Collapse toggle ── */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1 shrink-0">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex size-8 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold shrink-0">AK</div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-slate-900 truncate leading-tight">Akshay Anand</p>
                <p className="text-[10px] text-slate-400 truncate leading-tight">Product Manager</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div className="flex size-8 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold cursor-pointer">AK</div>
            </div>
          )}

          <button
            onClick={toggleSidebarCollapse}
            className="flex w-full items-center justify-center h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>
      </aside>

      {/* ── Mobile nav (bottom bar — AI Home + Discovery only) ── */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex rounded-2xl border bg-white/90 p-2 shadow-lg backdrop-blur-xl lg:hidden gap-1">
        <Link
          href="/product/home"
          className={cn(
            "flex flex-1 h-10 items-center justify-center rounded-xl text-slate-500",
            pathname === "/product/home" && "bg-blue-50 text-blue-600"
          )}
          aria-label="AI Home"
        >
          <Home className="size-4" />
        </Link>
        <Link
          href="/product/discovery"
          className={cn(
            "flex flex-1 h-10 items-center justify-center rounded-xl text-slate-500",
            pathname === "/product/discovery" && "bg-blue-50 text-blue-600"
          )}
          aria-label="Discovery (Latest News)"
        >
          <Search className="size-4" />
        </Link>
      </nav>
    </>
  );
}
