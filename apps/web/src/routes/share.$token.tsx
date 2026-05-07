import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Sparkline } from "~/components/charts/sparkline";
import { ThemeToggle } from "~/components/theme-toggle";
import { formatGlucose } from "~/lib/format";
import { getGlucoseTraceFn } from "~/server/functions/data";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/share/$token")({
  component: SharePage,
  loader: () => getGlucoseTraceFn(),
});

function SharePage() {
  const { token } = Route.useParams();
  const readings = Route.useLoaderData();
  const empty = readings.length === 0;
  const current = readings.at(-1);
  const inRange = empty
    ? 0
    : Math.round((readings.filter((r) => r.v >= 3.9 && r.v <= 10).length / readings.length) * 100);
  const avg = empty ? 0 : readings.reduce((s, r) => s + r.v, 0) / readings.length;

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(50% 60% at 30% 0%, color-mix(in oklch, oklch(0.74 0.14 160) 16%, transparent), transparent 75%), radial-gradient(40% 50% at 100% 100%, color-mix(in oklch, oklch(0.74 0.14 280) 12%, transparent), transparent 75%)",
        }}
      />

      <header className="relative">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-violet-400 text-xs font-bold text-white">
              s
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight" style={display}>
                serene
              </p>
              <p className="text-[11px] text-muted-foreground" style={mono}>
                shared by Serhii
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-6 pb-12">
        <div className="rounded-3xl border border-border/40 bg-card/90 p-8 backdrop-blur-xl">
          {empty ? (
            <p className="text-sm text-muted-foreground">
              Owner hasn't connected a glucose source yet.
            </p>
          ) : (
            <>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {readings.length} readings · last 24h
              </p>
              <p
                className="mt-6 flex items-baseline gap-2 text-7xl font-semibold tabular-nums leading-[0.85]"
                style={display}
              >
                {formatGlucose(current?.v ?? 0)}
                <span className="text-lg font-normal text-muted-foreground">mmol/L</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">target range 3.9 – 10.0 mmol/L</p>
              <div className="mt-6 h-32 text-emerald-500/85">
                <Sparkline
                  data={readings}
                  width={520}
                  height={128}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="hsl(150 60% 55%)"
                  className="size-full"
                />
              </div>
              <hr className="my-6 border-border/40" />
              <div className="grid grid-cols-3 gap-4">
                <Stat label="Time in range" value={`${inRange}%`} sub="last 24h" />
                <Stat label="Average" value={formatGlucose(avg)} sub="mmol/L · 24h" />
                <Stat label="Readings" value={readings.length.toString()} sub="last 24h" />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-border/60 bg-card/60 p-4 text-xs">
          <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <div className="text-muted-foreground">
            <p>Read-only view. Glucose only · no activity, recovery, or treatments.</p>
            <p className="mt-1" style={mono}>
              token <span className="text-foreground">{token.slice(0, 12)}…</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums" style={display}>
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground" style={mono}>
        {sub}
      </p>
    </div>
  );
}
