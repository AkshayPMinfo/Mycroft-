"use client";

import { useMemo, useState } from "react";
import { Bell, Gauge, Sparkles } from "lucide-react";
import { ActionStatus } from "@/components/ui/action-status";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Card } from "@/components/ui/card";
import { CommandComposer } from "@/components/ui/command-composer";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { Topbar } from "@/components/layout/topbar";
import { CriticalBugCards } from "@/features/command-center/critical-bugs";
import { PriorityList, type PriorityTask } from "@/features/command-center/priority-list";
import { SummaryCard } from "@/features/command-center/summary-card";
import { mycroftApi, type ActionResult } from "@/lib/mock-api";
import { cn } from "@/lib/utils";

const accentClasses = {
  blue: "bg-primary text-white",
  violet: "bg-violet-500 text-white",
  orange: "bg-orange-100 text-orange-700"
};

export default function CommandCenterPage() {
  const data = useMemo(() => mycroftApi.commandCenter(), []);
  const [priorities, setPriorities] = useState<PriorityTask[]>(data.priorities);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);
  const activeProjects = data.projects.slice(0, 2);

  function handleTogglePriority(task: PriorityTask) {
    const nextDone = !task.done;
    setPriorities((current) => current.map((item) => (item.label === task.label ? { ...item, done: nextDone } : item)));
    setActionResult(mycroftApi.actions.togglePriority(task.label, nextDone));
  }

  return (
    <>
      <Topbar
        title="Command Center"
        searchPlaceholder="Search command center..."
        compact
        onNotifications={() => setActionResult(mycroftApi.actions.viewAlerts())}
        onHelp={() => setActionResult(mycroftApi.actions.askMycroft("Opened Command Center help."))}
      />
      <AnimatedPage>
        <div className="mx-auto max-w-[980px] px-5 py-9 lg:px-10">
          <h2 className="mb-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">Good morning, Alex.</h2>
          <ActionStatus result={actionResult} className="mb-5" />
          <SummaryCard />

          <section className="mt-12 grid gap-6 lg:grid-cols-[290px_1fr]">
            <div>
              <SectionHeader title="Today's Priorities" action={<span className="text-sm font-semibold text-slate-500">{priorities.length} Tasks</span>} />
              <PriorityList tasks={priorities} onToggle={handleTogglePriority} />
            </div>
            <div>
              <SectionHeader
                title="Critical Bugs"
                action={
                  <button type="button" onClick={() => setActionResult(mycroftApi.actions.viewAlerts())} className="text-sm font-bold text-primary">
                    View All Alerts
                  </button>
                }
              />
              <CriticalBugCards bugs={data.criticalBugs} />
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader title="Active Projects" />
            <div className="grid gap-6 lg:grid-cols-3">
              {activeProjects.map((project) => {
                const Icon = project.accent === "blue" ? Bell : Gauge;
                return (
                  <Card key={project.id} className="p-6">
                    <div className="mb-8 flex items-start justify-between">
                      <span className={cn("flex size-12 items-center justify-center rounded-xl", accentClasses[project.accent])}>
                        <Icon className="size-6" />
                      </span>
                      <span className="text-sm font-semibold text-slate-500">{project.updated}</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">{project.name}</h3>
                    <p className="mt-3 min-h-[54px] leading-relaxed text-slate-600">{project.subtitle === "Funded Jobs AI" ? "Real-time engagement infrastructure for consumer apps." : "Algorithmic recruitment funnel for executive search firms."}</p>
                    <div className="mt-5 flex items-center justify-between text-sm font-bold">
                      <span>Development</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="mt-3" indicatorClassName={project.accent === "violet" ? "bg-violet-500" : undefined} />
                  </Card>
                );
              })}
              <Card className="flex min-h-[260px] flex-col items-center justify-center border-dashed border-blue-200 bg-blue-50/50 p-8 text-center shadow-none">
                <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-white text-primary">
                  <Sparkles className="size-6" />
                </span>
                <h3 className="mb-3 text-2xl font-bold tracking-[-0.03em] text-primary">AI Recommendation</h3>
                <p className="mb-6 leading-relaxed text-slate-600">
                  Based on GitHub activity, Mycroft suggests archiving 4 stale branches in NotifyMe to reduce CI/CD overhead.
                </p>
                <button
                  type="button"
                  onClick={() => setActionResult(mycroftApi.actions.optimizeRepository())}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Optimize Repository
                </button>
              </Card>
            </div>
          </section>

          <div className="sticky bottom-4 mx-auto mt-6 max-w-[640px]">
            <CommandComposer
              placeholder="Ask Mycroft anything..."
              submitLabel="Ask Mycroft"
              statusLabel={actionResult?.title}
              onSubmit={(prompt) => setActionResult(mycroftApi.actions.askMycroft(prompt))}
            />
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}
