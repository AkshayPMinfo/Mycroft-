"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { ActionStatus } from "@/components/ui/action-status";
import { AnimatedPage } from "@/components/ui/animated-page";
import { CommandComposer } from "@/components/ui/command-composer";
import { Topbar } from "@/components/layout/topbar";
import { ChatBubble } from "@/features/chat/chat-bubble";
import { mycroftApi, type ActionResult } from "@/lib/mock-api";
import { supabaseApi } from "@/lib/supabase-api";
import { ChatMessage } from "@/types/domain";

export default function ChatPage() {
  const [data, setData] = useState<{ messages: ChatMessage[], quickActions: string[] } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [composerValue, setComposerValue] = useState("");
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);

  useEffect(() => {
    supabaseApi.chat.get().then(res => {
      setData(res);
      setMessages(res.messages);
    });
  }, []);

  async function sendMessage(value: string) {
    if (!value) return;
    
    // Generate local messages instantly for optimistic UI
    const userMessage = mycroftApi.actions.sendChatMessage(value);
    const assistantMessage = mycroftApi.actions.assistantReply(value);
    
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setComposerValue("");
    
    // Save to Supabase in the background
    await supabaseApi.chat.saveMessage(userMessage);
    await supabaseApi.chat.saveMessage(assistantMessage);

    setActionResult({
      action: "send-chat-message",
      title: "Message saved",
      description: "Chat history synchronized with Supabase.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
  }

  if (!data) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-slate-500">Loading chat history...</p>
      </div>
    );
  }

  return (
    <>
      <Topbar
        breadcrumb={
          <span>
            <span className="text-primary">Current Thread</span>
            <span className="mx-3 text-slate-400">/</span>
            Auth Notification Logic
          </span>
        }
        searchPlaceholder="Search knowledge base..."
        onSearch={(query) => setActionResult(mycroftApi.actions.search("Knowledge base", query))}
        onNotifications={() => setActionResult(mycroftApi.actions.viewAlerts())}
        onHelp={() => setActionResult(mycroftApi.actions.askMycroft("Opened Chat help."))}
      />
      <AnimatedPage>
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[960px] flex-col px-5 py-12 lg:px-10">
          <ActionStatus result={actionResult} className="mb-8" />
          <div className="flex-1 space-y-12">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            <p className="ml-14 max-w-3xl leading-7 text-slate-500">
              This change should reduce request blocking during notification spikes. Should I generate the Pull Request for this change?
            </p>
          </div>
          <div className="sticky bottom-0 space-y-5 bg-[#f7f7fe]/90 pb-6 pt-4 backdrop-blur-xl">
            <div className="flex flex-wrap gap-2">
              {data.quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => {
                    setComposerValue(action);
                    setActionResult(mycroftApi.actions.quickChatAction(action));
                  }}
                  className="rounded-full border bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-primary hover:text-primary"
                >
                  {action}
                </button>
              ))}
            </div>
            <div className="relative">
              <CommandComposer
                placeholder="Message Mycroft..."
                value={composerValue}
                onChange={setComposerValue}
                onSubmit={sendMessage}
                submitLabel="Send message"
                statusLabel={actionResult?.title}
              />
              <Send className="pointer-events-none absolute right-5 top-4 size-5 text-primary" aria-hidden="true" />
            </div>
            <p className="text-center text-xs text-slate-500">Mycroft PM can make mistakes. Verify important code before merging.</p>
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}
