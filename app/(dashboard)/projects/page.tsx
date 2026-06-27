import { Sparkles } from "lucide-react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Card } from "@/components/ui/card";
import { CommandComposer } from "@/components/ui/command-composer";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { Topbar } from "@/components/layout/topbar";
import { ProjectCard } from "@/features/projects/project-card";
import { deployments, projects } from "@/data/mock";

export default function ProjectsPage() {
  return (
    <>
      <Topbar title="Projects" searchPlaceholder="Search projects..." />
      <AnimatedPage>
        <div className="mx-auto max-w-[980px] px-5 py-9 lg:px-10">
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950">Good morning, Alex.</h2>
          <p className="mt-3 text-lg text-slate-600">You have 4 active projects and 3 pending AI recommendations.</p>

          <section className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_290px]">
            <Card className="p-8">
              <SectionHeader title="Recent Deployments" action={<a className="text-sm font-bold text-primary">View History</a>} />
              <div className="space-y-6">
                {deployments.map((deployment) => {
                  const Icon = deployment.icon;
                  return (
                    <div key={deployment.name} className="flex items-center gap-4">
                      <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-950">{deployment.name}</p>
                        <p className="text-sm font-semibold text-slate-500">{deployment.detail}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-500">{deployment.age}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <span className="mb-7 flex size-16 items-center justify-center rounded-full bg-blue-100 text-primary">
                <Sparkles className="size-8" />
              </span>
              <h3 className="mb-3 text-2xl font-bold tracking-[-0.03em]">Weekly Efficiency</h3>
              <p className="mb-4 text-5xl font-bold tracking-[-0.05em] text-primary">+12%</p>
              <p className="mb-7 leading-relaxed text-slate-600">Your sprint velocity is increasing across 3 projects.</p>
              <Progress value={72} className="w-full" />
            </Card>
          </section>

          <div className="sticky bottom-4 mx-auto mt-6 max-w-[560px]">
            <CommandComposer placeholder="Tell Mycroft to fix a bug or deploy a project..." actionLabel="Run" />
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}
