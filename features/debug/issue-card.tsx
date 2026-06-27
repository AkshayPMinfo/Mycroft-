import { FileTerminal, WandSparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import type { DebugIssue } from "@/types/domain";
import { cn } from "@/lib/utils";

export function IssueCard({
  issue,
  onGenerateFix,
  onOpenLogs
}: Readonly<{
  issue: DebugIssue;
  onGenerateFix?: (issue: DebugIssue) => void;
  onOpenLogs?: (issue: DebugIssue) => void;
}>) {
  return (
    <Card className="relative overflow-hidden p-0">
      <div className={cn("absolute inset-y-0 left-0 w-1.5", issue.color === "red" ? "bg-red-600" : "bg-orange-600")} />
      <div className="grid gap-8 p-8 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge tone={issue.severity === "critical" ? "critical" : "warning"}>
              {issue.severity === "critical" ? "Critical" : "Medium"}
            </StatusBadge>
            <span className="text-sm font-semibold text-slate-500">ID: {issue.id}</span>
            <span className="text-sm font-semibold text-slate-500">• {issue.age}</span>
          </div>
          <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">{issue.title}</h3>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">{issue.explanation}</p>
          <div className="mt-5 rounded-xl border bg-[#f0f2fb] p-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Root Cause Analysis</p>
            <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-slate-700">{issue.rootCause.join("\n")}</pre>
          </div>
        </div>
        <aside className="flex flex-col border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <Wrench className="size-4" />
            Suggested Fix
          </p>
          <p className="leading-7 text-slate-600">{issue.suggestedFix}</p>
          <div className="mt-auto space-y-3 pt-8">
            <Button className="w-full" onClick={() => onGenerateFix?.(issue)}>
              <WandSparkles className="size-4" />
              Generate Fix
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => onOpenLogs?.(issue)}>
              <FileTerminal className="size-4" />
              Open Logs
            </Button>
          </div>
        </aside>
      </div>
    </Card>
  );
}
