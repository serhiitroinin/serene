import { Activity, Bell, BookOpen, Clock, Heart, Inbox } from "lucide-react";
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

export function ArchiveVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="grid lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-4 border-r border-border/40 bg-card/60 px-3 py-4 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-2 px-1.5">
            <span className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-violet-500 text-xs font-bold text-white">
              <BookOpen className="size-3.5" />
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              Archive
            </span>
            <Bell className="ml-auto size-3.5 text-muted-foreground" />
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-violet-500/10 p-3">
            <p
              className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
              style={mono}
            >
              This week
            </p>
            <p className="mt-2 text-3xl font-medium tabular-nums" style={display}>
              {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}%
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              avg time in range
            </p>
          </div>

          <nav className="space-y-0.5 text-sm">
            <p
              className="px-2 pb-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
              style={mono}
            >
              Daily
            </p>
            {[
              [<Inbox className="size-3.5" key="i" />, "Today", true],
              [<Activity className="size-3.5" key="a" />, "Glucose"],
              [<Clock className="size-3.5" key="c" />, "Activity"],
              [<Heart className="size-3.5" key="h" />, "Recovery"],
            ].map(([icon, label, active]) => (
              <button
                key={label as string}
                type="button"
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${active ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "text-muted-foreground hover:bg-muted/50"}`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}

            <p
              className="mt-3 px-2 pb-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
              style={mono}
            >
              Archive
            </p>
            {weeklyTIR.toReversed().map((d, i) => (
              <button
                key={d.date}
                type="button"
                className={`flex w-full items-baseline gap-2 rounded-lg px-2 py-1 text-left text-sm hover:bg-muted/50 ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{
                    backgroundColor: d.inRange >= 75 ? "rgb(45 212 191)" : "rgb(245 158 11)",
                  }}
                />
                <span className="flex-1">
                  {d.weekday}, {d.date}
                </span>
                <span className="text-xs tabular-nums" style={mono}>
                  {d.inRange}%
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-border/60 bg-card/80 p-3 text-xs">
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
                <span>last sync</span>
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
                Today's entry
              </h1>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
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

          <main className="grid gap-3 px-6 py-5 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
            <Tile className="lg:col-span-5 lg:row-span-2" tone="amber">
              <Eyebrow label="entry · 01" />
              <p
                className="mt-3 text-7xl font-semibold leading-[0.85] tabular-nums"
                style={display}
              >
                {formatGlucose(glucose.current)}
              </p>
              <p className="text-sm text-muted-foreground">mmol/L · stable · 4 min ago</p>
              <div className="mt-5 h-24 text-amber-600/85">
                <Sparkline
                  data={glucose.last24h}
                  width={420}
                  height={96}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="rgb(217 119 6)"
                  className="size-full"
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                <Mini label="avg" value={formatGlucose(today.avg)} />
                <Mini label="gmi" value={today.gmi.toFixed(1)} />
                <Mini label="cv" value={`${today.cv}%`} />
                <Mini label="reads" value={today.readings.toString()} />
              </div>
            </Tile>

            <Tile className="lg:col-span-3" tone="emerald">
              <Eyebrow label="entry · 02" />
              <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
                {tir.inRange}%
              </p>
              <p className="text-xs text-muted-foreground">time in range</p>
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
            </Tile>

            <Tile className="lg:col-span-4" tone="indigo" icon={<Heart className="size-3.5" />}>
              <Eyebrow label="entry · 03" />
              <div className="mt-2 flex items-baseline gap-3">
                <p className="text-4xl font-semibold tabular-nums" style={display}>
                  {recovery.score}
                </p>
                <p className="text-xs text-muted-foreground">/100 recovery</p>
              </div>
              <p className="text-xs text-muted-foreground" style={mono}>
                HRV {recovery.hrv}ms · RHR {recovery.rhr} · {recovery.sleep}h sleep
              </p>
            </Tile>

            <Tile className="lg:col-span-7 p-0 overflow-hidden" tone="violet">
              <header className="flex items-baseline justify-between px-5 py-3">
                <Eyebrow label="entry · 04" sub={`route · ${formatDistance(workout.distance)}`} />
                <span className="text-xs text-muted-foreground" style={mono}>
                  {coords.length} points
                </span>
              </header>
              <div className="aspect-[16/8]">
                <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                  <MapRoute coordinates={coords} color="#8b5cf6" width={4} opacity={0.95} />
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
                  ["avg HR", `${workout.avgHr}`],
                  ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`, true],
                ].map(([k, v, accent]) => (
                  <div key={k as string} className="px-5 py-3.5">
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                      style={mono}
                    >
                      {k}
                    </p>
                    <p
                      className={`mt-1 tabular-nums ${accent ? "text-violet-600 dark:text-violet-300" : ""}`}
                      style={mono}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </Tile>

            <Tile className="lg:col-span-5" tone="rose">
              <Eyebrow label="entry · 05" sub="events" />
              <ul className="mt-3 space-y-1.5 text-sm">
                {treatments.slice(0, 7).map((t) => (
                  <li
                    key={t.t}
                    className="grid items-center gap-3"
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
            </Tile>

            <Tile className="lg:col-span-12" tone="muted">
              <Eyebrow label="entry · 06" sub={`recent runs · last ${recentWorkouts.length}`} />
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
                        style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(217 119 6)" }}
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
  tone: "amber" | "emerald" | "indigo" | "violet" | "rose" | "muted";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const bar = {
    amber: "before:bg-amber-500",
    emerald: "before:bg-emerald-500",
    indigo: "before:bg-indigo-500",
    violet: "before:bg-violet-500",
    rose: "before:bg-rose-500",
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

function Eyebrow({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground" style={mono}>
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

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 tabular-nums">{value}</p>
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
      return "bg-violet-500/15 text-violet-700 dark:text-violet-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
