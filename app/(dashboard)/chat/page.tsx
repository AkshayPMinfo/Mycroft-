"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { ActionStatus } from "@/components/ui/action-status";
import { AnimatedPage } from "@/components/ui/animated-page";
import { CommandComposer } from "@/components/ui/command-composer";
import { Topbar } from "@/components/layout/topbar";
import { ChatBubble } from "@/features/chat/chat-bubble";
import { mycroftApi, type ActionResult } from "@/lib/mock-api";

export default function ChatPage() {
  const data = useMemo(() => mycroftApi.chat(), []);
  const [messages, setMessages] = useState(data.messages);
  const [composerValue, setComposerValue] = useState("");
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);

  function sendMessage(value: string) {
    if (!value) return;
    const userMessage = mycroftApi.actions.sendChatMessage(value);
    const assistantMessage = mycroftApi.actions.assistantReply(value);
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setComposerValue("");
    setActionResult({
      action: "send-chat-message",
      title: "Message sent",
      description: "A local mock response was generated.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
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
