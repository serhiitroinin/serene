import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AntiScopeFooter } from "~/components/app/anti-scope-footer";
import { AppSidebar } from "~/components/app/sidebar";
import { listSourcesFn } from "~/server/functions/sources";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  loader: () => listSourcesFn(),
});

function AppLayout() {
  const sources = Route.useLoaderData();
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(35% 50% at 0% 0%, color-mix(in oklch, oklch(0.74 0.14 160) 14%, transparent), transparent 75%), radial-gradient(35% 50% at 100% 100%, color-mix(in oklch, oklch(0.74 0.14 280) 12%, transparent), transparent 75%)",
        }}
      />
      <div className="relative grid flex-1 lg:grid-cols-[220px_1fr]">
        <AppSidebar sources={sources} />
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
      <AntiScopeFooter />
    </div>
  );
}
