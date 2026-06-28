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
  ChevronRight,
  ChevronLeft
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const prodState = localStorage.getItem("sidebar_product_expanded");
    const engState = localStorage.getItem("sidebar_engineering_expanded");
    const collapsedState = localStorage.getItem("sidebar_collapsed_pref");
    
    if (prodState !== null) setProductExpanded(prodState === "true");
    if (engState !== null) setEngineeringExpanded(engState === "true");
    if (collapsedState !== null) setIsSidebarCollapsed(collapsedState === "true");
    setIsLoaded(true);
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

  const toggleSidebarCollapse = () => {
    const val = !isSidebarCollapsed;
    setIsSidebarCollapsed(val);
    localStorage.setItem("sidebar_collapsed_pref", String(val));
    // Dispatch custom window event to notify parent layouts
    window.dispatchEvent(new Event("sidebar_toggle"));
  };

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r bg-[#f7f7fe] py-6 lg:flex overflow-y-auto transition-all duration-350 ease-in-out",
        isSidebarCollapsed ? "w-[64px] px-2" : "w-[240px] px-4"
      )}>
        
        {/* Logo header */}
        <Link href="/command-center" className={cn("mb-8 flex items-center gap-3 px-2", isSidebarCollapsed && "justify-center px-0")}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-[0_12px_24px_rgba(0,91,211,0.2)] shrink-0">
            <TerminalSquare className="size-5" />
          </span>
          {!isSidebarCollapsed && (
            <span className="transition-opacity duration-300">
              <span className="block text-2xl font-bold tracking-[-0.03em] text-slate-950">Mycroft PM</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">AI Operating System</span>
            </span>
          )}
        </Link>

        {/* Navigation list */}
        <div className="space-y-6 flex-1">
          {/* Section: Product Workspace */}
          <div>
            {!isSidebarCollapsed ? (
              <button
                onClick={toggleProduct}
                className="flex w-full items-center justify-between px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
              >
                <span>Product Workspace</span>
                {productExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
              </button>
            ) : (
              <hr className="border-slate-200/80 my-2 mx-1" />
            )}
            
            {(!isSidebarCollapsed ? productExpanded : true) && (
              <nav className={cn("mt-2 space-y-1.5", !isSidebarCollapsed && "pl-1")}>
                {productItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-950",
                        active && "bg-[#e9ebfb] text-primary",
                        isSidebarCollapsed && "justify-center px-0"
                      )}
                    >
                      {active ? <span className="absolute left-0 h-4 w-1 rounded-r-full bg-primary" /> : null}
                      <Icon className="size-4.5 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Section: Engineering Workspace */}
          <div>
            {!isSidebarCollapsed ? (
              <button
                onClick={toggleEngineering}
                className="flex w-full items-center justify-between px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
              >
                <span>Engineering Workspace</span>
                {engineeringExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
              </button>
            ) : (
              <hr className="border-slate-200/80 my-2 mx-1" />
            )}
            
            {(!isSidebarCollapsed ? engineeringExpanded : true) && (
              <nav className={cn("mt-2 space-y-1.5", !isSidebarCollapsed && "pl-1")}>
                {engineeringItems.map((item) => {
                  const active = pathname === item.href || (pathname === "/" && item.href === "/command-center");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-950",
                        active && "bg-[#e9ebfb] text-primary",
                        isSidebarCollapsed && "justify-center px-0"
                      )}
                    >
                      {active ? <span className="absolute left-0 h-4 w-1 rounded-r-full bg-primary" /> : null}
                      <Icon className="size-4.5 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        {/* Footer CTAs / User profile */}
        <div className="mt-auto space-y-4 pt-4 border-t border-slate-100/80">
          
          {/* Ask Mycroft CTA */}
          <Button 
            className={cn("h-10 w-full rounded-xl flex items-center justify-center gap-1.5", isSidebarCollapsed && "p-0 rounded-full size-10 mx-auto")} 
            variant="primary" 
            onClick={() => window.location.assign("/chat")}
            title={isSidebarCollapsed ? "Ask Mycroft" : undefined}
          >
            <Sparkles className="size-4 shrink-0" />
            {!isSidebarCollapsed && <span>Ask Mycroft</span>}
          </Button>

          {/* Profile card */}
          <div className={cn(
            "flex items-center gap-3 rounded-2xl bg-white/70 border border-slate-100",
            isSidebarCollapsed ? "p-1 justify-center rounded-full bg-transparent border-0" : "p-3"
          )}>
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white shrink-0 shadow-xs">AC</div>
            {!isSidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-950 truncate">Alex Chen</p>
                  <p className="text-xs font-semibold text-slate-500 truncate">Premium Plan</p>
                </div>
                <Bell className="size-4 text-slate-400 cursor-pointer hover:text-slate-600" />
              </>
            )}
          </div>

          {/* Collapse sidebar toggle */}
          <button
            onClick={toggleSidebarCollapse}
            className="flex w-full items-center justify-center h-10 rounded-xl hover:bg-slate-100 text-slate-450 hover:text-slate-900 transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="size-4.5" /> : <ChevronLeft className="size-4.5" />}
          </button>

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
