import { Topbar } from "@/components/layout/topbar";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" searchPlaceholder="Search settings..." />
      <AnimatedPage>
        <div className="mx-auto max-w-[980px] px-5 py-9 lg:px-10">
          <Card className="p-8">
            <h1 className="text-2xl font-bold tracking-[-0.03em]">Settings</h1>
            <p className="mt-3 text-slate-600">Frontend-only placeholder for product settings. Authentication and backend integrations are intentionally out of scope for this MVP.</p>
          </Card>
        </div>
      </AnimatedPage>
    </>
  );
}
