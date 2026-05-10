import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plug } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { AgpChart } from "~/components/charts/agp-chart";
import { Sparkline } from "~/components/charts/sparkline";
import { formatGlucose } from "~/lib/format";
import { getAgpFn, getGlucoseTraceFn } from "~/server/functions/data";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/_app/glucose")({
  component: GlucosePage,
  loader: async () => ({
    readings: await getGlucoseTraceFn(),
    agp: await getAgpFn(),
  }),
});

function GlucosePage() {
  const { readings, agp } = Route.useLoaderData();
  const empty = readings.length === 0;
  const peak = empty ? 0 : Math.max(...readings.map((r) => r.v));
  const low = empty ? 0 : Math.min(...readings.map((r) => r.v));
  const avg = empty ? 0 : readings.reduce((s, r) => s + r.v, 0) / readings.length;
  const sd = empty
    ? 0
    : Math.sqrt(readings.reduce((s, r) => s + (r.v - avg) ** 2, 0) / readings.length);
  const cv = avg > 0 ? Math.round((sd / avg) * 100) : 0;
  const inRange = empty
    ? 0
    : Math.round((readings.filter((r) => r.v >= 3.9 && r.v <= 10).length / readings.length) * 100);
  const below = empty
    ? 0
    : Math.round((readings.filter((r) => r.v < 3.9).length / readings.length) * 100);
  const above = empty
    ? 0
    : Math.round((readings.filter((r) => r.v > 10).length / readings.length) * 100);

  return (
    <>
      <PageTopbar
        title="Glucose"
        meta="trace · time-in-range"
        windows={["1h", "4h", "24h", "7d", "30d"]}
        activeWindow="24h"
      />
      <main className="grid gap-3 px-6 py-5">
        {empty ? (
          <article className="rounded-3xl border border-dashed border-border/60 bg-card/60 p-10 text-center">
            <Plug className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-3 text-2xl font-semibold tracking-tight" style={display}>
              No glucose readings yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect LibreLinkUp from the Settings → Data sources tab. We poll every minute and
              backfill the last 24 hours on first connection.
            </p>
            <Link
              to="/settings"
              search={{ tab: "sources" }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:bg-foreground/90"
            >
              Connect LibreLinkUp <ArrowUpRight className="size-3.5" />
            </Link>
          </article>
        ) : (
          <>
            <article className="rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
              <div className="flex items-baseline justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    24h trace · live
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight" style={display}>
                    Continuous reading
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground" style={mono}>
                  {readings.length} readings · target 3.9 – 10.0
                </span>
              </div>
              <div className="mt-5 h-56 text-emerald-500/85">
                <Sparkline
                  data={readings}
                  width={1200}
                  height={224}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="hsl(150 60% 55%)"
                  className="size-full"
                />
              </div>
              <div
                className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground"
                style={mono}
              >
                <span>−24h</span>
                <span>−18h</span>
                <span>−12h</span>
                <span>−6h</span>
                <span>now</span>
              </div>
            </article>

            <article className="rounded-3xl border border-emerald-500/20 bg-card/95 p-5 ring-1 ring-emerald-500/30 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                time in range · 24h
              </p>
              <p className="mt-3 text-5xl font-semibold tabular-nums" style={display}>
                {inRange}%
              </p>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full">
                <div
                  className="h-full"
                  style={{ width: `${below}%`, backgroundColor: "var(--color-glucose-low)" }}
                />
                <div
                  className="h-full"
                  style={{ width: `${inRange}%`, backgroundColor: "var(--color-glucose-in-range)" }}
                />
                <div
                  className="h-full"
                  style={{ width: `${above}%`, backgroundColor: "var(--color-glucose-high)" }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground" style={mono}>
                {below}% below · {above}% above
              </p>
            </article>

            {agp.totalReadings > 0 ? (
              <article className="rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                      style={mono}
                    >
                      AGP · 14 days
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight" style={display}>
                      Ambulatory Glucose Profile
                    </h2>
                  </div>
                  <span className="text-xs text-muted-foreground" style={mono}>
                    {agp.totalReadings} readings · 5/25/50/75/95 percentiles
                  </span>
                </div>
                <div className="mt-5 h-72 text-emerald-500/85">
                  <AgpChart bins={agp.bins} binMinutes={agp.binMinutes} className="size-full" />
                </div>
                <div
                  className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground"
                  style={mono}
                >
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground" style={mono}>
                  Bands: solid = 25–75 (IQR), faint = 5–95. Background bands at clinical thresholds
                  3.0/3.9/10/13.9 mmol·L. Descriptive view; not a prediction.
                </p>
              </article>
            ) : null}

            <article className="rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                statistics · 24h
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                <Stat label="Average" value={formatGlucose(avg)} unit="mmol" />
                <Stat label="Std dev" value={sd.toFixed(1)} unit="mmol" />
                <Stat label="CV" value={`${cv}%`} unit="variance" />
                <Stat label="Peak" value={peak.toFixed(1)} unit="mmol" />
                <Stat label="Low" value={low.toFixed(1)} unit="mmol" />
                <Stat label="Readings" value={readings.length.toString()} unit="last 24h" />
              </div>
            </article>
          </>
        )}
      </main>
    </>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-medium tabular-nums" style={display}>
        {value}
      </p>
      {unit ? (
        <p className="text-[10px] text-muted-foreground" style={mono}>
          {unit}
        </p>
      ) : null}
    </div>
  );
}
