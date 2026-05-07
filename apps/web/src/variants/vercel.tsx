import { Activity, ArrowUpRight, Heart, LineChart, MapPin } from "lucide-react";
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

const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function VercelVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[480px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 0%, color-mix(in oklch, var(--foreground) 8%, transparent), transparent 70%), radial-gradient(40% 40% at 75% 10%, color-mix(in oklch, var(--foreground) 5%, transparent), transparent 70%)",
        }}
      />
      <header className="relative border-b border-border/30">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid size-6 place-items-center rounded bg-foreground text-[11px] font-bold text-background">
              ▲
            </span>
            <span className="text-sm font-medium tracking-tight">serene</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm">my-data</span>
            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2 py-0.5 text-[11px]">
              <span className="size-1.5 rounded-full bg-emerald-500" /> production
            </span>
          </div>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            {["Overview", "Glucose", "Activity", "Sources", "Logs", "Settings"].map((n, i) => (
              <button
                key={n}
                type="button"
                className={`relative pb-[14px] ${
                  i === 0
                    ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-border/60 px-2.5 py-1 text-xs"
              style={mono}
            >
              feedback
            </button>
            <span className="grid size-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
              S
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1320px] px-6 py-8">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Today</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time data from libre · whoop · garmin · synced{" "}
              <span style={mono}>{formatClock(Date.now() - 60_000)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-3 py-1.5"
              style={mono}
            >
              last 24h
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background"
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="mt-6 grid gap-3 lg:grid-cols-4">
          <Tile
            icon={<LineChart className="size-3.5" />}
            label="Glucose"
            value={formatGlucose(glucose.current)}
            unit="mmol/L"
            delta="stable"
            deltaTone="ok"
          />
          <Tile
            icon={<Activity className="size-3.5" />}
            label="Time in range"
            value={`${tir.inRange}%`}
            delta={`${tir.below}% below`}
            deltaTone="warn"
          />
          <Tile
            icon={<Heart className="size-3.5" />}
            label="Recovery"
            value={`${recovery.score}`}
            unit="/ 100"
            delta={`HRV ${recovery.hrv}ms`}
            deltaTone="ok"
          />
          <Tile
            icon={<MapPin className="size-3.5" />}
            label="Distance today"
            value={formatDistance(workout.distance)}
            delta={formatPace(workout.duration, workout.distance)}
          />
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-8 rounded-lg border border-border/60 bg-card">
            <header className="flex items-baseline justify-between border-b border-border/60 px-5 py-3">
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  glucose.trace
                </p>
                <span className="text-[11px] text-muted-foreground" style={mono}>
                  96 points
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground" style={mono}>
                avg {formatGlucose(today.avg)} · gmi {today.gmi.toFixed(1)}
              </span>
            </header>
            <div className="px-5 py-5">
              <div className="h-44 text-foreground/80">
                <Sparkline
                  data={glucose.last24h}
                  width={800}
                  height={176}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="hsl(245 70% 60%)"
                  className="size-full"
                />
              </div>
              <div
                className="mt-3 flex justify-between text-[10px] text-muted-foreground"
                style={mono}
              >
                <span>−24h</span>
                <span>−18h</span>
                <span>−12h</span>
                <span>−6h</span>
                <span>now</span>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4 rounded-lg border border-border/60 bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">today.events</p>
            <ul className="mt-3 space-y-2 text-sm">
              {treatments.slice(0, 7).map((t) => (
                <li
                  key={t.t}
                  className="grid items-center gap-3 text-sm"
                  style={{ gridTemplateColumns: "55px 24px 1fr auto" }}
                >
                  <span className="tabular-nums text-muted-foreground" style={mono}>
                    {formatClock(t.t)}
                  </span>
                  <span
                    className={`grid size-5 place-items-center rounded text-[10px] font-mono ${kindBadge(t.kind)}`}
                  >
                    {kindLetter(t.kind)}
                  </span>
                  <span className="truncate">{t.label}</span>
                  <span className="tabular-nums text-muted-foreground" style={mono}>
                    {t.detail ?? ""}
                  </span>
                </li>
              ))}
            </ul>
            <hr className="my-4 border-border/40" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground">sources</p>
            <ul className="mt-2 space-y-1 text-xs" style={mono}>
              <li className="flex justify-between">
                <span>libre.linkup</span>
                <span className="text-emerald-600 dark:text-emerald-400">● healthy</span>
              </li>
              <li className="flex justify-between">
                <span>whoop.api</span>
                <span className="text-emerald-600 dark:text-emerald-400">● healthy</span>
              </li>
              <li className="flex justify-between">
                <span>garmin.connect</span>
                <span className="text-amber-600 dark:text-amber-400">● syncing</span>
              </li>
            </ul>
          </aside>
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-7 overflow-hidden rounded-lg border border-border/60 bg-card">
            <header className="flex items-baseline justify-between border-b border-border/60 px-5 py-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  activity.run
                </p>
                <h3 className="mt-0.5 text-base font-medium">
                  {workout.sport} · {formatDistance(workout.distance)}
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                style={mono}
              >
                open <ArrowUpRight className="size-3" />
              </button>
            </header>
            <div className="aspect-[16/8] w-full">
              <Map center={ROUTE_CENTER} zoom={12.5} className="size-full">
                <MapRoute coordinates={coords} color="#fafafa" width={3} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-5 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background shadow-md ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 divide-x divide-border/60">
              <Cell label="distance" value={formatDistance(workout.distance)} />
              <Cell label="time" value={formatDuration(workout.duration)} />
              <Cell label="pace" value={formatPace(workout.duration, workout.distance)} />
              <Cell label="ΔBG" value={`${workout.glucoseDelta.toFixed(1)}`} accent />
            </div>
          </article>

          <article className="lg:col-span-5 rounded-lg border border-border/60 bg-card">
            <header className="flex items-baseline justify-between border-b border-border/60 px-5 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">weekly.tir</p>
              <span className="text-[11px] tabular-nums text-muted-foreground" style={mono}>
                avg {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}%
              </span>
            </header>
            <div className="px-5 py-4">
              <table className="w-full text-sm">
                <tbody>
                  {weeklyTIR.map((d) => (
                    <tr key={d.date} className="border-t border-border/40 first:border-t-0">
                      <td className="py-1.5 text-xs text-muted-foreground" style={mono}>
                        {d.weekday}
                      </td>
                      <td className="py-1.5 text-xs text-muted-foreground" style={mono}>
                        {d.date}
                      </td>
                      <td className="py-1.5 text-right tabular-nums" style={mono}>
                        {d.inRange}%
                      </td>
                      <td className="w-1/2 py-1.5 pl-3">
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-foreground"
                            style={{ width: `${d.inRange}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="mt-3 rounded-lg border border-border/60 bg-card">
          <header className="flex items-baseline justify-between border-b border-border/60 px-5 py-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">recent.runs</p>
            <button
              type="button"
              className="text-[11px] text-muted-foreground hover:text-foreground"
              style={mono}
            >
              see all →
            </button>
          </header>
          <table className="w-full text-sm">
            <thead className="border-b border-border/40">
              <tr className="text-left text-xs text-muted-foreground" style={mono}>
                <th className="px-5 py-2 font-normal">when</th>
                <th className="px-5 py-2 font-normal">sport</th>
                <th className="px-5 py-2 font-normal">distance</th>
                <th className="px-5 py-2 font-normal">pace</th>
                <th className="px-5 py-2 font-normal">avg HR</th>
                <th className="px-5 py-2 font-normal">strain</th>
                <th className="px-5 py-2 text-right font-normal">ΔBG</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkouts.map((w) => (
                <tr key={w.id} className="border-t border-border/40">
                  <td className="px-5 py-2.5 text-muted-foreground" style={mono}>
                    {w.date}
                  </td>
                  <td className="px-5 py-2.5">{w.sport}</td>
                  <td className="px-5 py-2.5 tabular-nums" style={mono}>
                    {formatDistance(w.distance)}
                  </td>
                  <td className="px-5 py-2.5 tabular-nums" style={mono}>
                    {formatPace(w.duration, w.distance)}
                  </td>
                  <td className="px-5 py-2.5 tabular-nums" style={mono}>
                    {w.avgHr}
                  </td>
                  <td className="px-5 py-2.5 tabular-nums" style={mono}>
                    {w.strain.toFixed(1)}
                  </td>
                  <td
                    className="px-5 py-2.5 text-right tabular-nums"
                    style={{
                      ...mono,
                      color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "var(--color-glucose-high)",
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
  );
}

function Tile({
  icon,
  label,
  value,
  unit,
  delta,
  deltaTone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "ok" | "warn" | "alt";
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground" style={mono}>
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5 text-3xl font-medium tabular-nums tracking-tight">
        {value}
        {unit ? <span className="text-sm font-normal text-muted-foreground">{unit}</span> : null}
      </p>
      {delta ? (
        <p
          className="text-[11px] tabular-nums"
          style={{
            ...mono,
            color:
              deltaTone === "ok"
                ? "rgb(16 185 129)"
                : deltaTone === "warn"
                  ? "rgb(217 119 6)"
                  : "var(--muted-foreground)",
          }}
        >
          {delta}
        </p>
      ) : null}
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="px-5 py-3.5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-sm tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}
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
  return kind === "insulin" ? "i" : kind === "carbs" ? "c" : kind === "exercise" ? "e" : "·";
}
