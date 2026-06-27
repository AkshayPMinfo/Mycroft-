import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types/domain";

const toneClasses: Record<StatusTone, string> = {
  healthy: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
  neutral: "bg-slate-100 text-slate-600",
  info: "bg-blue-100 text-blue-700",
  archived: "bg-slate-200 text-slate-600"
};

export function StatusBadge({
  children,
  tone = "neutral",
  dot = false,
  className
}: Readonly<{
  children: React.ReactNode;
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
}>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-none",
        toneClasses[tone],
        className
      )}
    >
      {dot ? <span className="size-2 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
