"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  ClipboardList,
  GitBranch,
  Users,
  Target,
  BarChart2,
  FileText,
  Settings,
  Bot,
  FolderKanban,
  MessageSquare,
  Bug,
  BrainCircuit,
  TerminalSquare,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const productItems = [
  { label: "AI Home", href: "/product/home", icon: Home },
  { label: "Product Discovery", href: "/product/discovery", icon: Compass },
  { label: "PRD Workspace", href: "/product/prds", icon: ClipboardList },
  { label: "Roadmap", href: "#", icon: GitBranch },
  { label: "User Research", href: "#", icon: Users },
  { label: "Competitors", href: "#", icon: Target },
  { label: "Analytics", href: "#", icon: BarChart2 },
  { label: "Documents", href: "#", icon: FileText },
];

const engineeringItems = [
  { label: "Command Center", href: "/command-center", icon: Bot },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "AI Chat", href: "/chat", icon: MessageSquare },
  { label: "Debug", href: "/debug", icon: Bug },
  { label: "GitHub", href: "/github", icon: TerminalSquare },
  { label: "Memory", href: "/memory", icon: BrainCircuit },
];

export function Sidebar() {
  const pathname = usePathname();
  const [engineeringExpanded, setEngineeringExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const collapsedState = localStorage.getItem("sidebar_collapsed_pref");
    const engState = localStorage.getItem("sidebar_engineering_expanded");
    if (collapsedState !== null) setIsSidebarCollapsed(collapsedState === "true");
    if (engState !== null) setEngineeringExpanded(engState === "true");
  }, []);

  const toggleEngineering = () => {
    const val = !engineeringExpanded;
    setEngineeringExpanded(val);
    localStorage.setItem("sidebar_engineering_expanded", String(val));
  };

  const toggleSidebarCollapse = () => {
    const val = !isSidebarCollapsed;
    setIsSidebarCollapsed(val);
    localStorage.setItem("sidebar_collapsed_pref", String(val));
    window.dispatchEvent(new Event("sidebar_toggle"));
  };

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-100 bg-white py-5 lg:flex overflow-y-auto transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[64px] px-2" : "w-[220px] px-4"
      )}>

        {/* ── Logo ── */}
        <Link
          href="/product/home"
          className={cn(
            "mb-7 flex items-center gap-2.5 px-1 rounded-lg",
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

        {/* ── Product Nav ── */}
        <nav className="flex-1 space-y-0.5">
          {productItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all",
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  isSidebarCollapsed && "justify-center px-0"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

          {/* Settings */}
          <div className="pt-1 mt-2 border-t border-slate-100">
            <Link
              href="/settings"
              title={isSidebarCollapsed ? "Settings" : undefined}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all",
                pathname === "/settings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <Settings className="size-4 shrink-0" />
              {!isSidebarCollapsed && <span>Settings</span>}
            </Link>
          </div>

          {/* Engineering (collapsible, hidden when sidebar collapsed) */}
          {!isSidebarCollapsed && (
            <div className="pt-1 mt-1 border-t border-slate-100">
              <button
                onClick={toggleEngineering}
                className="flex w-full items-center justify-between px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span>Engineering</span>
                {engineeringExpanded
                  ? <ChevronDown className="size-3" />
                  : <ChevronRight className="size-3" />
                }
              </button>
              {engineeringExpanded && (
                <div className="space-y-0.5 mt-0.5">
                  {engineeringItems.map((item) => {
                    const active = pathname === item.href || (pathname === "/" && item.href === "/command-center");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all",
                          active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ── Profile + Collapse toggle ── */}
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-1">
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

      {/* ── Mobile nav (bottom bar) ── */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex rounded-2xl border bg-white/90 p-2 shadow-lg backdrop-blur-xl lg:hidden gap-1">
        {productItems.slice(0, 5).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-1 h-10 items-center justify-center rounded-xl text-slate-500",
                active && "bg-blue-50 text-blue-600"
              )}
              aria-label={item.label}
            >
              <Icon className="size-4" />
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={cn(
            "flex flex-1 h-10 items-center justify-center rounded-xl text-slate-500",
            pathname === "/settings" && "bg-blue-50 text-blue-600"
          )}
          aria-label="Settings"
        >
          <Settings className="size-4" />
        </Link>
      </nav>
    </>
  );
}
