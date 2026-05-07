import { ArrowRight, Heart, Moon } from "lucide-react";
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

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function HorizonVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[640px]"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklch, oklch(0.78 0.14 220) 22%, transparent) 0%, color-mix(in oklch, oklch(0.78 0.14 30) 12%, transparent) 100%)",
        }}
      />

      <header className="relative">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-orange-300 text-xs font-bold text-white shadow">
              s
            </span>
            <span className="text-lg font-semibold tracking-tight" style={display}>
              serene
            </span>
          </div>
          <nav className="hidden items-center gap-1 rounded-full bg-card/60 p-1 text-sm backdrop-blur-md md:flex">
            {["Today", "Glucose", "Activity", "Recovery", "Plan"].map((n, i) => (
              <button
                key={n}
                type="button"
                className={`rounded-full px-4 py-1.5 ${i === 0 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground" style={mono}>
              synced {formatClock(Date.now() - 60_000)}
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
              S
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1280px] px-8 pb-12">
        <section className="rounded-[2rem] border border-white/40 bg-white/55 p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.3)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" /> in range · stable · 4 min
                ago
              </p>
              <h1
                className="mt-6 text-7xl font-semibold leading-[0.9] tracking-tight"
                style={display}
              >
                <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
                <span className="ml-3 text-2xl font-normal text-muted-foreground">mmol/L</span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Time-in-range for the day is <span className="text-foreground">{tir.inRange}%</span>
                . The {formatDistance(workout.distance)} long run drew the line south by{" "}
                <span className="text-foreground">
                  {Math.abs(workout.glucoseDelta).toFixed(1)} mmol/L
                </span>
                ; a recovery shake walked it back.
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm text-background"
                >
                  Open glucose detail <ArrowRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="rounded-full border border-border/60 px-4 py-2 text-sm hover:bg-muted/40"
                >
                  View today's run
                </button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/40 bg-white/55 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
                <div className="flex items-baseline justify-between">
                  <p
                    className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
                    style={mono}
                  >
                    last 24h
                  </p>
                  <span className="text-xs text-muted-foreground" style={mono}>
                    96 reads
                  </span>
                </div>
                <div className="mt-4 h-32 text-sky-500/85">
                  <Sparkline
                    data={glucose.last24h}
                    width={420}
                    height={128}
                    showRangeBand
                    strokeColor="currentColor"
                    bandColor="hsl(220 70% 60%)"
                    className="size-full"
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <Mini label="avg" value={`${formatGlucose(today.avg)} mmol`} />
                  <Mini label="gmi" value={today.gmi.toFixed(1)} />
                  <Mini label="cv" value={`${today.cv}%`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-4">
          <Stat
            tone="emerald"
            label="In range"
            value={`${tir.inRange}%`}
            sub={`${tir.below}% low · ${tir.above}% high`}
          />
          <Stat
            tone="indigo"
            label="Recovery"
            value={`${recovery.score}`}
            unit="/100"
            sub={`HRV ${recovery.hrv}ms`}
            icon={<Heart className="size-3.5" />}
          />
          <Stat
            tone="rose"
            label="Sleep"
            value={`${recovery.sleep}h`}
            sub={`RHR ${recovery.rhr} bpm`}
            icon={<Moon className="size-3.5" />}
          />
          <Stat
            tone="amber"
            label="Strain"
            value={recovery.strain.toFixed(1)}
            sub={`avg HR ${workout.avgHr}`}
          />
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-7 overflow-hidden rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
            <header className="flex items-baseline justify-between p-5 pb-3">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
                  style={mono}
                >
                  today's run
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight" style={display}>
                  Vondelpark · {formatDistance(workout.distance)}
                </h3>
              </div>
              <button type="button" className="rounded-full bg-muted/60 px-3 py-1.5 text-xs">
                Open route
              </button>
            </header>
            <div className="aspect-[16/8]">
              <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                <MapRoute coordinates={coords} color="#0ea5e9" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-sky-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 divide-x divide-border/40 text-sm">
              {[
                ["Pace", formatPace(workout.duration, workout.distance)],
                ["Time", formatDuration(workout.duration)],
                ["Avg HR", `${workout.avgHr} bpm`],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)} mmol`, true],
              ].map(([k, v, accent]) => (
                <div key={k as string} className="px-5 py-4">
                  <p
                    className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-1 tabular-nums ${accent ? "text-sky-600 dark:text-sky-400" : ""}`}
                    style={mono}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:col-span-5 grid gap-3">
            <article className="rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground" style={mono}>
                events · today
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {treatments.slice(0, 6).map((t) => (
                  <li
                    key={t.t}
                    className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-1.5"
                  >
                    <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                      {formatClock(t.t)}
                    </span>
                    <span
                      className={`grid size-5 place-items-center rounded-full text-[10px] font-medium ${kindBadge(t.kind)}`}
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
            </article>
            <article className="rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
              <header className="flex items-baseline justify-between">
                <p
                  className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
                  style={mono}
                >
                  weekly · tir
                </p>
                <span className="text-xs text-muted-foreground" style={mono}>
                  avg {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}%
                </span>
              </header>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {weeklyTIR.map((d) => (
                  <div key={d.date} className="flex flex-col items-center gap-1">
                    <div className="grid h-16 w-full place-items-end overflow-hidden rounded-xl bg-muted/40">
                      <div
                        className="w-full rounded-xl"
                        style={{
                          height: `${d.inRange}%`,
                          background: "linear-gradient(180deg, hsl(220 70% 60%), hsl(20 80% 60%))",
                        }}
                      />
                    </div>
                    <p className="text-[10px] uppercase text-muted-foreground" style={mono}>
                      {d.weekday[0]}
                    </p>
                    <p className="text-[10px] tabular-nums" style={mono}>
                      {d.inRange}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>

        <section className="mt-4 rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          <header className="flex items-baseline justify-between p-5 pb-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground" style={mono}>
              recent activity
            </p>
            <span className="text-xs text-muted-foreground" style={mono}>
              last {recentWorkouts.length}
            </span>
          </header>
          <ul className="divide-y divide-border/40">
            {recentWorkouts.map((w) => (
              <li key={w.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-sky-500/15 text-base">
                    {sportEmoji(w.sport)}
                  </span>
                  <div>
                    <p className="font-medium">
                      {w.sport} · {formatDistance(w.distance)}
                    </p>
                    <p className="text-xs text-muted-foreground" style={mono}>
                      {w.date} · {formatPace(w.duration, w.distance)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs" style={mono}>
                  <span className="text-muted-foreground">strain {w.strain.toFixed(1)}</span>
                  <span
                    style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(14 165 233)" }}
                    className="tabular-nums"
                  >
                    Δ {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Stat({
  tone,
  label,
  value,
  unit,
  sub,
  icon,
}: {
  tone: "emerald" | "indigo" | "rose" | "amber";
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  const ring = {
    emerald: "ring-emerald-500/30",
    indigo: "ring-indigo-500/30",
    rose: "ring-rose-500/30",
    amber: "ring-amber-500/30",
  }[tone];
  return (
    <article className={`rounded-3xl bg-card/90 p-5 ring-1 ${ring} backdrop-blur-xl`}>
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
        style={mono}
      >
        {icon}
        <span>{label}</span>
      </div>
      <p
        className="mt-2 flex items-baseline gap-1.5 text-3xl font-semibold tabular-nums tracking-tight"
        style={display}
      >
        {value}
        {unit ? (
          <span className="text-sm font-normal text-muted-foreground" style={mono}>
            {unit}
          </span>
        ) : null}
      </p>
      {sub ? (
        <p className="text-xs text-muted-foreground" style={mono}>
          {sub}
        </p>
      ) : null}
    </article>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-1.5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm tabular-nums">{value}</p>
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
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}

function sportEmoji(sport: string): string {
  switch (sport) {
    case "Run":
      return "🏃";
    case "Ride":
      return "🚴";
    case "Swim":
      return "🏊";
    case "Strength":
      return "🏋️";
    default:
      return "💪";
  }
}
