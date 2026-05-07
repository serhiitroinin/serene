import { createFileRoute, notFound } from "@tanstack/react-router";
import { Heart, MapPin, Mountain, Timer } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { Sparkline } from "../../../components/charts/sparkline";
import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from "../../../components/ui/map";
import {
  computeRouteCenter,
  formatDistance,
  formatDuration,
  formatPace,
} from "../../../lib/format";
import { getActivityDetailFn } from "../../../server/functions/data";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/_app/activity/$id")({
  component: ActivityDetail,
  loader: async ({ params }) => {
    const detail = await getActivityDetailFn({ data: { id: params.id } });
    if (!detail) throw notFound();
    return detail;
  },
});

function ActivityDetail() {
  const a = Route.useLoaderData();
  const coords: [number, number][] = a.track.map((p) => [p.lng, p.lat]);
  const center = computeRouteCenter(a.track);
  const startISO = new Date(a.start).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <PageTopbar
        title={`${a.sport} · ${formatDistance(a.distance)}`}
        meta={startISO}
        back={{ to: "/activity", label: "all activity" }}
      />
      <main className="grid gap-3 px-6 py-5">
        <section className="overflow-hidden rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          {a.hasGps && coords.length > 0 ? (
            <div className="aspect-[16/7] w-full">
              <Map center={center} zoom={12.4} className="size-full">
                <MapRoute coordinates={coords} color="#10b981" width={4} opacity={0.95} />
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
          ) : (
            <div className="grid aspect-[16/7] place-items-center bg-muted/30 text-sm text-muted-foreground">
              {a.hasGps ? "Track points are still syncing…" : "This activity has no GPS recorded."}
            </div>
          )}
          <div className="grid grid-cols-2 divide-x divide-border/40 border-t border-border/40 sm:grid-cols-6">
            <Field
              icon={<MapPin className="size-3.5" />}
              label="Distance"
              value={formatDistance(a.distance)}
            />
            <Field
              icon={<Timer className="size-3.5" />}
              label="Time"
              value={formatDuration(a.duration)}
            />
            <Field label="Pace" value={formatPace(a.duration, a.distance)} />
            <Field
              icon={<Heart className="size-3.5" />}
              label="Avg HR"
              value={a.avgHr ? `${a.avgHr}` : "—"}
            />
            <Field label="Max HR" value={a.maxHr ? `${a.maxHr}` : "—"} />
            <Field
              icon={<Mountain className="size-3.5" />}
              label="Elevation"
              value={a.elevation ? `${Math.round(a.elevation)}m` : "—"}
            />
          </div>
        </section>

        {a.glucoseOverlap.length > 0 ? (
          <section className="rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              glucose during this activity
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums" style={display}>
              <span className="text-emerald-600 dark:text-emerald-400">
                {a.glucoseOverlap[0]!.v.toFixed(1)}
              </span>
              <span className="mx-2 text-muted-foreground text-sm">→</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {a.glucoseOverlap.at(-1)!.v.toFixed(1)}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                mmol/L · ΔBG {(a.glucoseOverlap.at(-1)!.v - a.glucoseOverlap[0]!.v).toFixed(1)}
              </span>
            </p>
            <div className="mt-4 h-32">
              <Sparkline
                data={a.glucoseOverlap}
                width={1200}
                height={128}
                showRangeBand
                strokeColor="hsl(150 60% 55%)"
                bandColor="hsl(150 60% 55%)"
                className="size-full"
              />
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
            No glucose readings during this activity. Check that LibreLinkUp was streaming when this
            activity was recorded.
          </section>
        )}
      </main>
    </>
  );
}

function Field({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <p
        className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        style={mono}
      >
        {icon}
        {label}
      </p>
      <p className="mt-1 text-lg tabular-nums" style={mono}>
        {value}
      </p>
    </div>
  );
}
