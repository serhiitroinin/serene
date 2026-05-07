import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "~/components/app/sidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(35% 50% at 0% 0%, color-mix(in oklch, oklch(0.74 0.14 160) 14%, transparent), transparent 75%), radial-gradient(35% 50% at 100% 100%, color-mix(in oklch, oklch(0.74 0.14 280) 12%, transparent), transparent 75%)",
        }}
      />
      <div className="relative grid lg:grid-cols-[220px_1fr]">
        <AppSidebar />
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
