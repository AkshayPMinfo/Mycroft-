import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  action,
  eyebrow,
  className
}: Readonly<{ title: string; action?: React.ReactNode; eyebrow?: string; className?: string }>) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p> : null}
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-950">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
