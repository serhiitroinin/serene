import { ArrowRight, Heart, MapPin, Moon, Plus } from "lucide-react";
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
const body = { fontFamily: "var(--font-body-soft)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function PulseVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="min-h-dvh" style={body}>
      <div className="bg-gradient-to-br from-teal-50 via-background to-indigo-50/40 dark:from-teal-950/30 dark:via-background dark:to-indigo-950/30">
        <header className="mx-auto flex max-w-[1180px] items-center justify-between px-8 py-6">
          <div className="flex items-baseline gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-teal-600 text-sm font-bold text-white">
              s
            </span>
            <h1 className="text-xl font-medium tracking-tight" style={editorial}>
              serene
            </h1>
          </div>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            {["Today", "Glucose", "Activity", "Recovery", "Insights"].map((n, i) => (
              <button
                key={n}
                type="button"
                className={
                  i === 0
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                {n}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Plus className="size-3.5" /> Log event
          </button>
        </header>

        <main className="mx-auto max-w-[1180px] px-8 pb-16">
          <section className="mt-4 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-sm uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                {new Date().toLocaleDateString("en-US", { weekday: "long" })} · 7 May
              </p>
              <h2
                className="mt-3 text-5xl font-medium leading-[1.05] tracking-tight"
                style={editorial}
              >
                Glucose held its line.{" "}
                <span className="text-muted-foreground">
                  A 14-kilometre run drew it down briefly; a recovery shake walked it back.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-border/40 bg-card/60 p-6 backdrop-blur">
                <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-muted-foreground">
                  <span>Right now</span>
                  <span className="text-emerald-600 dark:text-emerald-400">in range · stable</span>
                </div>
                <p className="mt-3 flex items-baseline gap-2" style={editorial}>
                  <span className="text-7xl font-medium tabular-nums tracking-tight">
                    {formatGlucose(glucose.current)}
                  </span>
                  <span className="text-base font-normal text-muted-foreground">mmol/L</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">last reading 4 minutes ago</p>
                <div className="mt-5 h-20 text-teal-700 dark:text-teal-300">
                  <Sparkline
                    data={glucose.last24h}
                    width={420}
                    height={80}
                    showRangeBand
                    strokeColor="currentColor"
                    bandColor="rgb(13 148 136)"
                    className="size-full"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-3 lg:grid-cols-4">
            <Stat label="Time in range" value={`${tir.inRange}%`} sub="last 24 hours" tone="teal" />
            <Stat
              label="Average"
              value={formatGlucose(today.avg)}
              unit="mmol/L"
              sub={`GMI ${today.gmi.toFixed(1)}`}
              tone="indigo"
            />
            <Stat
              label="Recovery"
              value={`${recovery.score}`}
              unit="/ 100"
              sub={`slept ${recovery.sleep}h · HRV ${recovery.hrv}ms`}
              tone="rose"
            />
            <Stat
              label="Today's strain"
              value={recovery.strain.toFixed(1)}
              sub={`avg HR ${workout.avgHr} during ${formatDistance(workout.distance)} run`}
              tone="amber"
            />
          </section>
        </main>
      </div>

      <section className="mx-auto max-w-[1180px] px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-7 overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/40">
            <header className="flex items-baseline justify-between p-6 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Today's run
                </p>
                <h3 className="mt-1 text-2xl font-medium tracking-tight" style={editorial}>
                  {formatDistance(workout.distance)} · Vondelpark loop
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1.5 text-xs"
              >
                Open <ArrowRight className="size-3" />
              </button>
            </header>
            <div className="aspect-[16/8]">
              <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                <MapRoute coordinates={coords} color="#0d9488" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-teal-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 gap-4 p-6 pt-5 text-sm">
              <Field label="Pace" value={formatPace(workout.duration, workout.distance)} />
              <Field label="Time" value={formatDuration(workout.duration)} />
              <Field label="Distance" value={formatDistance(workout.distance)} />
              <Field label="ΔBG" value={`${workout.glucoseDelta.toFixed(1)} mmol`} accent />
            </div>
          </article>

          <aside className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border/40">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Today's events
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {treatments.slice(0, 6).map((t) => (
                  <li key={t.t} className="flex items-center gap-3">
                    <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                      {formatClock(t.t)}
                    </span>
                    <span
                      className={`grid size-6 place-items-center rounded-full text-[11px] font-medium ${kindBadge(t.kind)}`}
                    >
                      {kindLetter(t.kind)}
                    </span>
                    <span className="flex-1 truncate">{t.label}</span>
                    <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                      {t.detail ?? ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border/40">
              <div className="flex items-baseline justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Recovery
                </p>
                <span className="text-xs text-muted-foreground">today</span>
              </div>
              <p
                className="mt-3 text-5xl font-medium tabular-nums tracking-tight"
                style={editorial}
              >
                {recovery.score}
              </p>
              <p className="text-sm text-muted-foreground">
                / 100 · {recovery.score >= 67 ? "ample reserves" : "moderate"}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <Vital
                  icon={<Heart className="size-4 text-rose-500" />}
                  value={`${recovery.rhr}`}
                  unit="bpm"
                  label="RHR"
                />
                <Vital
                  icon={<Moon className="size-4 text-indigo-500" />}
                  value={`${recovery.sleep}h`}
                  unit=""
                  label="Sleep"
                />
                <Vital
                  icon={<MapPin className="size-4 text-teal-500" />}
                  value={`${recovery.hrv}`}
                  unit="ms"
                  label="HRV"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-8 pb-16">
        <h3 className="text-2xl font-medium tracking-tight" style={editorial}>
          This week
        </h3>
        <div className="mt-5 grid gap-3 lg:grid-cols-7">
          {weeklyTIR.map((d) => (
            <article
              key={d.date}
              className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/40"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{d.weekday}</p>
              <p className="mt-2 text-3xl font-medium tabular-nums" style={editorial}>
                {d.inRange}%
              </p>
              <p className="text-xs text-muted-foreground" style={mono}>
                avg {d.avg.toFixed(1)} mmol/L
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full"
                  style={{
                    width: `${d.inRange}%`,
                    backgroundColor: d.inRange >= 75 ? "rgb(13 148 136)" : "rgb(217 119 6)",
                  }}
                />
              </div>
            </article>
          ))}
        </div>

        <h3 className="mt-12 text-2xl font-medium tracking-tight" style={editorial}>
          Recent activity
        </h3>
        <ul className="mt-5 grid gap-3 lg:grid-cols-2">
          {recentWorkouts.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/40"
            >
              <div>
                <p className="text-sm font-medium">
                  {w.sport} · {formatDistance(w.distance)}
                </p>
                <p className="text-xs text-muted-foreground" style={mono}>
                  {w.date} · {formatPace(w.duration, w.distance)}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">strain</p>
                  <p className="font-medium tabular-nums" style={mono}>
                    {w.strain.toFixed(1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">ΔBG</p>
                  <p
                    className="font-medium tabular-nums"
                    style={{
                      ...mono,
                      color: w.glucoseDelta < 0 ? "rgb(13 148 136)" : "var(--color-glucose-high)",
                    }}
                  >
                    {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  sub,
  tone,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  tone: "teal" | "indigo" | "rose" | "amber";
}) {
  const accent =
    tone === "teal"
      ? "text-teal-700 dark:text-teal-300"
      : tone === "indigo"
        ? "text-indigo-700 dark:text-indigo-300"
        : tone === "rose"
          ? "text-rose-700 dark:text-rose-300"
          : "text-amber-700 dark:text-amber-300";
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/40">
      <p className={`text-xs uppercase tracking-[0.18em] ${accent}`}>{label}</p>
      <p
        className="mt-2 flex items-baseline gap-1.5 text-3xl font-medium tabular-nums tracking-tight"
        style={editorial}
      >
        {value}
        {unit ? <span className="text-sm font-normal text-muted-foreground">{unit}</span> : null}
      </p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 tabular-nums ${accent ? "text-teal-700 dark:text-teal-300" : ""}`}
        style={mono}
      >
        {value}
      </p>
    </div>
  );
}

function Vital({
  icon,
  value,
  unit,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-start gap-1 rounded-xl bg-muted/40 p-2.5">
      <span>{icon}</span>
      <p className="font-medium tabular-nums" style={mono}>
        {value}
        {unit}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground" style={mono}>
        {label}
      </p>
    </div>
  );
}

function kindBadge(kind: string): string {
  switch (kind) {
    case "insulin":
      return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300";
    case "carbs":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "exercise":
      return "bg-teal-500/15 text-teal-700 dark:text-teal-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
