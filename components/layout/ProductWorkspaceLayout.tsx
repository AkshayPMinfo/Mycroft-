"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

export function ProductWorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSidebarCollapsed(localStorage.getItem("sidebar_collapsed_pref") === "true");
    };
    sync();
    window.addEventListener("sidebar_toggle", sync);
    return () => window.removeEventListener("sidebar_toggle", sync);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7fe]">
      <Sidebar />
      <main className={cn(
        "min-h-screen pb-20 lg:pb-0 transition-all duration-350 ease-in-out",
        sidebarCollapsed ? "lg:pl-[64px]" : "lg:pl-[240px]"
      )}>
        {children}
      </main>
    </div>
  );
}
