import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-5xl font-semibold tracking-tight">serene</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          A designer-grade open-source dashboard for athletes with Type 1 Diabetes. Glucose
          alongside recovery and training.
        </p>
        <p className="text-sm text-zinc-500">Status: scaffolding · v0.1 · May 2026</p>
      </div>
    </main>
  );
}
