import { Bot, BrainCircuit, Cpu, Flag, Lightbulb, Sparkles } from "lucide-react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Card } from "@/components/ui/card";
import { CommandComposer } from "@/components/ui/command-composer";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { architectureNotes, learnings, longTermGoals, memoryDecisions } from "@/data/mock";
import { cn } from "@/lib/utils";

export default function MemoryPage() {
  return (
    <>
      <Topbar
        breadcrumb={
          <span className="flex items-center gap-2">
            <BrainCircuit className="size-4 text-primary" />
            Digital Brain / Memory
          </span>
        }
        searchPlaceholder="Recall a memory..."
      />
      <AnimatedPage>
        <div className="relative mx-auto max-w-[980px] overflow-hidden px-5 py-11 lg:px-10">
          <h1 className="text-4xl font-bold tracking-[-0.05em] text-slate-950">System Memory</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Every decision, architectural pivot, and technical learning captured by Mycroft PM. Organized for instant recall.
          </p>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeader title="Project Decisions" action={<StatusBadge tone="neutral">14 Entries</StatusBadge>} />
              <div className="space-y-8">
                {memoryDecisions.map((entry) => (
                  <MemoryText key={entry.id} title={entry.title} body={entry.body} meta={entry.meta} project={entry.project} />
                ))}
              </div>
            </div>
            <div>
              <SectionHeader title="Architecture Notes" action={<StatusBadge tone="neutral">8 Docs</StatusBadge>} />
              <div className="space-y-4">
                {architectureNotes.map((entry, index) => (
                  <Card key={entry.id} className="flex gap-4 p-5 shadow-none">
                    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", index === 0 ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-primary")}>
                      {index === 0 ? <Cpu className="size-5" /> : <Bot className="size-5" />}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-950">{entry.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{entry.body}</p>
                      <p className="mt-2 text-xs font-semibold text-slate-400">{entry.meta}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeader title="Recent Learnings" action={<StatusBadge tone="neutral">New +3</StatusBadge>} />
              <Card className="bg-[#eef1fb] p-7 shadow-none">
                <div className="space-y-6">
                  {learnings.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-[12px_1fr] gap-4">
                      <span className="mt-2 size-1.5 rounded-full bg-orange-700" />
                      <div>
                        <h3 className="font-bold text-slate-950">{entry.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{entry.body}</p>
                        <p className="mt-1 text-xs text-slate-400">{entry.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <SectionHeader title="Long-term Goals" />
              <div className="space-y-4">
                {longTermGoals.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <Card key={goal.title} className={cn("p-6", goal.dark && "border-slate-950 bg-slate-950 text-white")}>
                      <div className="mb-8 flex items-center justify-between">
                        <p className={cn("text-xs font-bold uppercase tracking-[0.16em]", goal.dark ? "text-slate-400" : "text-slate-500")}>{goal.label}</p>
                        <Icon className={cn("size-5", goal.dark ? "text-slate-500" : "text-slate-300")} />
                      </div>
                      <h3 className="font-bold">{goal.title}</h3>
                      <p className={cn("mt-3 text-sm leading-6", goal.dark ? "text-slate-300" : "text-slate-600")}>{goal.body}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="mx-auto mt-8 max-w-[520px]">
            <CommandComposer placeholder="Ask Mycroft anything about your memories..." actionLabel="Ask" />
          </div>

          <div className="mt-16 border-t pt-10">
            <div className="mx-auto mb-8 flex max-w-[520px] items-center gap-4 rounded-2xl border bg-white p-4 shadow-card">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                <Sparkles className="size-5" />
              </span>
              <p className="min-w-0 flex-1 text-sm font-semibold text-slate-500">Add to memory: Decided to use Framer Motion for animations...</p>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-400">⌘ K</span>
            </div>
            <div className="mx-auto grid max-w-[470px] grid-cols-3 divide-x text-center">
              <MemoryStat value="92%" label="Retention" tone="text-primary" />
              <MemoryStat value="1.2k" label="Tokens Synced" tone="text-violet-600" />
              <MemoryStat value="24" label="Active Projects" tone="text-orange-700" />
            </div>
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}

function MemoryText({ title, body, meta, project }: Readonly<{ title: string; body: string; meta: string; project?: string }>) {
  return (
    <div className="relative pl-4">
      <h3 className="font-bold text-slate-950">{title}</h3>
      <span className="absolute right-0 top-0 text-xs font-semibold uppercase text-slate-400">{meta}</span>
      <p className="mt-3 max-w-sm text-sm font-semibold leading-6 text-slate-600">{body}</p>
      {project ? <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-primary">Project: {project}</p> : null}
    </div>
  );
}

function MemoryStat({ value, label, tone }: Readonly<{ value: string; label: string; tone: string }>) {
  return (
    <div>
      <p className={cn("text-4xl font-bold tracking-[-0.05em]", tone)}>{value}</p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
    </div>
  );
}
