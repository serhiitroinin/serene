import { Activity, ArrowUpRight, Heart, Home, MapPin, Settings, Zap } from "lucide-react";
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

export function ArcVariant() {
  const { glucose, tir, today, recovery, workout, treatments, weeklyTIR, route } = mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background p-3 text-foreground sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(45% 60% at 10% 0%, color-mix(in oklch, oklch(0.7 0.15 320) 22%, transparent), transparent 70%), radial-gradient(40% 50% at 100% 80%, color-mix(in oklch, oklch(0.7 0.18 200) 18%, transparent), transparent 75%), radial-gradient(50% 40% at 100% 0%, color-mix(in oklch, oklch(0.78 0.16 60) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="relative grid gap-3 lg:grid-cols-[200px_1fr]">
        <aside className="sticky top-3 hidden h-[calc(100dvh-1.5rem)] flex-col gap-2 rounded-3xl border border-white/40 bg-white/40 p-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 lg:flex">
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 text-xs font-bold text-white shadow-md">
              s
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              serene
            </span>
          </div>
          <button
            type="button"
            className="my-2 flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 text-sm shadow-sm backdrop-blur-md dark:bg-white/10"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Today's view</span>
            <span className="ml-auto text-xs text-muted-foreground" style={mono}>
              ⌘1
            </span>
          </button>
          <nav className="space-y-1 text-sm">
            {[
              [<Home className="size-4" key="h" />, "Today", true],
              [<Activity className="size-4" key="a" />, "Glucose"],
              [<Zap className="size-4" key="z" />, "Activity"],
              [<Heart className="size-4" key="hr" />, "Recovery"],
              [<MapPin className="size-4" key="m" />, "Routes"],
              [<Settings className="size-4" key="s" />, "Settings"],
            ].map(([icon, label, active]) => (
              <button
                key={label as string}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${
                  active
                    ? "bg-white/70 text-foreground shadow-sm dark:bg-white/15"
                    : "text-muted-foreground hover:bg-white/40 dark:hover:bg-white/5"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-white/50 p-3 text-xs dark:bg-white/5">
            <p className="font-medium">Marathon</p>
            <p className="text-muted-foreground">39 days · plan on track</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/60 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                style={{ width: "62%" }}
              />
            </div>
          </div>
        </aside>

        <main className="space-y-3">
          <header className="flex items-center justify-between rounded-3xl border border-white/40 bg-white/50 px-5 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-semibold tracking-tight" style={display}>
                Hey, Serhii — your glucose is happy.
              </h1>
              <span className="hidden rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300 sm:inline">
                in range · stable
              </span>
            </div>
            <span className="text-xs text-muted-foreground" style={mono}>
              synced {formatClock(Date.now() - 60_000)}
            </span>
          </header>

          <section className="grid gap-3 lg:grid-cols-12">
            <article className="lg:col-span-5 rounded-3xl border border-white/40 bg-gradient-to-br from-white/70 to-white/40 p-7 backdrop-blur-2xl dark:border-white/10 dark:from-white/10 dark:to-white/5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Right now</p>
              <p
                className="mt-3 flex items-baseline gap-2 text-7xl font-semibold tracking-tight"
                style={display}
              >
                <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
                <span className="text-base font-normal text-muted-foreground">mmol/L</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                stable · 4 minutes ago · target 3.9–10.0
              </p>
              <div className="mt-6 h-24 text-foreground/80">
                <Sparkline
                  data={glucose.last24h}
                  width={520}
                  height={96}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="hsl(280 60% 65%)"
                  className="size-full"
                />
              </div>
            </article>

            <article className="lg:col-span-7 rounded-3xl border border-white/40 bg-white/50 p-6 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
              <div className="flex items-baseline justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Time in range · 24h
                </p>
                <span className="text-xs text-muted-foreground" style={mono}>
                  {tir.inRange}%
                </span>
              </div>
              <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full"
                  style={{ width: `${tir.below}%`, backgroundColor: "var(--color-glucose-low)" }}
                />
                <div
                  className="h-full"
                  style={{
                    width: `${tir.inRange}%`,
                    backgroundColor: "var(--color-glucose-in-range)",
                  }}
                />
                <div
                  className="h-full"
                  style={{ width: `${tir.above}%`, backgroundColor: "var(--color-glucose-high)" }}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Bubble label="Average" value={`${formatGlucose(today.avg)}`} unit="mmol/L" />
                <Bubble label="Recovery" value={`${recovery.score}`} unit="/100" />
                <Bubble label="HRV" value={`${recovery.hrv}`} unit="ms" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <Bubble label="GMI" value={today.gmi.toFixed(1)} unit="A1c est." />
                <Bubble label="CV" value={`${today.cv}%`} unit="variance" />
                <Bubble label="Readings" value={today.readings.toString()} unit="last 24h" />
              </div>
            </article>
          </section>

          <section className="grid gap-3 lg:grid-cols-12">
            <article className="lg:col-span-7 overflow-hidden rounded-3xl border border-white/40 bg-white/50 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
              <header className="flex items-baseline justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Today's run
                  </p>
                  <h3 className="mt-0.5 text-xl font-semibold tracking-tight" style={display}>
                    Vondelpark loop · {formatDistance(workout.distance)}
                  </h3>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-xs dark:bg-white/10"
                >
                  Open <ArrowUpRight className="size-3" />
                </button>
              </header>
              <div className="aspect-[16/9]">
                <Map center={ROUTE_CENTER} zoom={12.5} className="size-full">
                  <MapRoute coordinates={coords} color="#ec4899" width={3.5} opacity={0.95} />
                  <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                        S
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                        F
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapControls position="top-right" />
                </Map>
              </div>
              <div className="grid grid-cols-4 gap-2 p-4">
                {[
                  ["Pace", formatPace(workout.duration, workout.distance)],
                  ["Time", formatDuration(workout.duration)],
                  ["HR", `${workout.avgHr} bpm`],
                  ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white/60 px-4 py-3 dark:bg-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {k}
                    </p>
                    <p className="mt-1 text-base tabular-nums" style={mono}>
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="lg:col-span-5 rounded-3xl border border-white/40 bg-white/50 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Today's events
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {treatments.slice(0, 7).map((t) => (
                  <li
                    key={t.t}
                    className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2 dark:bg-white/5"
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
              <hr className="my-4 border-border/30" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Week</p>
              <div className="mt-3 grid grid-cols-7 gap-1.5">
                {weeklyTIR.map((d) => (
                  <div key={d.date} className="text-center">
                    <div className="grid h-16 items-end overflow-hidden rounded-xl bg-white/60 dark:bg-white/5">
                      <div
                        className="rounded-xl bg-gradient-to-t from-purple-400/70 to-pink-400/70"
                        style={{ height: `${d.inRange}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] uppercase text-muted-foreground" style={mono}>
                      {d.weekday[0]}
                    </p>
                    <p className="text-[11px] tabular-nums" style={mono}>
                      {d.inRange}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

function Bubble({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl bg-white/60 px-3 py-2.5 dark:bg-white/5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className="mt-0.5 text-xl font-semibold tabular-nums"
        style={{ fontFamily: "var(--font-bricolage)" }}
      >
        {value}
      </p>
      <p
        className="text-[10px] text-muted-foreground"
        style={{ fontFamily: "var(--font-mono-grotesque)" }}
      >
        {unit}
      </p>
    </div>
  );
}

function kindBadge(kind: string): string {
  switch (kind) {
    case "insulin":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300";
    case "carbs":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
    case "exercise":
      return "bg-pink-500/20 text-pink-700 dark:text-pink-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
