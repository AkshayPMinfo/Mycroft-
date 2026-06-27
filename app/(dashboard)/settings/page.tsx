"use client";

import { useMemo, useState } from "react";
import { Bell, BrainCircuit, CheckCircle2, PlugZap, Save } from "lucide-react";
import { ActionStatus } from "@/components/ui/action-status";
import { Topbar } from "@/components/layout/topbar";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { mycroftApi, type ActionResult } from "@/lib/mock-api";

export default function SettingsPage() {
  const data = useMemo(() => mycroftApi.settings(), []);
  const [preferences, setPreferences] = useState(data.preferences);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);

  function togglePreference(id: string) {
    setPreferences((current) => current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  }

  return (
    <>
      <Topbar
        title="Settings"
        searchPlaceholder="Search settings..."
        onSearch={(query) => setActionResult(mycroftApi.actions.search("Settings", query))}
        onNotifications={() => setActionResult(mycroftApi.actions.viewAlerts())}
        onHelp={() => setActionResult(mycroftApi.actions.askMycroft("Opened Settings help."))}
      />
      <AnimatedPage>
        <div className="mx-auto max-w-[980px] px-5 py-9 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950">Settings</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
                Local product preferences and integration readiness. All values are mock-only until OpenClaw integration begins.
              </p>
            </div>
            <Button onClick={() => setActionResult(mycroftApi.actions.saveSettings())}>
              <Save className="size-4" />
              Save Settings
            </Button>
          </div>

          <ActionStatus result={actionResult} className="mb-6" />

          <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card className="p-8">
              <SectionHeader title="Product Preferences" />
              <div className="space-y-4">
                {preferences.map((preference) => (
                  <label key={preference.id} className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border bg-white p-4 transition hover:border-primary">
                    <span className="flex items-start gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary">
                        {preference.id === "memory" ? <BrainCircuit className="size-5" /> : <Bell className="size-5" />}
                      </span>
                      <span>
                        <span className="block font-bold text-slate-950">{preference.label}</span>
                        <span className="mt-1 block text-sm leading-6 text-slate-600">{preference.description}</span>
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      className="size-5 rounded border-slate-300 text-primary focus:ring-primary"
                      checked={preference.enabled}
                      onChange={() => togglePreference(preference.id)}
                    />
                  </label>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <SectionHeader title="Integration Readiness" />
              <div className="space-y-4">
                {data.integrations.map((integration) => (
                  <div key={integration.id} className="rounded-2xl border bg-white p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3 font-bold text-slate-950">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <PlugZap className="size-4" />
                        </span>
                        {integration.label}
                      </span>
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    </div>
                    <StatusBadge tone={integration.id === "openclaw" ? "info" : "neutral"}>{integration.status}</StatusBadge>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </AnimatedPage>
    </>
  );
}
