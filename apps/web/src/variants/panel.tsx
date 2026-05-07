import { Activity, Heart, Home, Inbox, MapPin, Moon, Settings, Zap } from "lucide-react";
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
const data = { fontFamily: "var(--font-mono-data)" } as const;

export function PanelVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="grid lg:grid-cols-[64px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col items-center gap-2 border-r border-border/40 bg-card/60 py-4 backdrop-blur-xl lg:flex">
          <span className="grid size-9 place-items-center rounded-xl bg-foreground text-sm font-bold text-background">
            s
          </span>
          <hr className="my-1 w-7 border-border/40" />
          {[
            [<Home className="size-4" key="h" />, "Today", true],
            [<Inbox className="size-4" key="i" />, "Glucose"],
            [<Activity className="size-4" key="a" />, "Activity"],
            [<Heart className="size-4" key="hr" />, "Recovery"],
            [<Zap className="size-4" key="z" />, "Treatments"],
            [<MapPin className="size-4" key="m" />, "Routes"],
            [<Settings className="size-4" key="s" />, "Settings"],
          ].map(([icon, label, active]) => (
            <button
              key={label as string}
              type="button"
              title={label as string}
              className={`grid size-9 place-items-center rounded-lg ${
                active
                  ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {icon}
            </button>
          ))}
          <div className="mt-auto flex flex-col items-center gap-1 text-[10px]" style={mono}>
            <span className="size-2 rounded-full bg-emerald-500" />
            <span
              className="text-muted-foreground rotate-180"
              style={{ writingMode: "vertical-rl" }}
            >
              live
            </span>
          </div>
        </aside>

        <div>
          <header className="flex items-center justify-between border-b border-border/40 bg-background/70 px-6 py-3 backdrop-blur-xl">
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-semibold tracking-tight" style={display}>
                Panel · today
              </h1>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" /> in range · stable
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 p-0.5 text-xs"
              style={mono}
            >
              {["1h", "4h", "24h", "7d", "30d"].map((w, i) => (
                <button
                  key={w}
                  type="button"
                  className={`rounded-full px-2.5 py-1 ${i === 2 ? "bg-foreground text-background" : "text-muted-foreground"}`}
                >
                  {w}
                </button>
              ))}
            </div>
          </header>

          <main className="grid gap-3 px-6 py-5 lg:grid-cols-6">
            <Tile className="lg:col-span-2 lg:row-span-2" tone="indigo">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                current glucose
              </p>
              <p className="mt-3 text-6xl font-semibold leading-[0.9] tabular-nums" style={display}>
                {formatGlucose(glucose.current)}
              </p>
              <p className="text-sm text-muted-foreground">mmol/L · stable</p>
              <div className="mt-5 h-24 text-indigo-500/85">
                <Sparkline
                  data={glucose.last24h}
                  width={300}
                  height={96}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="hsl(245 70% 60%)"
                  className="size-full"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Mini label="avg" value={formatGlucose(today.avg)} />
                <Mini label="gmi" value={today.gmi.toFixed(1)} />
                <Mini label="cv" value={`${today.cv}%`} />
                <Mini label="reads" value={today.readings.toString()} />
              </div>
            </Tile>

            <Tile className="lg:col-span-2" tone="emerald">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                time in range
              </p>
              <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
                {tir.inRange}%
              </p>
              <div className="mt-3 flex h-1.5 overflow-hidden rounded-full">
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
              <p className="mt-2 text-xs text-muted-foreground" style={mono}>
                {tir.below}% low · {tir.above}% high
              </p>
            </Tile>

            <Tile className="lg:col-span-2" tone="rose" icon={<Heart className="size-3.5" />}>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                recovery
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <p className="text-4xl font-semibold tabular-nums" style={display}>
                  {recovery.score}
                </p>
                <p className="text-xs text-muted-foreground" style={mono}>
                  /100 · {recovery.sleep}h sleep
                </p>
              </div>
              <p className="text-xs text-muted-foreground" style={mono}>
                HRV {recovery.hrv}ms · RHR {recovery.rhr}
              </p>
            </Tile>

            <Tile className="lg:col-span-2" tone="amber" icon={<Moon className="size-3.5" />}>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                strain · today
              </p>
              <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
                {recovery.strain.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground" style={mono}>
                peak HR {workout.avgHr + 18} · z3
              </p>
            </Tile>

            <Tile className="lg:col-span-2" tone="violet">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                weekly · tir
              </p>
              <div className="mt-3 grid grid-cols-7 gap-1">
                {weeklyTIR.map((d) => (
                  <div key={d.date} className="text-center">
                    <div className="grid h-12 place-items-end overflow-hidden rounded-md bg-muted/40">
                      <div
                        className="w-full rounded-md"
                        style={{
                          height: `${d.inRange}%`,
                          backgroundColor: d.inRange >= 75 ? "rgb(99 102 241)" : "rgb(217 119 6)",
                        }}
                      />
                    </div>
                    <p className="mt-0.5 text-[9px] text-muted-foreground" style={mono}>
                      {d.weekday[0]}
                    </p>
                  </div>
                ))}
              </div>
            </Tile>

            <Tile className="lg:col-span-4 p-0 overflow-hidden" tone="indigo">
              <header className="flex items-baseline justify-between px-5 py-3">
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  today's run · {formatDistance(workout.distance)}
                </p>
                <span className="text-xs text-muted-foreground" style={mono}>
                  {formatPace(workout.duration, workout.distance)} ·{" "}
                  {formatDuration(workout.duration)}
                </span>
              </header>
              <div className="aspect-[16/8]">
                <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                  <MapRoute coordinates={coords} color="#6366f1" width={4} opacity={0.95} />
                  <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        S
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        F
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapControls position="top-right" />
                </Map>
              </div>
              <div className="grid grid-cols-4 divide-x divide-border/40 text-sm">
                {[
                  ["distance", formatDistance(workout.distance)],
                  ["pace", formatPace(workout.duration, workout.distance)],
                  ["avg HR", `${workout.avgHr}`],
                  ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`, true],
                ].map(([k, v, accent]) => (
                  <div key={k as string} className="px-5 py-4">
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                      style={mono}
                    >
                      {k}
                    </p>
                    <p
                      className={`mt-1 tabular-nums ${accent ? "text-indigo-600 dark:text-indigo-300" : ""}`}
                      style={mono}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </Tile>

            <Tile className="lg:col-span-2" tone="muted">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                events · today
              </p>
              <ul className="mt-3 space-y-1 text-xs" style={data}>
                {treatments.slice(0, 6).map((t) => (
                  <li
                    key={t.t}
                    className="grid items-center gap-2 border-b border-border/30 pb-1 last:border-b-0"
                    style={{ gridTemplateColumns: "44px 14px 1fr auto" }}
                  >
                    <span className="tabular-nums text-muted-foreground">{formatClock(t.t)}</span>
                    <span className={`size-2 rounded-full ${kindDot(t.kind)}`} />
                    <span className="truncate">{t.label}</span>
                    <span className="tabular-nums text-muted-foreground">{t.detail ?? ""}</span>
                  </li>
                ))}
              </ul>
            </Tile>

            <Tile className="lg:col-span-6" tone="muted">
              <header className="flex items-baseline justify-between">
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  recent.runs
                </p>
                <span className="text-xs text-muted-foreground" style={mono}>
                  last {recentWorkouts.length}
                </span>
              </header>
              <table className="mt-3 w-full text-sm" style={data}>
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-border/40">
                    {[
                      "when",
                      "sport",
                      "distance",
                      "duration",
                      "pace",
                      "avg HR",
                      "strain",
                      "ΔBG",
                    ].map((h) => (
                      <th key={h} className="py-2 text-left font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentWorkouts.map((w) => (
                    <tr key={w.id} className="border-b border-border/30 last:border-b-0">
                      <td className="py-2 text-muted-foreground">{w.date}</td>
                      <td className="py-2">{w.sport}</td>
                      <td className="py-2 tabular-nums">{formatDistance(w.distance)}</td>
                      <td className="py-2 tabular-nums">{formatDuration(w.duration)}</td>
                      <td className="py-2 tabular-nums">{formatPace(w.duration, w.distance)}</td>
                      <td className="py-2 tabular-nums">{w.avgHr}</td>
                      <td className="py-2 tabular-nums">{w.strain.toFixed(1)}</td>
                      <td
                        className="py-2 text-right tabular-nums"
                        style={{
                          color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(99 102 241)",
                        }}
                      >
                        {w.glucoseDelta > 0 ? "+" : ""}
                        {w.glucoseDelta.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tile>
          </main>
        </div>
      </div>
    </div>
  );
}

function Tile({
  className = "",
  tone,
  icon,
  children,
}: {
  className?: string;
  tone: "indigo" | "emerald" | "rose" | "amber" | "violet" | "muted";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const bar = {
    indigo: "before:bg-indigo-500",
    emerald: "before:bg-emerald-500",
    rose: "before:bg-rose-500",
    amber: "before:bg-amber-500",
    violet: "before:bg-violet-500",
    muted: "before:bg-muted-foreground/30",
  }[tone];
  return (
    <article
      className={`relative rounded-2xl border border-border/40 bg-card/95 p-5 backdrop-blur-xl before:absolute before:left-0 before:top-4 before:h-8 before:w-0.5 before:rounded-full ${bar} ${className}`}
    >
      {icon ? <div className="absolute right-4 top-4 text-muted-foreground">{icon}</div> : null}
      {children}
    </article>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 tabular-nums">{value}</p>
    </div>
  );
}

function kindDot(kind: string): string {
  switch (kind) {
    case "insulin":
      return "bg-blue-500";
    case "carbs":
      return "bg-amber-500";
    case "exercise":
      return "bg-violet-500";
    default:
      return "bg-muted-foreground/40";
  }
}
