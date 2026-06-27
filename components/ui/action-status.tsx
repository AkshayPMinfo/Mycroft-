import { CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/lib/mock-api";
import { cn } from "@/lib/utils";

export function ActionStatus({
  result,
  className
}: Readonly<{ result?: ActionResult | null; className?: string }>) {
  if (!result) return null;

  return (
    <div
      className={cn("rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-slate-700", className)}
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-3">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="font-bold text-slate-950">{result.title}</p>
          <p className="mt-1 leading-6">{result.description}</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{result.timestamp}</p>
        </div>
      </div>
    </div>
  );
}
