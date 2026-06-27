import { Bot, GitCompareArrows, UserRound } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import type { ChatMessage } from "@/types/domain";
import { cn } from "@/lib/utils";

export function ChatBubble({ message }: Readonly<{ message: ChatMessage }>) {
  const isAssistant = message.role === "assistant";
  return (
    <article className="grid grid-cols-[40px_1fr] gap-4">
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-full",
          isAssistant ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
        )}
      >
        {isAssistant ? <Bot className="size-5" /> : <UserRound className="size-5" />}
      </span>
      <div className="min-w-0 space-y-5">
        <p className="max-w-4xl text-base leading-8 text-slate-900">{message.content}</p>
        {message.code ? <CodeBlock code={message.code} /> : null}
        {message.diff ? (
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="flex items-center justify-between border-b bg-[#e9ebfb] px-4 py-2 text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-700">
                <GitCompareArrows className="size-4" />
                diff: {message.diff.file}
              </span>
              <span className="text-primary">
                {message.diff.additions} additions, {message.diff.deletions} deletion
              </span>
            </div>
            <div className="space-y-4 p-4 font-mono text-sm">
              {message.diff.lines.map((line) => (
                <p
                  key={line.text}
                  className={cn(
                    "rounded px-3 py-1.5",
                    line.type === "add" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-400"
                  )}
                >
                  {line.type === "add" ? "+" : "-"} {line.text}
                </p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
