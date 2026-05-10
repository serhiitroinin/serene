import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CalendarClock,
  Plug,
} from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { Sparkline } from "~/components/charts/sparkline";
import {
  formatClock,
  formatDistance,
  formatDuration,
  formatGlucose,
  formatPace,
  formatRelativeTime,
} from "~/lib/format";
import { getDashboardFn } from "~/server/functions/data";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
  loader: () => getDashboardFn(),
});

function Dashboard() {
  const d = Route.useLoaderData();
  const hasGlucose = d.glucose.current != null;
  const hasReadings = d.glucose.readings.length > 0;
  const hasRecovery = d.recovery != null;
  const hasActivity = d.todayActivity != null;
  const noSourcesAtAll =
    !hasGlucose &&
    !hasRecovery &&
    !hasActivity &&
    d.recentActivities.length === 0 &&
    d.treatments.length === 0;

  return (
    <>
      <PageTopbar
        title="Today"
        meta="your session in glance"
        windows={["1h", "4h", "24h", "7d", "30d"]}
        activeWindow="24h"
      />
      <main className="grid gap-3 px-6 py-5 lg:grid-cols-12">
        {noSourcesAtAll ? (
          <div className="lg:col-span-12 rounded-3xl border border-dashed border-border/60 bg-card/60 p-10 text-center">
            <Plug className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-3 text-2xl font-semibold tracking-tight" style={display}>
              Connect a data source to see real numbers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              serene reads from LibreLinkUp, WHOOP, and Garmin Connect. Glucose lights up first;
              recovery and activity follow once their syncs land.
            </p>
            <Link
              to="/settings"
              search={{ tab: "sources" }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:bg-foreground/90"
            >
              Connect sources <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        ) : null}

        <article className="lg:col-span-5 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <div className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              current glucose
            </p>
            <span className="text-xs text-muted-foreground" style={mono}>
              {d.glucose.lastReadingAt ? formatRelativeTime(d.glucose.lastReadingAt) : "no data"}
            </span>
          </div>
          {hasGlucose ? (
            <>
              <p
                className="mt-3 flex items-baseline gap-3 text-7xl font-semibold leading-[0.85] tabular-nums"
                style={display}
              >
                {formatGlucose(d.glucose.current!)}
                <TrendArrow trend={d.glucose.trend} />
              </p>
              <p className="text-sm text-muted-foreground">
                mmol/L · target 3.9 – 10.0
                {d.overnightTir.inRange != null
                  ? ` · overnight TIR ${d.overnightTir.inRange}%`
                  : ""}
              </p>
              {hasReadings ? (
                <div className="mt-5 h-24 text-emerald-500/85">
                  <Sparkline
                    data={d.glucose.readings}
                    width={400}
                    height={96}
                    showRangeBand
                    strokeColor="currentColor"
                    bandColor="hsl(150 60% 55%)"
                    className="size-full"
                  />
                </div>
              ) : null}
            </>
          ) : (
            <EmptyHint label="Connect LibreLinkUp" />
          )}
        </article>

        <article className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
          <Stat
            tone="emerald"
            label="In range"
            value={hasGlucose ? `${d.tir.inRange}%` : "—"}
            sub={hasGlucose ? `${d.tir.below}% low · ${d.tir.above}% high` : "no glucose yet"}
            bar={hasGlucose ? d.tir.inRange : undefined}
          />
          <Stat
            tone="indigo"
            label="Recovery"
            value={hasRecovery ? `${d.recovery!.score}` : "—"}
            unit={hasRecovery ? "/100" : undefined}
            sub={
              hasRecovery
                ? `HRV ${d.recovery!.hrv}ms · ${d.recovery!.sleep}h sleep`
                : "connect WHOOP"
            }
            bar={hasRecovery ? d.recovery!.score : undefined}
          />
          <Stat
            tone="rose"
            label="Strain"
            value={hasRecovery ? d.recovery!.strain.toFixed(1) : "—"}
            sub={hasActivity ? `avg HR ${d.todayActivity!.avgHr}` : "no workout today"}
          />
          {hasActivity ? (
            <Stat
              tone="amber"
              label="Today's run"
              value={formatDistance(d.todayActivity!.distance)}
              sub={`${formatDuration(d.todayActivity!.duration)} · ${formatPace(d.todayActivity!.duration, d.todayActivity!.distance)}`}
            />
          ) : d.todaysPlanned ? (
            <PlannedStat planned={d.todaysPlanned} />
          ) : (
            <Stat tone="amber" label="Today's run" value="—" sub="connect Garmin" />
          )}
        </article>

        <article className="lg:col-span-7 rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          <header className="flex items-baseline justify-between p-5 pb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              today's stats
            </p>
            <span className="text-xs text-muted-foreground" style={mono}>
              {hasReadings ? `${d.today.readings} readings · 24h` : "—"}
            </span>
          </header>
          <div className="grid grid-cols-4 gap-0 divide-x divide-border/40 text-sm">
            <Cell label="Average" value={hasGlucose ? `${formatGlucose(d.today.avg)} mmol` : "—"} />
            <Cell label="GMI" value={hasGlucose ? d.today.gmi.toFixed(1) : "—"} />
            <Cell label="Std dev" value={hasGlucose ? d.today.sd.toFixed(1) : "—"} />
            <Cell label="CV" value={hasGlucose ? `${d.today.cv}%` : "—"} />
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
          {d.treatments.length > 0 ? (
            <ul className="divide-y divide-border/40">
              {d.treatments.slice(0, 7).map((t) => (
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
          ) : (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              No treatments logged today. Manual logging lands in v0.2.
            </p>
          )}
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
          {d.recentActivities.length > 0 ? (
            <table className="w-full text-sm" style={data}>
              <thead className="border-y border-border/40 text-xs text-muted-foreground">
                <tr>
                  {["when", "sport", "distance", "duration", "pace"].map((h) => (
                    <th key={h} className="px-5 py-2 text-left font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.recentActivities.map((w) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              No activities yet. Connect Garmin to pull recent runs.
            </p>
          )}
        </article>
      </main>
    </>
  );
}

function TrendArrow({
  trend,
}: {
  trend: "rising_quick" | "rising" | "stable" | "falling" | "falling_quick" | null;
}) {
  if (!trend) return null;
  const Icon = (
    {
      rising_quick: ArrowUp,
      rising: ArrowUpRight,
      stable: ArrowRight,
      falling: ArrowDownRight,
      falling_quick: ArrowDown,
    } as const
  )[trend];
  const color = trend.startsWith("falling")
    ? "text-amber-500"
    : trend.startsWith("rising")
      ? "text-rose-500"
      : "text-emerald-500";
  return (
    <span className={`text-3xl ${color}`} aria-label={trend}>
      <Icon className="size-7" />
    </span>
  );
}

function PlannedStat({
  planned,
}: {
  planned: {
    name: string;
    sport: string | null;
    durationSeconds: number | null;
    planName: string | null;
  };
}) {
  return (
    <article className="rounded-2xl bg-card/95 p-5 ring-1 ring-amber-500/30 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        Today's plan
      </p>
      <p
        className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight"
        style={display}
      >
        <CalendarClock className="size-4 text-amber-500" />
        <span className="truncate">{planned.name}</span>
      </p>
      <p className="mt-1 truncate text-xs text-muted-foreground" style={mono}>
        {[
          planned.sport,
          planned.durationSeconds ? formatDuration(planned.durationSeconds) : null,
          planned.planName,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </article>
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
  unit?: string | undefined;
  sub?: string | undefined;
  bar?: number | undefined;
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

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        {label}
      </p>
      <p className="mt-1 text-lg tabular-nums" style={mono}>
        {value}
      </p>
    </div>
  );
}

function EmptyHint({ label }: { label: string }) {
  return (
    <Link
      to="/settings"
      search={{ tab: "sources" }}
      className="mt-3 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-xs text-background hover:bg-foreground/90"
    >
      {label} <ArrowUpRight className="size-3" />
    </Link>
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
