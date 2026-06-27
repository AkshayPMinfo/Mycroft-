import { ArrowUp, Bot, Command, Mic, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CommandComposer({
  placeholder = "Ask Mycroft anything...",
  actionLabel,
  dark = false,
  compact = false
}: Readonly<{ placeholder?: string; actionLabel?: string; dark?: boolean; compact?: boolean }>) {
  return (
    <div
      className={cn(
        "flex h-14 items-center gap-3 rounded-[18px] border bg-white px-2 shadow-[0_18px_45px_rgba(20,34,71,0.1)]",
        compact && "h-12 rounded-2xl",
        dark && "border-slate-800 bg-slate-950 text-white"
      )}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white", dark && "bg-slate-800")}>
        {dark ? <Bot className="size-5" /> : <Sparkles className="size-5" />}
      </span>
      <input
        className={cn(
          "h-full min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0",
          dark && "text-white placeholder:text-slate-400"
        )}
        placeholder={placeholder}
      />
      <div className="hidden items-center gap-2 text-slate-400 sm:flex">
        <Paperclip className="size-4" />
        <Mic className="size-4" />
      </div>
      {actionLabel ? (
        <Button className="h-10 rounded-xl px-4" variant={dark ? "secondary" : "primary"}>
          {actionLabel}
        </Button>
      ) : (
        <button className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Command className="size-4" />
        </button>
      )}
      {!actionLabel && compact ? (
        <button className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-white">
          <ArrowUp className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
