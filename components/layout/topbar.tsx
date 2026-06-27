import { Bell, HelpCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function Topbar({
  title,
  breadcrumb,
  searchPlaceholder = "Search...",
  compact = false
}: Readonly<{
  title?: string;
  breadcrumb?: React.ReactNode;
  searchPlaceholder?: string;
  compact?: boolean;
}>) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-[#f7f7fe]/85 px-5 backdrop-blur-xl lg:px-10">
      <div className="min-w-0">
        {breadcrumb ? (
          <div className="truncate text-sm font-semibold text-slate-900">{breadcrumb}</div>
        ) : (
          <h1 className="truncate text-xl font-bold tracking-[-0.02em] text-slate-950">{title}</h1>
        )}
      </div>
      <div className="ml-4 flex items-center gap-4">
        {!compact ? (
          <label className="hidden h-10 w-[260px] items-center gap-2 rounded-full border bg-[#eef1fb] px-4 text-slate-500 md:flex">
            <Search className="size-4" />
            <input
              className="h-full w-full border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus:ring-0"
              placeholder={searchPlaceholder}
            />
          </label>
        ) : null}
        <button className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100">
          <Bell className="size-5" />
          <span className="absolute right-2 top-1 size-2 rounded-full bg-red-600" />
        </button>
        <button className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100">
          <HelpCircle className="size-5" />
        </button>
        <div className={cn("hidden size-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white md:flex", compact && "flex")}>
          AC
        </div>
      </div>
    </header>
  );
}
