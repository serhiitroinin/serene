import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plug } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { formatDistance, formatDuration, formatPace } from "~/lib/format";
import { getActivityListFn } from "~/server/functions/data";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

export const Route = createFileRoute("/_app/activity/")({
  component: ActivityList,
  loader: () => getActivityListFn(),
});

function ActivityList() {
  const activities = Route.useLoaderData();
  const empty = activities.length === 0;
  const totalKm = activities.reduce((s, w) => s + w.distance, 0);
  const totalSec = activities.reduce((s, w) => s + w.duration, 0);

  return (
    <>
      <PageTopbar title="Activity" meta="all efforts" />
      <main className="grid gap-3 px-6 py-5">
        {empty ? (
          <article className="rounded-3xl border border-dashed border-border/60 bg-card/60 p-10 text-center">
            <Plug className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-3 text-2xl font-semibold tracking-tight" style={display}>
              No activities yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect Garmin Connect from the Settings → Data sources tab. We pull recent activities
              every 30 minutes and grab GPS for the latest run.
            </p>
            <Link
              to="/settings"
              search={{ tab: "sources" }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:bg-foreground/90"
            >
              Connect Garmin <ArrowUpRight className="size-3.5" />
            </Link>
          </article>
        ) : (
          <>
            <section className="grid gap-3 lg:grid-cols-3">
              <Stat
                label="Distance · last 50"
                value={formatDistance(totalKm)}
                sub={`${activities.length} efforts`}
              />
              <Stat
                label="Time · last 50"
                value={formatDuration(totalSec)}
                sub={`avg ${formatDuration(totalSec / activities.length)}/run`}
              />
              <Stat
                label="With GPS"
                value={`${activities.filter((a) => a.hasGps).length}`}
                sub={`of ${activities.length}`}
              />
            </section>

            <section className="rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
              <header className="flex items-baseline justify-between p-5 pb-3">
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  full table
                </p>
                <span className="text-[11px] text-muted-foreground" style={mono}>
                  {activities.length} activities
                </span>
              </header>
              <table className="w-full text-sm" style={data}>
                <thead className="border-y border-border/40 text-xs text-muted-foreground">
                  <tr>
                    {["when", "sport", "distance", "duration", "pace", "avg HR", "elev", "gps"].map(
                      (h) => (
                        <th key={h} className="px-5 py-2 text-left font-normal">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activities.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-border/30 last:border-b-0 hover:bg-muted/40"
                    >
                      <td className="px-5 py-2.5 text-muted-foreground">
                        <Link
                          to="/activity/$id"
                          params={{ id: w.id }}
                          className="hover:text-foreground"
                        >
                          {w.date}
                        </Link>
                      </td>
                      <td className="px-5 py-2.5">{w.sport}</td>
                      <td className="px-5 py-2.5 tabular-nums">{formatDistance(w.distance)}</td>
                      <td className="px-5 py-2.5 tabular-nums">{formatDuration(w.duration)}</td>
                      <td className="px-5 py-2.5 tabular-nums">
                        {formatPace(w.duration, w.distance)}
                      </td>
                      <td className="px-5 py-2.5 tabular-nums">{w.avgHr || "—"}</td>
                      <td className="px-5 py-2.5 tabular-nums">
                        {w.elevation ? `${Math.round(w.elevation)}m` : "—"}
                      </td>
                      <td className="px-5 py-2.5">{w.hasGps ? "✓" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <article className="rounded-2xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums" style={display}>
        {value}
      </p>
      {sub ? (
        <p className="text-xs text-muted-foreground" style={mono}>
          {sub}
        </p>
      ) : null}
    </article>
  );
}
