"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Pin,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  messages: any[];
  createdAt: string;
  isPinned?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");

  // Conversation management states
  const [editingConvId, setEditingConvId] = useState<string>("");
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [activeMenuConvId, setActiveMenuConvId] = useState<string>("");

  // Start renaming
  const startRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(id);
    setEditingTitle(currentTitle);
    setActiveMenuConvId("");
  };

  // Save renamed conversation
  const handleSaveRename = (id: string) => {
    if (!editingTitle.trim()) return;
    const updated = conversations.map(c => 
      c.id === id ? { ...c, title: editingTitle.trim() } : c
    );
    saveAndSync(updated);
    setEditingConvId("");
    setEditingTitle("");
  };

  // Cancel renaming
  const handleCancelRename = () => {
    setEditingConvId("");
    setEditingTitle("");
  };

  // Toggle Pin/Unpin
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.map(c => 
      c.id === id ? { ...c, isPinned: !c.isPinned } : c
    );
    saveAndSync(updated);
    setActiveMenuConvId("");
  };

  // Delete conversation with confirmation
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this conversation?")) return;
    const updated = conversations.filter(c => c.id !== id);
    saveAndSync(updated);
    if (activeConvId === id) {
      localStorage.setItem("mycroft_home_active_conv_id", "");
      window.dispatchEvent(new Event("mycroft_sync"));
    }
    setActiveMenuConvId("");
  };

  const saveAndSync = (updatedConvs: Conversation[]) => {
    localStorage.setItem("mycroft_home_conversations", JSON.stringify(updatedConvs));
    window.dispatchEvent(new Event("mycroft_sync"));
  };

  const sync = () => {
    // 1. Sync sidebar collapse preference
    const collapsedState = localStorage.getItem("sidebar_collapsed_pref");
    if (collapsedState !== null) {
      setIsSidebarCollapsed(collapsedState === "true");
    }

    // 2. Sync conversations list
    const savedConvs = localStorage.getItem("mycroft_home_conversations");
    if (savedConvs) {
      try {
        const parsed = JSON.parse(savedConvs);
        if (Array.isArray(parsed)) {
          // Filter out conversations with no messages, sort newest first
          const valid = parsed
            .filter((c: Conversation) => c.messages && c.messages.length > 0)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setConversations(valid);
        }
      } catch (e) {
        console.error("Error parsing sidebar conversations:", e);
      }
    } else {
      setConversations([]);
    }

    // 3. Sync active conversation
    const savedActiveId = localStorage.getItem("mycroft_home_active_conv_id");
    setActiveConvId(savedActiveId || "");
  };

  useEffect(() => {
    sync();
    window.addEventListener("sidebar_toggle", sync);
    window.addEventListener("mycroft_sync", sync);
    return () => {
      window.removeEventListener("sidebar_toggle", sync);
      window.removeEventListener("mycroft_sync", sync);
    };
  }, []);

  const toggleSidebarCollapse = () => {
    const val = !isSidebarCollapsed;
    setIsSidebarCollapsed(val);
    localStorage.setItem("sidebar_collapsed_pref", String(val));
    window.dispatchEvent(new Event("sidebar_toggle"));
  };

  const handleSelectConv = (id: string) => {
    localStorage.setItem("mycroft_home_active_conv_id", id);
    window.dispatchEvent(new Event("mycroft_sync"));
    if (pathname !== "/product/home") {
      router.push("/product/home");
    }
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
          onClick={() => {
            localStorage.setItem("mycroft_home_active_conv_id", "");
            window.dispatchEvent(new Event("mycroft_sync"));
          }}
          title={isSidebarCollapsed ? "AI Home" : undefined}
          className={cn(
            "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all shrink-0",
            pathname === "/product/home" && activeConvId === ""
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
            <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
              {(() => {
                const pinnedConvs = conversations.filter(c => c.isPinned);
                const regularConvs = conversations.filter(c => !c.isPinned);

                const renderChatItem = (conv: Conversation) => {
                  const isActive = activeConvId === conv.id;
                  const isEditing = editingConvId === conv.id;

                  if (isEditing) {
                    return (
                      <div
                        key={conv.id}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50/20"
                      >
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(conv.id);
                            if (e.key === "Escape") handleCancelRename();
                          }}
                          className="flex-1 bg-transparent text-[12px] text-slate-900 focus:outline-none py-0.5"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(conv.id)}
                          className="p-0.5 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Save rename"
                        >
                          <Check className="size-3" />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-0.5 rounded text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Cancel rename"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    );
                  }

                  const isMenuOpen = activeMenuConvId === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left hover:bg-slate-50 transition-colors group cursor-pointer relative",
                        isActive
                          ? "bg-blue-50/50 text-blue-600 font-semibold"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className={cn("size-3.5 shrink-0", isActive ? "text-blue-500" : "text-slate-400")} />
                        <span className="text-[12px] truncate leading-tight">
                          {conv.title}
                        </span>
                      </div>

                      {/* Three dots menu container */}
                      <div className="relative shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenuConvId(isMenuOpen ? "" : conv.id)}
                          className="text-slate-400 hover:text-slate-700 transition-all p-0.5 rounded hover:bg-slate-200/60 shrink-0"
                          title="Conversation actions"
                        >
                          <MoreVertical className="size-3.5" />
                        </button>

                        {isMenuOpen && (
                          <>
                            {/* Invisible overlay to close menu */}
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setActiveMenuConvId("")}
                            />
                            {/* Dropdown Card */}
                            <div className="absolute right-0 top-6 z-50 w-32 bg-white border border-slate-100 rounded-lg shadow-md py-1 text-left">
                              <button
                                onClick={(e) => startRename(conv.id, conv.title, e)}
                                className="w-full text-left px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                              >
                                <Edit className="size-3 text-slate-400" />
                                Rename
                              </button>
                              <button
                                onClick={(e) => handleTogglePin(conv.id, e)}
                                className="w-full text-left px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                              >
                                <Pin className="size-3 text-slate-400" />
                                {conv.isPinned ? "Unpin" : "Pin"}
                              </button>
                              <hr className="border-slate-50 my-0.5" />
                              <button
                                onClick={(e) => handleDeleteChat(conv.id, e)}
                                className="w-full text-left px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50/50 flex items-center gap-1.5"
                              >
                                <Trash2 className="size-3 text-rose-500" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                };

                return (
                  <>
                    {/* Pinned Section */}
                    {pinnedConvs.length > 0 && (
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                          <Pin className="size-2.5 text-slate-400 rotate-45" />
                          <span>Pinned</span>
                        </div>
                        {pinnedConvs.map(renderChatItem)}
                      </div>
                    )}

                    {/* Recent Section */}
                    <div className="space-y-0.5">
                      {pinnedConvs.length > 0 && regularConvs.length > 0 && (
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 mt-2">
                          <span>Recent</span>
                        </div>
                      )}
                      {regularConvs.map(renderChatItem)}
                    </div>

                    {conversations.length === 0 && (
                      <div className="px-2.5 py-3 text-[11px] text-slate-400 italic">
                        No conversations yet.
                      </div>
                    )}
                  </>
                );
              })()}
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
          onClick={() => {
            localStorage.setItem("mycroft_home_active_conv_id", "");
            window.dispatchEvent(new Event("mycroft_sync"));
          }}
          className={cn(
            "flex flex-1 h-10 items-center justify-center rounded-xl text-slate-500",
            pathname === "/product/home" && activeConvId === "" && "bg-blue-50 text-blue-600"
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
