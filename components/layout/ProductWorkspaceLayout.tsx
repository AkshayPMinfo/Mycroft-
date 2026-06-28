import { Sidebar } from "@/components/layout/sidebar";

export function ProductWorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f7f7fe]">
      <Sidebar />
      <main className="min-h-screen pb-20 lg:pb-0 lg:pl-[280px]">{children}</main>
    </div>
  );
}
