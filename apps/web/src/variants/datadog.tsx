import { Activity, AlertCircle, Heart, LineChart, MapPin, Server, Zap } from "lucide-react";
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

const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

export function DatadogVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="grid lg:grid-cols-[60px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col items-center gap-2 border-r border-border/60 bg-card py-3 lg:flex">
          <span className="grid size-9 place-items-center rounded-md bg-violet-600 text-sm font-bold text-white">
            s
          </span>
          <hr className="my-1 w-6 border-border/60" />
          {[
            [<LineChart className="size-4" key="lc" />, "Glucose", true],
            [<Activity className="size-4" key="ac" />, "Activity"],
            [<Heart className="size-4" key="hr" />, "Recovery"],
            [<Zap className="size-4" key="z" />, "Treatments"],
            [<Server className="size-4" key="s" />, "Sources"],
            [<MapPin className="size-4" key="m" />, "Routes"],
            [<AlertCircle className="size-4" key="al" />, "Alerts"],
          ].map(([icon, label, active]) => (
            <button
              key={label as string}
              type="button"
              title={label as string}
              className={`grid size-9 place-items-center rounded-md ${
                active
                  ? "bg-violet-600/15 text-violet-600 dark:text-violet-300"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {icon}
            </button>
          ))}
        </aside>

        <div>
          <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 px-5 py-2.5 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-medium" style={mono}>
                  serene · today's pulse
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">overview</span>
                <span
                  className="ml-2 inline-flex items-center gap-1.5 rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300"
                  style={mono}
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" /> all systems green
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={mono}>
                {[
                  ["1h", false],
                  ["4h", false],
                  ["24h", true],
                  ["7d", false],
                  ["30d", false],
                ].map(([label, active]) => (
                  <button
                    key={label as string}
                    type="button"
                    className={`rounded px-2 py-1 ${
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <span className="ml-2 text-muted-foreground">
                  last refresh {formatRelativeTime(Date.now() - 60_000)}
                </span>
              </div>
            </div>
          </header>

          <main className="px-5 py-4">
            <section className="grid gap-2 lg:grid-cols-6">
              <Tile
                color="emerald"
                label="glucose · current"
                value={formatGlucose(glucose.current)}
                unit="mmol/L"
                subtext="stable"
              />
              <Tile
                color="emerald"
                label="time in range"
                value={`${tir.inRange}%`}
                subtext={`${tir.below}% low · ${tir.above}% high`}
              />
              <Tile
                color="violet"
                label="recovery"
                value={`${recovery.score}`}
                unit="/100"
                subtext={`HRV ${recovery.hrv}ms`}
              />
              <Tile
                color="amber"
                label="strain · today"
                value={recovery.strain.toFixed(1)}
                subtext={`avg HR ${workout.avgHr}`}
              />
              <Tile
                color="violet"
                label="ΔBG today's run"
                value={`${workout.glucoseDelta.toFixed(1)}`}
                unit="mmol"
                subtext="post-recovery shake"
              />
              <Tile
                color="muted"
                label="readings · 24h"
                value={today.readings.toString()}
                subtext={`gmi ${today.gmi.toFixed(1)}`}
              />
            </section>

            <section className="mt-2 grid gap-2 lg:grid-cols-12">
              <article className="lg:col-span-8 rounded-md border border-border/60 bg-card">
                <header
                  className="flex items-baseline justify-between border-b border-border/60 px-4 py-2 text-xs"
                  style={mono}
                >
                  <span>glucose.mmol_per_l · 24h · sum</span>
                  <span className="text-muted-foreground">
                    avg {formatGlucose(today.avg)} · cv {today.cv}%
                  </span>
                </header>
                <div className="px-4 py-3">
                  <div className="h-44 text-foreground/85">
                    <Sparkline
                      data={glucose.last24h}
                      width={800}
                      height={176}
                      showRangeBand
                      strokeColor="currentColor"
                      bandColor="hsl(280 60% 60%)"
                      className="size-full"
                    />
                  </div>
                  <div
                    className="mt-2 flex justify-between text-[10px] text-muted-foreground"
                    style={data}
                  >
                    <span>−24h</span>
                    <span>−18h</span>
                    <span>−12h</span>
                    <span>−6h</span>
                    <span>now</span>
                  </div>
                </div>
              </article>

              <aside className="lg:col-span-4 rounded-md border border-border/60 bg-card">
                <header className="border-b border-border/60 px-4 py-2 text-xs" style={mono}>
                  events · last 24h
                </header>
                <ul className="divide-y divide-border/40 text-xs">
                  {treatments.slice(0, 9).map((t) => (
                    <li
                      key={t.t}
                      className="grid items-baseline gap-2 px-4 py-1.5"
                      style={{ gridTemplateColumns: "44px 16px 1fr auto", ...data }}
                    >
                      <span className="tabular-nums text-muted-foreground">{formatClock(t.t)}</span>
                      <span className={`size-2 rounded-full ${kindDot(t.kind)}`} />
                      <span className="truncate">{t.label}</span>
                      <span className="tabular-nums text-muted-foreground">{t.detail ?? ""}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </section>

            <section className="mt-2 grid gap-2 lg:grid-cols-12">
              <article className="lg:col-span-8 overflow-hidden rounded-md border border-border/60 bg-card">
                <header
                  className="flex items-baseline justify-between border-b border-border/60 px-4 py-2 text-xs"
                  style={mono}
                >
                  <span>activity.run · today · 06:14</span>
                  <span className="text-muted-foreground">
                    {formatDistance(workout.distance)} ·{" "}
                    {formatPace(workout.duration, workout.distance)}
                  </span>
                </header>
                <div className="aspect-[16/7]">
                  <Map center={ROUTE_CENTER} zoom={12.5} className="size-full">
                    <MapRoute coordinates={coords} color="#7c3aed" width={3} opacity={0.95} />
                    <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                      <MarkerContent>
                        <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                          S
                        </span>
                      </MarkerContent>
                    </MapMarker>
                    <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                      <MarkerContent>
                        <span className="grid size-5 place-items-center rounded-full bg-violet-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                          F
                        </span>
                      </MarkerContent>
                    </MapMarker>
                    <MapControls position="top-right" />
                  </Map>
                </div>
                <div className="grid grid-cols-5 divide-x divide-border/60 text-xs">
                  <Cell label="distance" value={formatDistance(workout.distance)} />
                  <Cell label="duration" value={formatDuration(workout.duration)} />
                  <Cell label="avg HR" value={`${workout.avgHr}`} />
                  <Cell label="strain" value={workout.strain.toFixed(1)} />
                  <Cell label="ΔBG" value={`${workout.glucoseDelta.toFixed(1)}`} accent />
                </div>
              </article>

              <article className="lg:col-span-4 rounded-md border border-border/60 bg-card">
                <header className="border-b border-border/60 px-4 py-2 text-xs" style={mono}>
                  weekly.tir · 7d
                </header>
                <table className="w-full text-xs" style={data}>
                  <tbody>
                    {weeklyTIR.map((d) => (
                      <tr key={d.date} className="border-b border-border/40 last:border-b-0">
                        <td className="px-4 py-1.5 text-muted-foreground">{d.weekday}</td>
                        <td className="px-4 py-1.5 tabular-nums">{d.inRange}%</td>
                        <td className="px-4 py-1.5 pl-0">
                          <div className="h-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full"
                              style={{
                                width: `${d.inRange}%`,
                                backgroundColor:
                                  d.inRange >= 75 ? "rgb(124 58 237)" : "rgb(217 119 6)",
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-1.5 text-right tabular-nums text-muted-foreground">
                          {d.avg.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </section>

            <section className="mt-2 rounded-md border border-border/60 bg-card">
              <header className="border-b border-border/60 px-4 py-2 text-xs" style={mono}>
                recent.runs · last 5
              </header>
              <table className="w-full text-xs" style={data}>
                <thead className="border-b border-border/40 text-muted-foreground">
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
                      <th key={h} className="px-4 py-2 text-left font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentWorkouts.map((w) => (
                    <tr key={w.id} className="border-b border-border/40 last:border-b-0">
                      <td className="px-4 py-2 text-muted-foreground">{w.date}</td>
                      <td className="px-4 py-2">{w.sport}</td>
                      <td className="px-4 py-2 tabular-nums">{formatDistance(w.distance)}</td>
                      <td className="px-4 py-2 tabular-nums">{formatDuration(w.duration)}</td>
                      <td className="px-4 py-2 tabular-nums">
                        {formatPace(w.duration, w.distance)}
                      </td>
                      <td className="px-4 py-2 tabular-nums">{w.avgHr}</td>
                      <td className="px-4 py-2 tabular-nums">{w.strain.toFixed(1)}</td>
                      <td
                        className="px-4 py-2 text-right tabular-nums"
                        style={{
                          color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(124 58 237)",
                        }}
                      >
                        {w.glucoseDelta > 0 ? "+" : ""}
                        {w.glucoseDelta.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function Tile({
  color,
  label,
  value,
  unit,
  subtext,
}: {
  color: "emerald" | "violet" | "amber" | "muted";
  label: string;
  value: string;
  unit?: string;
  subtext?: string;
}) {
  const tone =
    color === "emerald"
      ? "border-l-emerald-500"
      : color === "violet"
        ? "border-l-violet-500"
        : color === "amber"
          ? "border-l-amber-500"
          : "border-l-muted-foreground/40";
  return (
    <div className={`rounded-md border border-border/60 ${tone} border-l-2 bg-card px-4 py-3`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground" style={mono}>
        {label}
      </p>
      <p
        className="mt-1 flex items-baseline gap-1.5 text-2xl font-medium tabular-nums"
        style={mono}
      >
        {value}
        {unit ? <span className="text-xs font-normal text-muted-foreground">{unit}</span> : null}
      </p>
      {subtext ? (
        <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground" style={data}>
          {subtext}
        </p>
      ) : null}
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground" style={mono}>
        {label}
      </p>
      <p
        className={`mt-1 tabular-nums ${accent ? "text-violet-600 dark:text-violet-300" : ""}`}
        style={data}
      >
        {value}
      </p>
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
      return "bg-muted-foreground/50";
  }
}
