import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { AntiScopeFooter } from "~/components/app/anti-scope-footer";
import { GlucoseTintedRoute } from "~/components/app/glucose-tinted-route";
import { WorkoutOverlay, ZoneStats } from "~/components/charts/workout-overlay";
import { ThemeToggle } from "~/components/theme-toggle";
import { Map, MapControls, MapMarker, MarkerContent } from "~/components/ui/map";
import { computeRouteCenter, formatDistance, formatDuration, formatPace } from "~/lib/format";
import { getSharedActivityFn } from "~/server/functions/share";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/share/$token")({
  component: SharePage,
  loader: async ({ params }) => getSharedActivityFn({ data: { token: params.token } }),
});

function SharePage() {
  const result = Route.useLoaderData();

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(50% 60% at 30% 0%, color-mix(in oklch, oklch(0.74 0.14 160) 16%, transparent), transparent 75%)",
        }}
      />
      <header className="relative">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-violet-400 text-xs font-bold text-white">
              s
            </span>
            <p className="text-sm font-semibold tracking-tight" style={display}>
              serene · shared activity
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl flex-1 px-6 pb-10">
        {result.ok ? (
          <SharedActivity data={result.activity} />
        ) : (
          <SharedError reason={result.reason} />
        )}
      </main>
      <AntiScopeFooter />
    </div>
  );
}

function SharedError({ reason }: { reason: "not-found" | "expired" }) {
  const isExpired = reason === "expired";
  return (
    <div className="rounded-3xl border border-dashed border-border/60 bg-card/60 p-8 text-center backdrop-blur-xl">
      <Lock className="mx-auto size-8 text-muted-foreground" />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight" style={display}>
        {isExpired ? "This share link has expired" : "Share link not found"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isExpired
          ? "Ask the athlete for a fresh link."
          : "The link may have been revoked or the URL is incorrect."}
      </p>
    </div>
  );
}

type ActivityData = {
  sport: string;
  start: number;
  duration: number;
  distance: number;
  avgHr: number;
  maxHr: number;
  elevation: number;
  hasGps: boolean;
  track: ReadonlyArray<{
    lat: number;
    lng: number;
    t: number;
    hr: number | null;
    speed: number | null;
  }>;
  glucoseOverlap: ReadonlyArray<{ t: number; v: number }>;
};

function SharedActivity({ data: a }: { data: ActivityData }) {
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
    <div className="grid gap-3">
      <header className="rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          {startISO}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight" style={display}>
          {a.sport} · {formatDistance(a.distance)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground" style={mono}>
          {formatDuration(a.duration)} · {formatPace(a.duration, a.distance)} · avg HR{" "}
          {a.avgHr || "—"}
        </p>
      </header>

      {a.hasGps && coords.length > 0 ? (
        <section className="overflow-hidden rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          <div className="aspect-[16/7] w-full">
            <Map center={center} zoom={12.4} className="size-full">
              <GlucoseTintedRoute track={a.track} glucose={a.glucoseOverlap} />
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
        </section>
      ) : null}

      {a.glucoseOverlap.length > 0 ? (
        <section className="rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
            glucose × workout · synced timeline
          </p>
          <div className="mt-4 h-72">
            <WorkoutOverlay
              start={a.start}
              duration={a.duration}
              track={a.track}
              glucose={a.glucoseOverlap}
              className="size-full"
            />
          </div>
          {a.maxHr > 0 ? (
            <div className="mt-5">
              <p
                className="mb-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                style={mono}
              >
                median glucose per HR zone
              </p>
              <ZoneStats track={a.track} glucose={a.glucoseOverlap} maxHr={a.maxHr} />
            </div>
          ) : null}
          <p className="mt-4 text-[11px] text-muted-foreground" style={mono}>
            Descriptive view; not a prediction.
          </p>
        </section>
      ) : null}
    </div>
  );
}
