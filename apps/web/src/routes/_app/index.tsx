import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Sparkline } from "~/components/charts/sparkline";
import { PageTopbar } from "~/components/app/topbar";
import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from "~/components/ui/map";
import {
  formatClock,
  formatDistance,
  formatDuration,
  formatGlucose,
  formatPace,
  mockData,
  ROUTE_CENTER,
} from "~/data/mock";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

function Dashboard() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments } = mockData;
  const coords: [number, number][] = mockData.route.map((p) => [p.lng, p.lat]);

  return (
    <>
      <PageTopbar
        title="Today"
        meta="your session in glance"
        windows={["1h", "4h", "24h", "7d", "30d"]}
        activeWindow="24h"
      />
      <main className="grid gap-3 px-6 py-5 lg:grid-cols-12">
        <article className="lg:col-span-5 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <div className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              current glucose
            </p>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
              stable · 4 min ago
            </span>
          </div>
          <p className="mt-3 text-7xl font-semibold leading-[0.85] tabular-nums" style={display}>
            {formatGlucose(glucose.current)}
          </p>
          <p className="text-sm text-muted-foreground">mmol/L · target 3.9 – 10.0</p>
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
          <Link
            to="/glucose"
            className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            style={mono}
          >
            see all glucose data <ArrowUpRight className="size-3" />
          </Link>
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
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                route · today
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight" style={display}>
                Vondelpark loop
              </h3>
            </div>
            <Link
              to="/activity/$id"
              params={{ id: workout.id }}
              className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1.5 text-xs hover:bg-muted"
            >
              Open run <ArrowUpRight className="size-3" />
            </Link>
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
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              events · today
            </p>
            <Link
              to="/treatments"
              className="text-[11px] text-muted-foreground hover:text-foreground"
              style={mono}
            >
              all events →
            </Link>
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
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              recent · runs
            </p>
            <Link
              to="/activity"
              className="text-xs text-muted-foreground hover:text-foreground"
              style={mono}
            >
              see all →
            </Link>
          </header>
          <table className="w-full text-sm" style={data}>
            <thead className="border-y border-border/40 text-xs text-muted-foreground">
              <tr>
                {["when", "sport", "distance", "duration", "pace", "avg HR", "strain", "ΔBG"].map(
                  (h) => (
                    <th key={h} className="px-5 py-2 text-left font-normal">
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
                  className="border-b border-border/30 last:border-b-0 hover:bg-muted/40"
                >
                  <td className="px-5 py-2 text-muted-foreground">
                    <Link
                      to="/activity/$id"
                      params={{ id: w.id }}
                      className="hover:text-foreground"
                    >
                      {w.date}
                    </Link>
                  </td>
                  <td className="px-5 py-2">{w.sport}</td>
                  <td className="px-5 py-2 tabular-nums">{formatDistance(w.distance)}</td>
                  <td className="px-5 py-2 tabular-nums">{formatDuration(w.duration)}</td>
                  <td className="px-5 py-2 tabular-nums">{formatPace(w.duration, w.distance)}</td>
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

      <footer className="px-6 pb-6 text-xs text-muted-foreground" style={mono}>
        avg today {formatGlucose(today.avg)} mmol/L · {today.readings} readings · gmi{" "}
        {today.gmi.toFixed(1)} · cv {today.cv}%
      </footer>
    </>
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
