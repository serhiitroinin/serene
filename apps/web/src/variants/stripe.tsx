import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from "~/components/ui/map";
import {
  formatClock,
  formatDistance,
  formatDuration,
  formatGlucose,
  formatPace,
  mockData,
  ROUTE_CENTER,
} from "./shared";
import { Sparkline } from "./sparkline";

const editorial = { fontFamily: "var(--font-serif-editorial)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function StripeVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-4">
          <div className="flex items-center gap-7">
            <span className="flex items-center gap-2 text-base font-semibold tracking-tight">
              <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
                s
              </span>
              serene
            </span>
            <nav className="hidden gap-1 text-sm md:flex">
              {["Today", "Glucose", "Activity", "Recovery", "Treatments", "Reports"].map((n, i) => (
                <button
                  key={n}
                  type="button"
                  className={`rounded-md px-3 py-1.5 ${
                    i === 0
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-xs text-muted-foreground sm:inline" style={mono}>
              live · synced {formatClock(Date.now() - 60_000)}
            </span>
            <button
              type="button"
              className="rounded-md border border-border/60 px-3 py-1.5 text-sm hover:bg-muted/40"
            >
              Share
            </button>
            <button
              type="button"
              className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:bg-foreground/90"
            >
              Export report
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-8 py-10">
        <section className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-indigo-500/8 via-card to-violet-500/5 p-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                In range · stable · 4 min ago
              </p>
              <h1 className="mt-6 text-7xl font-semibold tracking-tight" style={editorial}>
                <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
                <span className="ml-3 text-2xl font-normal text-muted-foreground">mmol/L</span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Glucose is steady inside the target band. Time-in-range posted{" "}
                <span className="text-foreground">{tir.inRange}%</span> across the day, with the
                only excursion driven by a {formatDistance(workout.distance)} run before sunrise.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:bg-foreground/90"
                >
                  Open glucose detail <ArrowUpRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-border/60 px-4 py-2 text-sm hover:bg-muted/40"
                >
                  View today's run <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-border/40 bg-card/60 p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)] backdrop-blur">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Last 24 hours
                </p>
                <div className="mt-4 h-32">
                  <Sparkline
                    data={glucose.last24h}
                    width={420}
                    height={128}
                    showRangeBand
                    strokeColor="hsl(245 70% 60%)"
                    bandColor="hsl(245 70% 60%)"
                    className="size-full"
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <Pill label="In range" value={`${tir.inRange}%`} tone="ok" />
                  <Pill label="Below" value={`${tir.below}%`} tone="warn" />
                  <Pill label="Above" value={`${tir.above}%`} tone="alt" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-12">
          <article className="lg:col-span-7 overflow-hidden rounded-2xl border border-border/40 bg-card">
            <header className="flex items-baseline justify-between p-6 pb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Today's run
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight" style={editorial}>
                  {formatDistance(workout.distance)} ·{" "}
                  {formatPace(workout.duration, workout.distance)}
                </h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Open run <ArrowUpRight className="size-3.5" />
              </button>
            </header>
            <div className="aspect-[16/8] w-full">
              <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                <MapRoute coordinates={coords} color="#6366f1" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[11px] font-semibold text-white shadow-md ring-2 ring-white/80">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-indigo-500 text-[11px] font-semibold text-white shadow-md ring-2 ring-white/80">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 gap-px bg-border/40">
              <Field label="Distance" value={formatDistance(workout.distance)} />
              <Field label="Duration" value={formatDuration(workout.duration)} />
              <Field label="Avg HR" value={`${workout.avgHr} bpm`} />
              <Field label="ΔBG" value={`${workout.glucoseDelta.toFixed(1)} mmol`} accent />
            </div>
          </article>

          <aside className="lg:col-span-5 grid gap-6">
            <Card title="Recovery">
              <p className="text-5xl font-semibold tabular-nums" style={editorial}>
                {recovery.score}
                <span className="ml-1 text-base font-normal text-muted-foreground">/ 100</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                slept {recovery.sleep}h · HRV {recovery.hrv}ms
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  style={{ width: `${recovery.score}%` }}
                />
              </div>
            </Card>

            <Card title="Today's stats">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Stat label="Average" value={`${formatGlucose(today.avg)} mmol`} />
                <Stat label="GMI" value={today.gmi.toFixed(1)} />
                <Stat label="Std deviation" value={today.sd.toFixed(1)} />
                <Stat label="Coefficient of variation" value={`${today.cv}%`} />
                <Stat label="Readings" value={today.readings.toString()} />
                <Stat label="Sensor uptime" value="99.6%" />
              </div>
            </Card>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-12">
          <article className="lg:col-span-7 rounded-2xl border border-border/40 bg-card">
            <header className="flex items-baseline justify-between p-6 pb-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Treatments timeline
                </p>
                <h3 className="mt-1 text-lg font-medium" style={editorial}>
                  {treatments.length} events today
                </h3>
              </div>
              <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                View all
              </button>
            </header>
            <ol className="divide-y divide-border/40">
              {treatments.slice(0, 7).map((t) => (
                <li
                  key={t.t}
                  className="grid items-center gap-4 px-6 py-3 text-sm"
                  style={{ gridTemplateColumns: "60px 28px 1fr auto" }}
                >
                  <span className="tabular-nums text-muted-foreground" style={mono}>
                    {formatClock(t.t)}
                  </span>
                  <span
                    className={`grid size-6 place-items-center rounded-full text-xs font-medium ${kindBadge(t.kind)}`}
                  >
                    {kindLetter(t.kind)}
                  </span>
                  <span>{t.label}</span>
                  <span className="tabular-nums text-muted-foreground" style={mono}>
                    {t.detail ?? ""}
                  </span>
                </li>
              ))}
            </ol>
          </article>

          <aside className="lg:col-span-5 rounded-2xl border border-border/40 bg-card p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Weekly time-in-range
            </p>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-2">
                  <div className="grid h-24 w-full place-items-end overflow-hidden rounded-md bg-muted">
                    <div
                      className="w-full rounded-md"
                      style={{
                        height: `${d.inRange}%`,
                        background: "linear-gradient(180deg, hsl(245 70% 65%), hsl(245 70% 50%))",
                      }}
                    />
                  </div>
                  <p
                    className="text-[10px] uppercase tracking-wider text-muted-foreground"
                    style={mono}
                  >
                    {d.weekday[0]}
                  </p>
                  <p className="text-xs tabular-nums" style={mono}>
                    {d.inRange}
                  </p>
                </div>
              ))}
            </div>
            <hr className="my-5 border-border/40" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Recent runs</p>
            <ul className="mt-3 space-y-3 text-sm">
              {recentWorkouts.slice(0, 4).map((w) => (
                <li key={w.id} className="flex items-baseline justify-between">
                  <div>
                    <p className="font-medium">
                      {w.sport} · {formatDistance(w.distance)}
                    </p>
                    <p className="text-xs text-muted-foreground" style={mono}>
                      {w.date} · {formatPace(w.duration, w.distance)}
                    </p>
                  </div>
                  <span className="text-xs tabular-nums" style={mono}>
                    <span
                      style={{
                        color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "var(--color-glucose-high)",
                      }}
                    >
                      Δ {w.glucoseDelta > 0 ? "+" : ""}
                      {w.glucoseDelta.toFixed(1)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-6">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Pill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "alt";
}) {
  const cls =
    tone === "ok"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300";
  return (
    <div className={`rounded-lg border ${cls} px-3 py-2`}>
      <p className="text-[10px] uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums" style={mono}>
        {value}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 tabular-nums" style={mono}>
        {value}
      </p>
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card px-5 py-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-lg tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}
        style={mono}
      >
        {value}
      </p>
    </div>
  );
}

function kindBadge(kind: string): string {
  switch (kind) {
    case "insulin":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-300";
    case "carbs":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "exercise":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
