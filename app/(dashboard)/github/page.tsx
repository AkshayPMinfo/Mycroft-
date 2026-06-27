"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Bot, Bug, Download, GitBranch, GitCommitVertical, MessageSquare, RefreshCw, Shield, UserRound } from "lucide-react";
import { ActionStatus } from "@/components/ui/action-status";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommandComposer } from "@/components/ui/command-composer";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { mycroftApi, type ActionResult } from "@/lib/mock-api";
import { cn } from "@/lib/utils";

export default function GitHubPage() {
  const data = useMemo(() => mycroftApi.github(), []);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);
  const { commits, pullRequests, recommendations, repository } = data;

  return (
    <>
      <Topbar
        breadcrumb={
          <span className="rounded-lg border bg-[#eef1fb] px-3 py-2">
            <span className="text-primary">▣</span> {repository.owner} / <strong>{repository.name}</strong>
          </span>
        }
        searchPlaceholder="Search repository..."
        onSearch={(query) => setActionResult(mycroftApi.actions.search("Repository", query))}
        onNotifications={() => setActionResult(mycroftApi.actions.viewAlerts())}
        onHelp={() => setActionResult(mycroftApi.actions.askMycroft("Opened GitHub Intelligence help."))}
      />
      <AnimatedPage>
        <div className="mx-auto max-w-[980px] px-5 py-9 lg:px-10">
          <ActionStatus result={actionResult} className="mb-6" />
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <StatusBadge tone="healthy">{repository.status}</StatusBadge>
                <span className="text-sm font-semibold text-slate-500">{repository.updated}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950">GitHub Intelligence</h1>
              <p className="mt-3 max-w-xl text-lg leading-8 text-slate-600">
                AI-powered repository analysis for core-engine. Code quality is currently trending upward by 12% this sprint.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setActionResult(mycroftApi.actions.exportReport())}>
                <Download className="size-4" />
                Export Report
              </Button>
              <Button onClick={() => setActionResult(mycroftApi.actions.rescanCodebase())}>
                <RefreshCw className="size-4" />
                Re-scan Codebase
              </Button>
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-[290px_1fr]">
            <Card className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Health Score</p>
                <Shield className="size-6 text-primary" />
              </div>
              <p className="text-5xl font-bold tracking-[-0.05em]">
                {repository.healthScore} <span className="text-2xl font-medium text-slate-600">/100</span>
              </p>
              <p className="mt-4 leading-7 text-slate-600">Excellent status. Your repository maintains high test coverage and low cyclomatic complexity.</p>
              <div className="mt-8 space-y-6">
                <div>
                  <div className="mb-3 flex justify-between text-sm font-semibold">
                    <span>Test Coverage</span>
                    <span>{repository.testCoverage}%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div>
                  <div className="mb-3 flex justify-between text-sm font-semibold">
                    <span>Maintainability</span>
                    <span>{repository.maintainability}</span>
                  </div>
                  <Progress value={88} indicatorClassName="bg-violet-500" />
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <SectionHeader
                title="Recent Commits"
                action={
                  <button type="button" onClick={() => setActionResult(mycroftApi.actions.viewCommits())} className="text-sm font-bold text-primary">
                    View all
                  </button>
                }
              />
              <div className="relative space-y-8 pl-16 before:absolute before:left-6 before:top-8 before:h-[calc(100%-64px)] before:w-px before:bg-slate-300">
                {commits.map((commit) => (
                  <div key={commit.id} className="relative">
                    <span
                      className={cn(
                        "absolute -left-16 flex size-10 items-center justify-center rounded-full",
                        commit.tone === "blue" && "bg-primary text-white",
                        commit.tone === "violet" && "bg-violet-100 text-violet-600",
                        commit.tone === "red" && "bg-red-100 text-red-600"
                      )}
                    >
                      {commit.tone === "red" ? <Bug className="size-5" /> : <GitCommitVertical className="size-5" />}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-950">{commit.title}</h3>
                      {commit.tag ? <StatusBadge tone="critical">{commit.tag}</StatusBadge> : null}
                      {!commit.tag ? <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">#{commit.id}</span> : null}
                    </div>
                    <p className="mt-2 leading-7 text-slate-600">{commit.summary}</p>
                    <p className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><UserRound className="size-4" /> {commit.author}</span>
                      <span>{commit.age}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.95fr]">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between bg-[#eef1fb] p-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.03em]">AI Review Insights</h2>
                  <p className="text-sm font-semibold text-slate-600">Active scanning of main branch</p>
                </div>
                <StatusBadge tone="info">Pro Scan</StatusBadge>
              </div>
              <div className="grid gap-7 p-8 md:grid-cols-[1fr_215px]">
                <div className="space-y-8">
                  <Insight title="Performance Bottleneck" body="Deeply nested loops detected in parser.ts. Estimated impact: 40ms CPU time per request." tone="orange" />
                  <Insight title="Security Recommendation" body="Update dependencies for fast-glob to address CVE-2024-21485." tone="blue" />
                </div>
                <div className="rounded-2xl bg-slate-950 p-6 text-white">
                  <p className="mb-5 flex items-center gap-2 text-sm"><span className="size-2 rounded-full bg-primary" /> Live Review Activity</p>
                  <Progress value={66} className="mb-5 bg-slate-700" indicatorClassName="bg-slate-200" />
                  <pre className="text-xs leading-6 text-slate-300">{"> Analyzing diff pr-241...\n> Identifying circular dependencies...\n> All tests passed.\nCode is deployable."}</pre>
                  <div className="mt-8 flex justify-between text-xs font-semibold text-slate-400">
                    <span>7,241 lines scanned</span>
                    <span className="text-white">Ready</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <SectionHeader title="Open Pull Requests" />
              <div className="space-y-4">
                {pullRequests.map((pr) => (
                  <div key={pr.number} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold leading-snug text-slate-950">{pr.title}</h3>
                      <StatusBadge tone={pr.status === "Draft" ? "healthy" : "info"}>{pr.status}</StatusBadge>
                    </div>
                    <p className="mt-3 flex items-center gap-4 text-sm font-semibold text-slate-500">
                      #{pr.number} opened by {pr.author}
                      <span className="flex items-center gap-1"><MessageSquare className="size-4" /> {pr.comments}</span>
                    </p>
                    <div className="mt-4 flex -space-x-2">
                      {pr.reviewers.map((reviewer) => (
                        <span key={reviewer} className="flex size-6 items-center justify-center rounded-full bg-[#eef1fb] text-[10px] font-bold text-slate-700 ring-2 ring-white">
                          {reviewer}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="mt-10">
            <SectionHeader title="Suggested Improvements" />
            <div className="grid gap-6 md:grid-cols-3">
              {recommendations.map((rec) => (
                <Card key={rec.id} className={cn("border-t-4 p-6", rec.tone === "orange" && "border-t-orange-700", rec.tone === "violet" && "border-t-violet-500", rec.tone === "blue" && "border-t-primary")}>
                  <span className="mb-8 flex size-11 items-center justify-center rounded-full bg-blue-100 text-primary">
                    <Bot className="size-5" />
                  </span>
                  <h3 className="mb-3 font-bold text-slate-950">{rec.title}</h3>
                  <p className="mb-5 text-sm leading-6 text-slate-600">{rec.body}</p>
                  <button
                    type="button"
                    onClick={() => setActionResult(mycroftApi.actions.applyRecommendation(rec.title))}
                    className="inline-flex items-center gap-1 text-sm font-bold text-primary"
                  >
                    {rec.action} <ArrowRight className="size-4" />
                  </button>
                </Card>
              ))}
            </div>
          </section>

          <div className="sticky bottom-4 mx-auto mt-6 max-w-[500px]">
            <CommandComposer
              placeholder="Ask Mycroft about your code..."
              submitLabel="Ask about code"
              statusLabel={actionResult?.title}
              onSubmit={(prompt) => setActionResult(mycroftApi.actions.askCodebase(prompt))}
            />
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}

function Insight({ title, body, tone }: Readonly<{ title: string; body: string; tone: "blue" | "orange" }>) {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-4">
      <span className={cn("flex size-10 items-center justify-center rounded-xl", tone === "blue" ? "bg-blue-100 text-primary" : "bg-orange-100 text-orange-700")}>
        {tone === "blue" ? <Shield className="size-5" /> : <GitBranch className="size-5" />}
      </span>
      <div>
        <h3 className="font-bold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    </div>
  );
}
