import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: Readonly<{ className?: string; children: React.ReactNode }>) {
  return (
    <div className={cn("rounded-[22px] border border-border/80 bg-card shadow-card", className)}>
      {children}
    </div>
  );
}
