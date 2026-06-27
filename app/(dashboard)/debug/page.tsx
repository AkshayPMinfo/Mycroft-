import { SlidersHorizontal } from "lucide-react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Card } from "@/components/ui/card";
import { CommandComposer } from "@/components/ui/command-composer";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { IssueCard } from "@/features/debug/issue-card";
import { debugIssues, nodePerformance, systemMetrics } from "@/data/mock";

export default function DebugPage() {
  return (
    <>
      <Topbar title="Debug Center" searchPlaceholder="Search logs..." />
      <AnimatedPage>
        <div className="mx-auto max-w-[980px] px-5 py-9 lg:px-10">
          <section className="grid gap-6 md:grid-cols-3">
            {systemMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className="p-6">
                  <div className="mb-9 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <h2 className="text-2xl font-bold tracking-[-0.03em]">{metric.label}</h2>
                    </div>
                    <StatusBadge tone={metric.status} dot>
                      {metric.status === "critical" ? "Degraded" : "Healthy"}
                    </StatusBadge>
                  </div>
                  <p className="text-base text-slate-700">{metric.value}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{metric.detail}</p>
                </Card>
              );
            })}
          </section>

          <section className="mt-12">
            <SectionHeader
              title="Current Issues"
              action={
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  Sorted by Severity
                  <SlidersHorizontal className="size-4" />
                </span>
              }
            />
            <div className="space-y-6">
              {debugIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionHeader title="Node Performance" />
            <Card className="overflow-hidden">
              <div className="grid grid-cols-[1.2fr_1fr_1.2fr_100px] bg-[#eef1fb] px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <span>Resource</span>
                <span>Type</span>
                <span>Usage</span>
                <span>Last Sync</span>
              </div>
              {nodePerformance.map((node) => (
                <div key={node.resource} className="grid grid-cols-[1.2fr_1fr_1.2fr_100px] items-center border-t px-8 py-5 text-sm">
                  <span className="flex items-center gap-3 font-bold text-slate-950">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    {node.resource}
                  </span>
                  <span className="text-slate-600">{node.type}</span>
                  <Progress value={node.usage} indicatorClassName={node.usage > 75 ? "bg-orange-600" : undefined} />
                  <span className="text-slate-500">{node.lastSync}</span>
                </div>
              ))}
            </Card>
          </section>

          <div className="sticky bottom-4 mx-auto mt-6 max-w-[680px]">
            <CommandComposer placeholder="Ask Mycroft to analyze current system state..." compact />
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}
