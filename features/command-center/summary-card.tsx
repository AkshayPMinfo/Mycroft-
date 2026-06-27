import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SummaryCard() {
  return (
    <Card className="flex gap-4 p-6 shadow-soft">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary">
        <Sparkles className="size-6" />
      </span>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">Executive Summary</p>
        <p className="max-w-4xl text-lg leading-8 text-slate-800">
          Today looks productive. NotifyMe is 85% complete with 2 minor blockers. JD Optimise has seen a 12% performance gain
          overnight after your last merge. There are <span className="font-semibold text-red-600">3 critical bugs</span> requiring
          attention before the 4 PM deployment.
        </p>
      </div>
    </Card>
  );
}
