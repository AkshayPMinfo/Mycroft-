import { ArrowRight, Bell, Bug, Cloud, Database, FileText, Folder, Gauge, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import type { Project } from "@/types/domain";
import { cn } from "@/lib/utils";

const accentClasses: Record<Project["accent"], string> = {
  blue: "bg-blue-100 text-primary",
  violet: "bg-violet-100 text-violet-600",
  orange: "bg-orange-100 text-orange-700"
};

export function ProjectCard({ project }: Readonly<{ project: Project }>) {
  const Icon = project.accent === "blue" ? Bell : project.accent === "violet" ? FileText : Gauge;
  return (
    <Card className="p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="mb-8 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={cn("flex size-12 items-center justify-center rounded-xl", accentClasses[project.accent])}>
            <Icon className="size-6" />
          </span>
          <div>
            <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">{project.name}</h3>
            <p className="text-sm font-medium text-slate-500">{project.subtitle}</p>
          </div>
        </div>
        <StatusBadge tone={project.status} dot={project.status !== "archived"}>
          {project.statusLabel}
        </StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#f0f2fb] p-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Deployment</p>
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            {project.deployment === "Supabase" ? <Database className="size-4" /> : project.deployment === "Local Only" ? <Folder className="size-4" /> : <Cloud className="size-4" />}
            {project.deployment}
          </p>
        </div>
        <div className="rounded-xl bg-[#f0f2fb] p-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Activity</p>
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Gauge className="size-4" />
            {project.activity}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-b pb-6">
        <p className={cn("flex items-center gap-2 text-sm font-semibold", project.openBugs > 0 ? "text-red-600" : "text-slate-900")}>
          <Bug className="size-5" />
          {project.openBugs} Open Bugs
        </p>
        <div className="flex -space-x-2">
          {project.stack.map((item) => (
            <span key={item} className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700 ring-2 ring-white">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-[#faf8ff] p-4">
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
          <Sparkles className="size-4" />
          Mycroft Suggests
        </p>
        <p className="leading-relaxed text-slate-600">{project.recommendation}</p>
      </div>
      <Button className="mt-4 w-full" variant="dark">
        Open Workspace
        <ArrowRight className="size-4" />
      </Button>
    </Card>
  );
}
