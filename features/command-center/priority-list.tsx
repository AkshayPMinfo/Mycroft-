import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type PriorityTask = {
  label: string;
  done: boolean;
};

export function PriorityList({
  tasks,
  onToggle
}: Readonly<{ tasks: PriorityTask[]; onToggle?: (task: PriorityTask) => void }>) {
  return (
    <Card className="p-8">
      <div className="space-y-7">
        {tasks.map((task) => (
          <div key={task.label} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggle?.(task)}
              aria-pressed={task.done}
              aria-label={`${task.done ? "Reopen" : "Complete"} ${task.label}`}
              className={cn(
                "flex size-5 items-center justify-center rounded border border-slate-400",
                task.done && "border-primary bg-primary text-white"
              )}
            >
              {task.done ? <Check className="size-4" /> : null}
            </button>
            <span className="text-base text-slate-800">{task.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
