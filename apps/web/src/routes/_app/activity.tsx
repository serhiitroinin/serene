import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowUpRight, Bike, Dumbbell, Search, Waves } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { formatDistance, formatDuration, formatPace, mockData } from "~/data/mock";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

export const Route = createFileRoute("/_app/activity")({
  component: ActivityList,
});

function ActivityList() {
  const { recentWorkouts } = mockData;
  const totalKm = recentWorkouts.reduce((s, w) => s + w.distance, 0);
  const totalSec = recentWorkouts.reduce((s, w) => s + w.duration, 0);
  const totalStrain = recentWorkouts.reduce((s, w) => s + w.strain, 0);

  return (
    <>
      <PageTopbar
        title="Activity"
        meta="all efforts"
        right={
          <div
            className="hidden items-center gap-2 rounded-md border border-border/60 bg-card/80 px-2.5 py-1 text-xs text-muted-foreground sm:flex"
            style={mono}
          >
            <Search className="size-3" />
            <span>search runs…</span>
          </div>
        }
      />
      <main className="grid gap-3 px-6 py-5">
        <section className="grid gap-3 lg:grid-cols-4">
          <Stat
            label="Distance · 30d"
            value={formatDistance(totalKm)}
            sub={`${recentWorkouts.length} efforts`}
          />
          <Stat
            label="Time · 30d"
            value={formatDuration(totalSec)}
            sub={`avg ${formatDuration(totalSec / recentWorkouts.length)}/run`}
          />
          <Stat
            label="Avg strain"
            value={(totalStrain / recentWorkouts.length).toFixed(1)}
            sub="last 30d"
          />
          <Stat label="Marathon" value="39 days" sub="plan on track" />
        </section>

        <section className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill
              icon={<Activity className="size-3.5" />}
              label="All"
              count={recentWorkouts.length}
              active
            />
            <FilterPill
              icon={<Activity className="size-3.5" />}
              label="Run"
              count={recentWorkouts.filter((w) => w.sport === "Run").length}
            />
            <FilterPill
              icon={<Bike className="size-3.5" />}
              label="Ride"
              count={recentWorkouts.filter((w) => w.sport === "Ride").length}
            />
            <FilterPill
              icon={<Waves className="size-3.5" />}
              label="Swim"
              count={recentWorkouts.filter((w) => w.sport === "Swim").length}
            />
            <FilterPill
              icon={<Dumbbell className="size-3.5" />}
              label="Strength"
              count={recentWorkouts.filter((w) => w.sport === "Strength").length}
            />
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 p-0.5 text-xs"
            style={mono}
          >
            {["7d", "30d", "90d", "1y"].map((w, i) => (
              <button
                key={w}
                type="button"
                className={`rounded-full px-2.5 py-1 ${i === 1 ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {w}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          {recentWorkouts.map((w) => (
            <Link
              key={w.id}
              to="/activity/$id"
              params={{ id: w.id }}
              className="group flex overflow-hidden rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl transition-colors hover:border-emerald-500/40"
            >
              <div className="aspect-square w-32 shrink-0 bg-gradient-to-br from-emerald-500/15 via-card to-violet-500/15">
                <FakeMapTile sport={w.sport} />
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    {w.date}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight" style={display}>
                    {w.sport} · {formatDistance(w.distance)}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground" style={mono}>
                    {formatPace(w.duration, w.distance)} · {formatDuration(w.duration)} · avg HR{" "}
                    {w.avgHr}
                  </p>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] tabular-nums text-amber-700 dark:text-amber-300"
                    style={mono}
                  >
                    strain {w.strain.toFixed(1)}
                  </span>
                  <span
                    className="text-xs tabular-nums"
                    style={{
                      ...mono,
                      color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(244 63 94)",
                    }}
                  >
                    Δ {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)} mmol
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          <header className="flex items-baseline justify-between p-5 pb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              full table · last {recentWorkouts.length}
            </p>
            <span className="text-[11px] text-muted-foreground" style={mono}>
              sortable, exportable (post-v1)
            </span>
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
                  <td className="px-5 py-2.5 tabular-nums">{formatPace(w.duration, w.distance)}</td>
                  <td className="px-5 py-2.5 tabular-nums">{w.avgHr}</td>
                  <td className="px-5 py-2.5 tabular-nums">{w.strain.toFixed(1)}</td>
                  <td
                    className="px-5 py-2.5 text-right tabular-nums"
                    style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(244 63 94)" }}
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
    </>
  );
}

function FilterPill({
  icon,
  label,
  count,
  active,
}: {
  icon?: React.ReactNode;
  label: string;
  count: number;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground"
      }`}
      style={mono}
    >
      {icon}
      <span>{label}</span>
      <span className="opacity-70">{count}</span>
    </button>
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

function FakeMapTile({ sport }: { sport: string }) {
  const seed = sport.charCodeAt(0);
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      <g stroke="currentColor" strokeWidth={0.4} opacity={0.18}>
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={(i + 1) * 14} y1={0} x2={(i + 1) * 14} y2={100} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(i + 1) * 14} x2={100} y2={(i + 1) * 14} />
        ))}
      </g>
      <path
        d={`M 10 ${50 + (seed % 20)} Q ${30 + (seed % 10)} ${20 + (seed % 30)}, 50 50 T 90 ${40 + (seed % 25)}`}
        fill="none"
        stroke="rgb(16 185 129)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={10} cy={50 + (seed % 20)} r={2.5} fill="rgb(16 185 129)" />
      <circle
        cx={90}
        cy={40 + (seed % 25)}
        r={2.5}
        fill="none"
        stroke="rgb(16 185 129)"
        strokeWidth={1.5}
      />
    </svg>
  );
}
