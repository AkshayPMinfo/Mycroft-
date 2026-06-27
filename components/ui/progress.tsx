import { cn } from "@/lib/utils";

const widthClasses = [
  "w-0",
  "w-[10%]",
  "w-[20%]",
  "w-[24%]",
  "w-[30%]",
  "w-[40%]",
  "w-[42%]",
  "w-[50%]",
  "w-[60%]",
  "w-[66%]",
  "w-[68%]",
  "w-[70%]",
  "w-[72%]",
  "w-[80%]",
  "w-[82%]",
  "w-[85%]",
  "w-[88%]",
  "w-[90%]",
  "w-[92%]",
  "w-full"
] as const;

function progressWidth(value: number) {
  if (value <= 0) return "w-0";
  if (value >= 100) return "w-full";
  const closest = widthClasses
    .filter((className) => className.startsWith("w-["))
    .map((className) => ({ className, width: Number(className.replace("w-[", "").replace("%]", "")) }))
    .reduce((best, current) => (Math.abs(current.width - value) < Math.abs(best.width - value) ? current : best));
  return closest.className;
}

export function Progress({
  value,
  className,
  indicatorClassName
}: Readonly<{ value: number; className?: string; indicatorClassName?: string }>) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-slate-200", className)}>
      <div className={cn("h-full rounded-full bg-primary transition-all", progressWidth(value), indicatorClassName)} />
    </div>
  );
}
