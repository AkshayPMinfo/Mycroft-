import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { commandPriorities } from "@/data/mock";
import { cn } from "@/lib/utils";

export function PriorityList() {
  return (
    <Card className="p-8">
      <div className="space-y-7">
        {commandPriorities.map((task) => (
          <div key={task.label} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded border border-slate-400",
                task.done && "border-primary bg-primary text-white"
              )}
            >
              {task.done ? <Check className="size-4" /> : null}
            </span>
            <span className="text-base text-slate-800">{task.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
