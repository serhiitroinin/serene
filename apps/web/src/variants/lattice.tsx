import { Activity, Award, Bell, Heart, Inbox, Layers, MapPin, Moon, Settings } from "lucide-react";
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

const GOLD = "#b8862b";

export function LatticeVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="grid lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-4 border-r border-border/40 bg-card/70 px-3 py-4 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-2 px-1.5">
            <span
              className="grid size-7 place-items-center rounded-xl text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${GOLD}, oklch(0.5 0.12 80))` }}
            >
              <Award className="size-3.5" />
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              Lattice
            </span>
            <Bell className="ml-auto size-3.5 text-muted-foreground" />
          </div>

          <div
            className="rounded-2xl p-3 text-xs"
            style={{
              border: `1px solid ${GOLD}33`,
              background: `linear-gradient(180deg, ${GOLD}10, transparent)`,
            }}
          >
            <p className="uppercase tracking-[0.24em]" style={{ ...mono, color: GOLD }}>
              Streak
            </p>
            <p className="mt-2 text-3xl font-medium tabular-nums" style={display}>
              14 <span className="text-base text-muted-foreground">days</span>
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              ≥75% TIR · personal best
            </p>
          </div>

          <nav className="space-y-0.5 text-sm">
            {[
              [<Inbox className="size-3.5" key="i" />, "Today", true],
              [<Activity className="size-3.5" key="a" />, "Glucose"],
              [<Heart className="size-3.5" key="h" />, "Recovery"],
              [<Layers className="size-3.5" key="l" />, "Treatments"],
              [<MapPin className="size-3.5" key="m" />, "Routes"],
              [<Settings className="size-3.5" key="s" />, "Settings"],
            ].map(([icon, label, active]) => (
              <button
                key={label as string}
                type="button"
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${active ? "text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
                style={active ? { background: `${GOLD}15` } : undefined}
              >
                <span style={{ color: active ? GOLD : "inherit" }}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div
            className="mt-auto rounded-2xl border border-border/60 bg-card/85 p-3 text-xs"
            style={data}
          >
            <p className="uppercase tracking-[0.24em]" style={{ color: GOLD }}>
              Sources
            </p>
            <ul className="mt-2 space-y-0.5">
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
          <header className="flex items-center justify-between border-b border-border/40 bg-background/80 px-6 py-3 backdrop-blur-xl">
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-semibold tracking-tight" style={display}>
                Lattice · today
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
              className="flex items-center gap-1.5 rounded-full border p-0.5 text-xs"
              style={{ borderColor: `${GOLD}40`, ...mono }}
            >
              {["1h", "4h", "24h", "7d", "30d"].map((w, i) => (
                <button
                  key={w}
                  type="button"
                  className={`rounded-full px-2.5 py-1 ${i === 2 ? "text-background" : "text-muted-foreground"}`}
                  style={i === 2 ? { background: GOLD } : undefined}
                >
                  {w}
                </button>
              ))}
            </div>
          </header>

          <main className="grid gap-3 px-6 py-5 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
            <Tile className="lg:col-span-5 lg:row-span-2" tone="gold">
              <Eyebrow label="i · current" />
              <p className="mt-3 text-7xl font-medium leading-[0.85] tabular-nums" style={display}>
                {formatGlucose(glucose.current)}
              </p>
              <p className="text-sm text-muted-foreground" style={mono}>
                mmol/L · stable · 4 min ago
              </p>
              <div className="mt-5 h-28" style={{ color: GOLD }}>
                <Sparkline
                  data={glucose.last24h}
                  width={420}
                  height={112}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor={GOLD}
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

            <Tile className="lg:col-span-4" tone="emerald">
              <Eyebrow label="ii · in range" />
              <p className="mt-2 text-5xl font-medium tabular-nums" style={display}>
                {tir.inRange}
                <span className="text-xl text-muted-foreground">%</span>
              </p>
              <div className="mt-3 flex h-1.5 overflow-hidden rounded">
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

            <Tile className="lg:col-span-3" tone="rose" icon={<Heart className="size-3.5" />}>
              <Eyebrow label="iii · recovery" />
              <p className="mt-2 text-4xl font-medium tabular-nums" style={display}>
                {recovery.score}
              </p>
              <p className="text-xs text-muted-foreground" style={mono}>
                /100 · HRV {recovery.hrv}
              </p>
            </Tile>

            <Tile className="lg:col-span-4" tone="indigo" icon={<Moon className="size-3.5" />}>
              <Eyebrow label="iv · strain & sleep" />
              <div className="mt-2 flex items-baseline gap-3">
                <p className="text-4xl font-medium tabular-nums" style={display}>
                  {recovery.strain.toFixed(1)}
                </p>
                <span className="text-xs text-muted-foreground" style={mono}>
                  strain · {recovery.sleep}h sleep
                </span>
              </div>
              <p className="text-xs text-muted-foreground" style={mono}>
                peak HR {workout.avgHr + 18} · z3
              </p>
            </Tile>

            <Tile className="lg:col-span-3" tone="gold">
              <Eyebrow label="v · streak" />
              <p
                className="mt-2 text-4xl font-medium tabular-nums"
                style={{ ...display, color: GOLD }}
              >
                14<span className="text-xl text-muted-foreground"> days</span>
              </p>
              <p className="text-xs text-muted-foreground" style={mono}>
                ≥75% TIR · personal best
              </p>
            </Tile>

            <Tile className="lg:col-span-7 p-0 overflow-hidden" tone="gold">
              <header className="flex items-baseline justify-between px-5 py-3">
                <Eyebrow label="vi · run · today" sub={formatDistance(workout.distance)} />
                <span className="text-xs text-muted-foreground" style={mono}>
                  {formatPace(workout.duration, workout.distance)} ·{" "}
                  {formatDuration(workout.duration)}
                </span>
              </header>
              <div className="aspect-[16/8]">
                <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                  <MapRoute coordinates={coords} color={GOLD} width={4} opacity={0.95} />
                  <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                    <MarkerContent>
                      <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        S
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                    <MarkerContent>
                      <span
                        className="grid size-6 place-items-center rounded-full text-[10px] font-bold text-white shadow ring-2 ring-background"
                        style={{ backgroundColor: GOLD }}
                      >
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
                      className={`mt-1 tabular-nums`}
                      style={{ ...mono, color: accent ? GOLD : undefined }}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </Tile>

            <Tile className="lg:col-span-5" tone="rose">
              <Eyebrow label="vii · events" sub="today" />
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
              <header className="flex items-baseline justify-between">
                <Eyebrow label="viii · weekly" />
                <span className="text-xs text-muted-foreground" style={mono}>
                  avg {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}%
                </span>
              </header>
              <div className="mt-3 flex items-end gap-3">
                {weeklyTIR.map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center">
                    <div className="grid h-16 w-full place-items-end overflow-hidden rounded-md bg-muted/40">
                      <div
                        className="w-full rounded-md"
                        style={{
                          height: `${d.inRange}%`,
                          background:
                            d.inRange >= 75
                              ? `linear-gradient(180deg, ${GOLD}, oklch(0.5 0.12 80))`
                              : "rgb(217 119 6)",
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] uppercase text-muted-foreground" style={mono}>
                      {d.weekday[0]} · {d.date.split(" ")[1]}
                    </p>
                    <p className="text-[11px] tabular-nums" style={mono}>
                      {d.inRange}%
                    </p>
                  </div>
                ))}
              </div>
            </Tile>

            <Tile className="lg:col-span-12" tone="muted">
              <header className="flex items-baseline justify-between">
                <Eyebrow label="ix · recent runs" sub={`last ${recentWorkouts.length}`} />
                <button type="button" className="text-xs" style={{ ...mono, color: GOLD }}>
                  see all →
                </button>
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
                        style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : GOLD }}
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
  tone: "gold" | "emerald" | "rose" | "indigo" | "muted";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const barClass = {
    gold: "before:bg-[#b8862b]",
    emerald: "before:bg-emerald-500",
    rose: "before:bg-rose-500",
    indigo: "before:bg-indigo-500",
    muted: "before:bg-muted-foreground/30",
  }[tone];
  return (
    <article
      className={`relative rounded-2xl border border-border/40 bg-card/95 p-5 backdrop-blur-xl before:absolute before:left-0 before:top-4 before:h-8 before:w-0.5 before:rounded-full ${barClass} ${className}`}
    >
      {icon ? <div className="absolute right-4 top-4 text-muted-foreground">{icon}</div> : null}
      {children}
    </article>
  );
}

function Eyebrow({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <p className="text-[10px] uppercase tracking-[0.3em]" style={{ ...mono, color: GOLD }}>
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
    <div className="rounded border border-border/40 px-2 py-1">
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
      return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
