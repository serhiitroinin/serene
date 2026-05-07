import { Activity, Bell, Clock, Heart, Inbox, Layers, MapPin, Settings } from "lucide-react";
import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from "~/components/ui/map";
import {
  formatClock,
  formatDistance,
  formatDuration,
  formatGlucose,
  formatPace,
  formatRelativeTime,
  mockData,
  ROUTE_CENTER,
} from "./shared";
import { Sparkline } from "./sparkline";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

export function StudioVariant() {
  const { glucose, tir, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(35% 50% at 0% 0%, color-mix(in oklch, oklch(0.74 0.14 160) 14%, transparent), transparent 75%), radial-gradient(35% 50% at 100% 100%, color-mix(in oklch, oklch(0.74 0.14 280) 12%, transparent), transparent 75%)",
        }}
      />

      <div className="relative grid lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-4 border-r border-border/40 bg-card/60 px-3 py-4 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-2 px-1.5">
            <span className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-violet-400 text-xs font-bold text-white">
              s
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              serene
            </span>
            <Bell className="ml-auto size-3.5 text-muted-foreground" />
          </div>
          <div className="rounded-xl bg-muted/50 px-3 py-2 text-xs">
            <p className="uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              This week
            </p>
            <p className="mt-1 text-2xl font-medium tabular-nums" style={display}>
              {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}%
            </p>
            <p className="text-muted-foreground" style={mono}>
              avg in range
            </p>
          </div>
          <nav className="space-y-0.5 text-sm">
            {[
              [<Inbox className="size-3.5" key="i" />, "Today", true],
              [<Activity className="size-3.5" key="a" />, "Glucose"],
              [<Clock className="size-3.5" key="c" />, "Activity"],
              [<Heart className="size-3.5" key="h" />, "Recovery"],
              [<Layers className="size-3.5" key="l" />, "Treatments"],
              [<MapPin className="size-3.5" key="m" />, "Routes"],
              [<Settings className="size-3.5" key="s" />, "Settings"],
            ].map(([icon, label, active]) => (
              <button
                key={label as string}
                type="button"
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-border/60 bg-card/80 p-3 text-xs">
            <p className="font-medium" style={display}>
              Sources
            </p>
            <ul className="mt-2 space-y-1" style={data}>
              <li className="flex justify-between">
                <span>libre</span>
                <span className="text-emerald-600 dark:text-emerald-400">● ok</span>
              </li>
              <li className="flex justify-between">
                <span>whoop</span>
                <span className="text-emerald-600 dark:text-emerald-400">● ok</span>
              </li>
              <li className="flex justify-between">
                <span>garmin</span>
                <span className="text-amber-600 dark:text-amber-400">● syncing</span>
              </li>
              <li className="flex justify-between">
                <span>last refresh</span>
                <span className="text-muted-foreground">
                  {formatRelativeTime(Date.now() - 60_000)}
                </span>
              </li>
            </ul>
          </div>
        </aside>

        <div>
          <header className="flex items-center justify-between border-b border-border/40 bg-background/70 px-6 py-3 backdrop-blur-xl">
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-semibold tracking-tight" style={display}>
                Today's studio
              </h1>
              <span className="text-sm text-muted-foreground">your session in glance</span>
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

          <main className="grid gap-3 px-6 py-5 lg:grid-cols-12">
            <article className="lg:col-span-5 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                current glucose
              </p>
              <p
                className="mt-3 text-7xl font-semibold leading-[0.85] tabular-nums"
                style={display}
              >
                {formatGlucose(glucose.current)}
              </p>
              <p className="text-sm text-muted-foreground">mmol/L · stable · 4 min ago</p>
              <div className="mt-5 h-24 text-emerald-500/85">
                <Sparkline
                  data={glucose.last24h}
                  width={400}
                  height={96}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="hsl(150 60% 55%)"
                  className="size-full"
                />
              </div>
            </article>

            <article className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
              <Stat
                tone="emerald"
                label="In range"
                value={`${tir.inRange}%`}
                sub={`${tir.below}% low · ${tir.above}% high`}
                bar={tir.inRange}
              />
              <Stat
                tone="indigo"
                label="Recovery"
                value={`${recovery.score}`}
                unit="/100"
                sub={`HRV ${recovery.hrv}ms · ${recovery.sleep}h sleep`}
                bar={recovery.score}
              />
              <Stat
                tone="rose"
                label="Strain"
                value={recovery.strain.toFixed(1)}
                sub={`avg HR ${workout.avgHr}`}
              />
              <Stat
                tone="amber"
                label="Today's run"
                value={formatDistance(workout.distance)}
                sub={`${formatDuration(workout.duration)} · ${formatPace(workout.duration, workout.distance)}`}
              />
            </article>

            <article className="lg:col-span-7 overflow-hidden rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
              <header className="flex items-baseline justify-between p-5 pb-3">
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    route · today
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight" style={display}>
                    Vondelpark loop
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground" style={mono}>
                  {coords.length} points
                </span>
              </header>
              <div className="aspect-[16/8]">
                <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                  <MapRoute coordinates={coords} color="#10b981" width={3.5} opacity={0.95} />
                  <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        S
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-violet-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        F
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapControls position="top-right" />
                </Map>
              </div>
              <div className="grid grid-cols-4 divide-x divide-border/40 text-sm">
                {[
                  ["pace", formatPace(workout.duration, workout.distance)],
                  ["time", formatDuration(workout.duration)],
                  ["distance", formatDistance(workout.distance)],
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
                      className={`mt-1 tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                      style={mono}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="lg:col-span-5 rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
              <header className="flex items-baseline justify-between border-b border-border/40 px-5 py-3">
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  events · today
                </p>
                <span className="text-[11px] text-muted-foreground" style={mono}>
                  {treatments.length}
                </span>
              </header>
              <ul className="divide-y divide-border/40">
                {treatments.slice(0, 7).map((t) => (
                  <li
                    key={t.t}
                    className="grid items-center gap-3 px-5 py-2 text-sm"
                    style={{ gridTemplateColumns: "55px 22px 1fr auto" }}
                  >
                    <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                      {formatClock(t.t)}
                    </span>
                    <span
                      className={`grid size-5 place-items-center rounded-full text-[10px] font-medium ${kindBadge(t.kind)}`}
                    >
                      {kindLetter(t.kind)}
                    </span>
                    <span className="truncate">{t.label}</span>
                    <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                      {t.detail ?? ""}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="lg:col-span-12 rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
              <header className="flex items-baseline justify-between p-5 pb-3">
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  recent · runs
                </p>
                <button type="button" className="text-xs text-muted-foreground" style={mono}>
                  see all →
                </button>
              </header>
              <table className="w-full text-sm" style={data}>
                <thead className="border-y border-border/40 text-xs text-muted-foreground">
                  <tr>
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
                      <th key={h} className="px-5 py-2 text-left font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentWorkouts.map((w) => (
                    <tr key={w.id} className="border-b border-border/30 last:border-b-0">
                      <td className="px-5 py-2 text-muted-foreground">{w.date}</td>
                      <td className="px-5 py-2">{w.sport}</td>
                      <td className="px-5 py-2 tabular-nums">{formatDistance(w.distance)}</td>
                      <td className="px-5 py-2 tabular-nums">{formatDuration(w.duration)}</td>
                      <td className="px-5 py-2 tabular-nums">
                        {formatPace(w.duration, w.distance)}
                      </td>
                      <td className="px-5 py-2 tabular-nums">{w.avgHr}</td>
                      <td className="px-5 py-2 tabular-nums">{w.strain.toFixed(1)}</td>
                      <td
                        className="px-5 py-2 text-right tabular-nums"
                        style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(244 63 94)" }}
                      >
                        {w.glucoseDelta > 0 ? "+" : ""}
                        {w.glucoseDelta.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}

function Stat({
  tone,
  label,
  value,
  unit,
  sub,
  bar,
}: {
  tone: "emerald" | "indigo" | "rose" | "amber";
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  bar?: number;
}) {
  const ring = {
    emerald: "ring-emerald-500/30",
    indigo: "ring-indigo-500/30",
    rose: "ring-rose-500/30",
    amber: "ring-amber-500/30",
  }[tone];
  const fill = {
    emerald: "bg-emerald-500",
    indigo: "bg-indigo-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  }[tone];
  return (
    <article className={`rounded-2xl bg-card/95 p-5 ring-1 ${ring} backdrop-blur-xl`}>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        {label}
      </p>
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
      {bar !== undefined ? (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
          <div className={`h-full ${fill}`} style={{ width: `${bar}%` }} />
        </div>
      ) : null}
    </article>
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
