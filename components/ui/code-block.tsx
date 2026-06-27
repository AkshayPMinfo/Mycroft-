import { cn } from "@/lib/utils";

export function CodeBlock({ code, className }: Readonly<{ code: string; className?: string }>) {
  return (
    <pre className={cn("overflow-x-auto rounded-lg bg-slate-950 p-5 text-sm leading-6 text-slate-200", className)}>
      <code>{code}</code>
    </pre>
  );
}
