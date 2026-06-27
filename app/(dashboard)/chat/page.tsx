import { Send } from "lucide-react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Button } from "@/components/ui/button";
import { CommandComposer } from "@/components/ui/command-composer";
import { Topbar } from "@/components/layout/topbar";
import { ChatBubble } from "@/features/chat/chat-bubble";
import { chatMessages, quickActions } from "@/data/mock";

export default function ChatPage() {
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
      />
      <AnimatedPage>
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[960px] flex-col px-5 py-12 lg:px-10">
          <div className="flex-1 space-y-12">
            {chatMessages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            <p className="ml-14 max-w-3xl leading-7 text-slate-500">
              This change should reduce request blocking during notification spikes. Should I generate the Pull Request for this change?
            </p>
          </div>
          <div className="sticky bottom-0 space-y-5 bg-[#f7f7fe]/90 pb-6 pt-4 backdrop-blur-xl">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button key={action} className="rounded-full border bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-primary hover:text-primary">
                  {action}
                </button>
              ))}
            </div>
            <div className="relative">
              <CommandComposer placeholder="Message Mycroft..." />
              <Button className="absolute right-3 top-2 size-10 rounded-xl p-0">
                <Send className="size-5" />
              </Button>
            </div>
            <p className="text-center text-xs text-slate-500">Mycroft PM can make mistakes. Verify important code before merging.</p>
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}
