"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, Bot, Command, Mic, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CommandComposer({
  placeholder = "Ask Mycroft anything...",
  actionLabel,
  dark = false,
  compact = false,
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  submitLabel,
  statusLabel,
  disabled = false
}: Readonly<{
  placeholder?: string;
  actionLabel?: string;
  dark?: boolean;
  compact?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  submitLabel?: string;
  statusLabel?: string;
  disabled?: boolean;
}>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  function updateValue(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    onSubmit?.(currentValue.trim());
    if (value === undefined) {
      setInternalValue("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={submitLabel ?? actionLabel ?? placeholder}
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
        aria-label={placeholder}
        value={currentValue}
        disabled={disabled}
        onChange={(event) => updateValue(event.target.value)}
      />
      <div className="hidden items-center gap-2 text-slate-400 sm:flex">
        <button type="button" aria-label="Attach file" className="rounded-md p-1 transition hover:bg-slate-100 hover:text-slate-600">
          <Paperclip className="size-4" />
        </button>
        <button type="button" aria-label="Use microphone" className="rounded-md p-1 transition hover:bg-slate-100 hover:text-slate-600">
          <Mic className="size-4" />
        </button>
      </div>
      {actionLabel ? (
        <Button type="submit" className="h-10 rounded-xl px-4" variant={dark ? "secondary" : "primary"} disabled={disabled}>
          {actionLabel}
        </Button>
      ) : (
        <button
          type="submit"
          aria-label={submitLabel ?? "Submit command"}
          disabled={disabled}
          className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Command className="size-4" />
        </button>
      )}
      {!actionLabel && compact ? (
        <button
          type="submit"
          aria-label={submitLabel ?? "Send command"}
          disabled={disabled}
          className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowUp className="size-4" />
        </button>
      ) : null}
      {statusLabel ? <span className="sr-only" aria-live="polite">{statusLabel}</span> : null}
    </form>
  );
}
