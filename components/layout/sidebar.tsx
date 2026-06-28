"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  BrainCircuit,
  Bug,
  FolderKanban,
  MessageSquare,
  Settings,
  Sparkles,
  TerminalSquare,
  LayoutDashboard,
  Compass,
  ClipboardList,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const productItems = [
  { label: "AI Home", href: "/product/home", icon: Bot },
  { label: "Dashboard", href: "/product/dashboard", icon: LayoutDashboard },
  { label: "Opportunity Discovery", href: "/product/discovery", icon: Compass },
  { label: "PRD Workspace", href: "/product/prds", icon: ClipboardList }
];

const engineeringItems = [
  { label: "Command Center", href: "/command-center", icon: Bot },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "AI Chat", href: "/chat", icon: MessageSquare },
  { label: "Debug", href: "/debug", icon: Bug },
  { label: "GitHub", href: "/github", icon: TerminalSquare },
  { label: "Memory", href: "/memory", icon: BrainCircuit },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  
  // Collapse/Expand state with localStorage persistence
  const [productExpanded, setProductExpanded] = useState(true);
  const [engineeringExpanded, setEngineeringExpanded] = useState(false);

  useEffect(() => {
    const prodState = localStorage.getItem("sidebar_product_expanded");
    const engState = localStorage.getItem("sidebar_engineering_expanded");
    if (prodState !== null) setProductExpanded(prodState === "true");
    if (engState !== null) setEngineeringExpanded(engState === "true");
  }, []);

  const toggleProduct = () => {
    const val = !productExpanded;
    setProductExpanded(val);
    localStorage.setItem("sidebar_product_expanded", String(val));
  };

  const toggleEngineering = () => {
    const val = !engineeringExpanded;
    setEngineeringExpanded(val);
    localStorage.setItem("sidebar_engineering_expanded", String(val));
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] flex-col border-r bg-[#f7f7fe] px-4 py-6 lg:flex overflow-y-auto">
        <Link href="/command-center" className="mb-8 flex items-center gap-3 px-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-[0_12px_24px_rgba(0,91,211,0.2)]">
            <TerminalSquare className="size-5" />
          </span>
          <span>
            <span className="block text-2xl font-bold tracking-[-0.03em] text-slate-950">Mycroft PM</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">AI Operating System</span>
          </span>
        </Link>

        <div className="space-y-6 flex-1">
          {/* Section: Product Workspace */}
          <div>
            <button
              onClick={toggleProduct}
              className="flex w-full items-center justify-between px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
            >
              <span>Product Workspace</span>
              {productExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            </button>
            
            {productExpanded && (
              <nav className="mt-2 space-y-1.5 pl-1">
                {productItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-950",
                        active && "bg-[#e9ebfb] text-primary"
                      )}
                    >
                      {active ? <span className="absolute left-0 h-4 w-1 rounded-r-full bg-primary" /> : null}
                      <Icon className="size-4.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Section: Engineering Workspace */}
          <div>
            <button
              onClick={toggleEngineering}
              className="flex w-full items-center justify-between px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
            >
              <span>Engineering Workspace</span>
              {engineeringExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            </button>
            
            {engineeringExpanded && (
              <nav className="mt-2 space-y-1.5 pl-1">
                {engineeringItems.map((item) => {
                  const active = pathname === item.href || (pathname === "/" && item.href === "/command-center");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-950",
                        active && "bg-[#e9ebfb] text-primary"
                      )}
                    >
                      {active ? <span className="absolute left-0 h-4 w-1 rounded-r-full bg-primary" /> : null}
                      <Icon className="size-4.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-4 border-t pt-4">
          <Button className="h-11 w-full rounded-xl" variant="primary" onClick={() => window.location.assign("/chat")}>
            <Sparkles className="size-4" />
            Ask Mycroft
          </Button>
          <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 border border-slate-100">
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">AC</div>
            <div>
              <p className="text-sm font-bold text-slate-950">Alex Chen</p>
              <p className="text-xs font-semibold text-slate-500">Premium Plan</p>
            </div>
            <Bell className="ml-auto size-4 text-slate-400" />
          </div>
        </div>
      </aside>
      
      {/* Mobile nav */}
      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-11 rounded-2xl border bg-white/90 p-2 shadow-soft backdrop-blur-xl lg:hidden">
        {[...productItems, ...engineeringItems].map((item) => {
          const active = pathname === item.href || (pathname === "/" && item.href === "/command-center");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex h-10 items-center justify-center rounded-xl text-slate-500", active && "bg-[#e9ebfb] text-primary")}
              aria-label={item.label}
            >
              <Icon className="size-4.5" />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
