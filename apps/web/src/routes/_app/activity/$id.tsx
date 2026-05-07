import { createFileRoute, notFound } from "@tanstack/react-router";
import { Heart, MapPin, Mountain, Share2, Timer, Zap } from "lucide-react";
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
} from "~/data";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

export const Route = createFileRoute("/_app/activity/$id")({
  component: ActivityDetail,
  loader: ({ params }) => {
    const w = mockData.recentWorkouts.find((x) => x.id === params.id);
    if (!w) throw notFound();
    return { workout: w };
  },
});

function ActivityDetail() {
  const { workout } = Route.useLoaderData();
  const { glucose, route } = mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  // Mock splits
  const splitCount = Math.max(1, Math.round(workout.distance / 1000));
  const splits = Array.from({ length: splitCount }, (_, i) => ({
    km: i + 1,
    pace: 360 + Math.sin(i / 2) * 20 + (i === splitCount - 1 ? 25 : 0),
    hr: workout.avgHr + Math.sin(i) * 8 + (i > splitCount - 3 ? 10 : 0),
    elevation: 2 + Math.cos(i / 3) * 4,
    glucose: 7.5 - i * 0.25 + Math.sin(i) * 0.4,
  }));

  return (
    <>
      <PageTopbar
        title={`${workout.sport} · ${formatDistance(workout.distance)}`}
        meta={workout.date}
        back={{ to: "/activity", label: "all activity" }}
        right={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2.5 py-1 text-xs hover:bg-muted/40"
            style={mono}
          >
            <Share2 className="size-3" /> share
          </button>
        }
      />
      <main className="grid gap-3 px-6 py-5">
        <section className="overflow-hidden rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          <div className="aspect-[16/7] w-full">
            <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
              <MapRoute coordinates={coords} color="#10b981" width={4} opacity={0.95} />
              <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                <MarkerContent>
                  <span className="grid size-7 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-lg ring-2 ring-background">
                    S
                  </span>
                </MarkerContent>
              </MapMarker>
              <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                <MarkerContent>
                  <span className="grid size-7 place-items-center rounded-full bg-violet-500 text-xs font-bold text-white shadow-lg ring-2 ring-background">
                    F
                  </span>
                </MarkerContent>
              </MapMarker>
              <MapControls position="top-right" />
            </Map>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border/40 border-t border-border/40 sm:grid-cols-7">
            <Field
              icon={<MapPin className="size-3.5" />}
              label="Distance"
              value={formatDistance(workout.distance)}
            />
            <Field
              icon={<Timer className="size-3.5" />}
              label="Time"
              value={formatDuration(workout.duration)}
            />
            <Field label="Pace" value={formatPace(workout.duration, workout.distance)} />
            <Field
              icon={<Heart className="size-3.5" />}
              label="Avg HR"
              value={`${workout.avgHr}`}
            />
            <Field label="Max HR" value={`${workout.avgHr + 18}`} />
            <Field icon={<Mountain className="size-3.5" />} label="Elevation" value="124m" />
            <Field
              icon={<Zap className="size-3.5" />}
              label="Strain"
              value={workout.strain.toFixed(1)}
              accent="amber"
            />
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-7 rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                glucose · synced to workout
              </p>
              <span className="text-xs text-muted-foreground" style={mono}>
                peak {Math.max(...splits.map((s) => s.glucose)).toFixed(1)} · low{" "}
                {Math.min(...splits.map((s) => s.glucose)).toFixed(1)}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums" style={display}>
              <span className="text-emerald-600 dark:text-emerald-400">7.6</span>
              <span className="mx-2 text-muted-foreground text-sm">→</span>
              <span className="text-emerald-600 dark:text-emerald-400">5.5</span>
              <span className="ml-2 text-sm text-muted-foreground">
                mmol/L · ΔBG {workout.glucoseDelta.toFixed(1)}
              </span>
            </p>
            <div className="mt-4 h-40">
              <Sparkline
                data={glucose.last24h.slice(0, 30)}
                width={780}
                height={160}
                showRangeBand
                strokeColor="hsl(150 60% 55%)"
                bandColor="hsl(150 60% 55%)"
                className="size-full"
              />
            </div>
            <div
              className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground"
              style={mono}
            >
              <span>start · {formatClock(Date.now() - workout.duration * 1000)}</span>
              <span>
                finish ·{" "}
                {formatClock(Date.now() - workout.duration * 1000 + workout.duration * 1000)}
              </span>
            </div>
          </article>

          <article className="lg:col-span-5 rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              during the run
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-baseline justify-between border-b border-border/40 pb-2">
                <span>Recovery shake intake</span>
                <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                  +55 g · post-run
                </span>
              </li>
              <li className="flex items-baseline justify-between border-b border-border/40 pb-2">
                <span>NovoRapid</span>
                <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                  5.0 u · post-shake
                </span>
              </li>
              <li className="flex items-baseline justify-between border-b border-border/40 pb-2">
                <span>Mid-run almonds</span>
                <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                  8 g · km 11
                </span>
              </li>
              <li className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Notes</span>
                <span className="text-xs italic text-muted-foreground">none</span>
              </li>
            </ul>
            <button
              type="button"
              className="mt-4 w-full rounded-md border border-dashed border-border/60 px-3 py-2 text-xs text-muted-foreground hover:bg-muted/30"
            >
              + Add a note
            </button>
          </article>
        </section>

        <section className="rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          <header className="flex items-baseline justify-between p-5 pb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              splits · per kilometre
            </p>
            <span className="text-xs text-muted-foreground" style={mono}>
              {splitCount} splits
            </span>
          </header>
          <table className="w-full text-sm" style={data}>
            <thead className="border-y border-border/40 text-xs text-muted-foreground">
              <tr>
                {["km", "pace", "Δ pace", "HR", "elev", "glucose"].map((h) => (
                  <th key={h} className="px-5 py-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {splits.map((s, i) => {
                const m = Math.floor(s.pace / 60);
                const sec = Math.round(s.pace % 60);
                const prev = splits[i - 1];
                const dpace = prev ? s.pace - prev.pace : 0;
                return (
                  <tr key={s.km} className="border-b border-border/30 last:border-b-0">
                    <td className="px-5 py-2 tabular-nums">{s.km}</td>
                    <td className="px-5 py-2 tabular-nums">
                      {m}:{sec.toString().padStart(2, "0")}/km
                    </td>
                    <td
                      className="px-5 py-2 tabular-nums"
                      style={{
                        color:
                          dpace < 0 ? "rgb(16 185 129)" : dpace > 5 ? "rgb(244 63 94)" : undefined,
                      }}
                    >
                      {i === 0 ? "—" : `${dpace > 0 ? "+" : ""}${Math.round(dpace)}s`}
                    </td>
                    <td className="px-5 py-2 tabular-nums">{Math.round(s.hr)}</td>
                    <td className="px-5 py-2 tabular-nums">
                      {s.elevation > 0 ? "+" : ""}
                      {s.elevation.toFixed(1)}m
                    </td>
                    <td className="px-5 py-2 tabular-nums">{formatGlucose(s.glucose)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}

function Field({
  icon,
  label,
  value,
  accent,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  accent?: "amber" | "emerald";
}) {
  const color =
    accent === "amber"
      ? "text-amber-600 dark:text-amber-400"
      : accent === "emerald"
        ? "text-emerald-600 dark:text-emerald-400"
        : "";
  return (
    <div className="px-5 py-4">
      <p
        className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        style={mono}
      >
        {icon}
        {label}
      </p>
      <p className={`mt-1 text-lg tabular-nums ${color}`} style={mono}>
        {value}
      </p>
    </div>
  );
}
