import { ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";

type CriticalBug = {
  project: string;
  title: string;
  tone: "critical";
  icon: LucideIcon;
};

export function CriticalBugCards({ bugs }: Readonly<{ bugs: CriticalBug[] }>) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {bugs.map((bug) => {
        const Icon = bug.icon;
        return (
          <Card key={bug.title} className="border-red-200 p-6 shadow-none">
            <div className="mb-8 flex items-start justify-between">
              <StatusBadge tone="critical">{bug.project === "NotifyMe" ? "Critical" : "High Risk"}</StatusBadge>
              {bug.project === "NotifyMe" ? <Icon className="size-5 text-red-600" /> : <ShieldAlert className="size-5 text-red-600" />}
            </div>
            <p className="mb-2 text-sm font-semibold text-slate-500">{bug.project}</p>
            <h3 className="text-2xl font-bold leading-tight tracking-[-0.03em] text-slate-950">{bug.title}</h3>
          </Card>
        );
      })}
    </div>
  );
}
