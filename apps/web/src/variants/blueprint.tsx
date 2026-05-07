import { FolderOpen, Heart, Hexagon } from "lucide-react";
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

export function BlueprintVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative grid lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-3 border-r border-border/40 bg-card/70 px-3 py-4 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-2 px-1.5">
            <span className="grid size-7 place-items-center rounded-md bg-cyan-500 text-xs font-bold text-white">
              <Hexagon className="size-3.5" />
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              blueprint
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground" style={mono}>
              v0.0.1
            </span>
          </div>

          <div className="rounded-md border border-cyan-500/30 bg-cyan-500/5 px-3 py-2 text-xs">
            <p
              className="uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300"
              style={mono}
            >
              system
            </p>
            <ul className="mt-2 space-y-0.5" style={data}>
              <li className="flex justify-between">
                <span className="text-muted-foreground">tir.7d.avg</span>
                <span className="tabular-nums">
                  {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}%
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">tir.today</span>
                <span className="tabular-nums">{tir.inRange}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">gmi</span>
                <span className="tabular-nums">{today.gmi.toFixed(1)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">readings</span>
                <span className="tabular-nums">{today.readings}</span>
              </li>
            </ul>
          </div>

          <nav className="space-y-0.5 text-sm" style={mono}>
            <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              project tree
            </p>
            {[
              ["📊", "today.dashboard", true],
              ["🩸", "glucose.trace"],
              ["🏃", "activity.run"],
              ["💤", "recovery.sleep"],
              ["🍞", "treatments.log"],
              ["🗺️", "routes.gpx"],
              ["⚙️", "config.yaml"],
            ].map(([icon, label, active]) => (
              <button
                key={label as string}
                type="button"
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left ${
                  active
                    ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span>{icon}</span>
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </nav>

          <div
            className="mt-auto rounded-md border border-border/40 bg-card/80 p-2.5 text-[11px]"
            style={data}
          >
            <p className="uppercase tracking-[0.24em] text-muted-foreground">build</p>
            <ul className="mt-1 space-y-0.5">
              <li className="flex justify-between">
                <span>libre.cgm</span>
                <span className="text-emerald-600 dark:text-emerald-400">ok</span>
              </li>
              <li className="flex justify-between">
                <span>whoop.api</span>
                <span className="text-emerald-600 dark:text-emerald-400">ok</span>
              </li>
              <li className="flex justify-between">
                <span>garmin.fit</span>
                <span className="text-amber-600 dark:text-amber-400">syncing</span>
              </li>
            </ul>
          </div>
        </aside>

        <div>
          <header className="flex items-center justify-between border-b border-border/40 bg-background/80 px-6 py-2.5 backdrop-blur-xl">
            <div className="flex items-baseline gap-3 text-xs" style={mono}>
              <FolderOpen className="size-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="font-medium">project / today.dashboard</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">overview</span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-md border border-border/60 bg-card/80 p-0.5 text-xs"
              style={mono}
            >
              {["1h", "4h", "24h", "7d", "30d"].map((w, i) => (
                <button
                  key={w}
                  type="button"
                  className={`rounded-sm px-2.5 py-1 ${i === 2 ? "bg-foreground text-background" : "text-muted-foreground"}`}
                >
                  {w}
                </button>
              ))}
            </div>
          </header>

          <main className="grid gap-2 px-6 py-4 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
            <Tile className="lg:col-span-5 lg:row-span-2" tone="cyan">
              <Eyebrow label="01 · glucose.current" />
              <p
                className="mt-3 text-7xl font-semibold leading-[0.85] tabular-nums"
                style={display}
              >
                {formatGlucose(glucose.current)}
              </p>
              <p className="text-sm text-muted-foreground" style={mono}>
                mmol/L · stable · 4 min ago
              </p>
              <div className="mt-5 h-28 text-cyan-600/85 dark:text-cyan-400/85">
                <Sparkline
                  data={glucose.last24h}
                  width={420}
                  height={112}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="rgb(8 145 178)"
                  className="size-full"
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs" style={data}>
                <KV label="avg" value={formatGlucose(today.avg)} />
                <KV label="gmi" value={today.gmi.toFixed(1)} />
                <KV label="cv" value={`${today.cv}%`} />
                <KV label="reads" value={today.readings.toString()} />
              </div>
            </Tile>

            <Tile className="lg:col-span-3" tone="emerald">
              <Eyebrow label="02 · tir.24h" />
              <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
                {tir.inRange}
                <span className="text-xl text-muted-foreground">%</span>
              </p>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded">
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
              <p className="mt-2 text-xs tabular-nums text-muted-foreground" style={data}>
                lo {tir.below}% · hi {tir.above}%
              </p>
            </Tile>

            <Tile className="lg:col-span-4" tone="violet" icon={<Heart className="size-3.5" />}>
              <Eyebrow label="03 · recovery" />
              <div className="mt-2 flex items-baseline gap-3">
                <p className="text-4xl font-semibold tabular-nums" style={display}>
                  {recovery.score}
                </p>
                <p className="text-xs text-muted-foreground" style={data}>
                  /100 · strain {recovery.strain.toFixed(1)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground" style={data}>
                HRV {recovery.hrv}ms · RHR {recovery.rhr} · {recovery.sleep}h sleep
              </p>
            </Tile>

            <Tile className="lg:col-span-7 p-0 overflow-hidden" tone="amber">
              <header className="flex items-baseline justify-between border-b border-border/30 px-4 py-2">
                <Eyebrow label="04 · activity.run · today" />
                <span className="text-xs text-muted-foreground" style={data}>
                  {coords.length} pts · {formatDistance(workout.distance)}
                </span>
              </header>
              <div className="aspect-[16/8]">
                <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                  <MapRoute coordinates={coords} color="#06b6d4" width={3.5} opacity={0.95} />
                  <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        S
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        F
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapControls position="top-right" />
                </Map>
              </div>
              <div
                className="grid grid-cols-5 divide-x divide-border/30 border-t border-border/30 text-sm"
                style={data}
              >
                {[
                  ["pace", formatPace(workout.duration, workout.distance)],
                  ["time", formatDuration(workout.duration)],
                  ["dist", formatDistance(workout.distance)],
                  ["avg HR", `${workout.avgHr}`],
                  ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`, true],
                ].map(([k, v, accent]) => (
                  <div key={k as string} className="px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {k}
                    </p>
                    <p
                      className={`mt-0.5 tabular-nums ${accent ? "text-cyan-600 dark:text-cyan-300" : ""}`}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </Tile>

            <Tile className="lg:col-span-5" tone="rose">
              <Eyebrow label="05 · events.log · today" />
              <ul className="mt-3 space-y-1 text-xs" style={data}>
                {treatments.slice(0, 9).map((t) => (
                  <li
                    key={t.t}
                    className="grid items-center gap-2 border-b border-dashed border-border/40 pb-1 last:border-b-0"
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

            <Tile className="lg:col-span-12" tone="muted">
              <Eyebrow label="06 · recent.runs" sub={`last ${recentWorkouts.length}`} />
              <table className="mt-2 w-full text-xs" style={data}>
                <thead className="text-muted-foreground">
                  <tr className="border-b border-border/40">
                    {["when", "sport", "dist", "duration", "pace", "avg HR", "strain", "ΔBG"].map(
                      (h) => (
                        <th key={h} className="py-1.5 text-left font-normal">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {recentWorkouts.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-dashed border-border/30 last:border-b-0"
                    >
                      <td className="py-1.5 text-muted-foreground">{w.date}</td>
                      <td className="py-1.5">{w.sport}</td>
                      <td className="py-1.5 tabular-nums">{formatDistance(w.distance)}</td>
                      <td className="py-1.5 tabular-nums">{formatDuration(w.duration)}</td>
                      <td className="py-1.5 tabular-nums">{formatPace(w.duration, w.distance)}</td>
                      <td className="py-1.5 tabular-nums">{w.avgHr}</td>
                      <td className="py-1.5 tabular-nums">{w.strain.toFixed(1)}</td>
                      <td
                        className="py-1.5 text-right tabular-nums"
                        style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(6 182 212)" }}
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
  tone: "cyan" | "emerald" | "violet" | "amber" | "rose" | "muted";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const bar = {
    cyan: "before:bg-cyan-500",
    emerald: "before:bg-emerald-500",
    violet: "before:bg-violet-500",
    amber: "before:bg-amber-500",
    rose: "before:bg-rose-500",
    muted: "before:bg-muted-foreground/30",
  }[tone];
  return (
    <article
      className={`relative rounded-md border border-border/40 bg-card/95 p-4 backdrop-blur-xl before:absolute before:left-0 before:top-4 before:h-8 before:w-0.5 before:rounded-full ${bar} ${className}`}
    >
      {icon ? <div className="absolute right-4 top-4 text-muted-foreground">{icon}</div> : null}
      {children}
    </article>
  );
}

function Eyebrow({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400"
        style={mono}
      >
        {label}
      </p>
      {sub ? (
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          · {sub}
        </p>
      ) : null}
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-dashed border-border/40 px-2 py-1">
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
      return "bg-cyan-500";
    default:
      return "bg-muted-foreground/40";
  }
}
