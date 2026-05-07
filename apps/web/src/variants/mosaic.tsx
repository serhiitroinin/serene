import { ArrowUpRight, Heart, Moon, Zap } from "lucide-react";
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

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

export function MosaicVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background p-3 text-foreground sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(45% 60% at 100% 0%, color-mix(in oklch, oklch(0.75 0.15 180) 16%, transparent), transparent 75%), radial-gradient(45% 50% at 0% 100%, color-mix(in oklch, oklch(0.78 0.15 30) 14%, transparent), transparent 75%)",
        }}
      />

      <div className="relative">
        <header className="mb-3 flex items-center justify-between rounded-3xl border border-border/40 bg-card/85 px-5 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-teal-400 to-amber-400 text-xs font-bold text-white">
              s
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              serene
            </span>
            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500" /> in range
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 p-0.5 text-xs"
            style={mono}
          >
            {["1h", "4h", "24h", "7d", "30d"].map((w, i) => (
              <button
                key={w}
                type="button"
                className={`rounded-full px-2.5 py-1 ${i === 2 ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {w}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-3 lg:grid-cols-12">
          <Tile className="lg:col-span-3 lg:row-span-2" tone="teal">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              glucose
            </p>
            <p
              className="mt-3 text-7xl font-semibold leading-[0.85] tabular-nums tracking-tight"
              style={display}
            >
              {formatGlucose(glucose.current)}
            </p>
            <p className="text-sm text-muted-foreground">mmol/L · stable</p>
            <div className="mt-5 h-24 text-teal-500/80">
              <Sparkline
                data={glucose.last24h}
                width={300}
                height={96}
                showRangeBand
                strokeColor="currentColor"
                bandColor="hsl(180 60% 55%)"
                className="size-full"
              />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs" style={mono}>
              <KV label="avg" value={formatGlucose(today.avg)} />
              <KV label="gmi" value={today.gmi.toFixed(1)} />
              <KV label="cv" value={`${today.cv}%`} />
              <KV label="reads" value={today.readings.toString()} />
            </div>
          </Tile>

          <Tile className="lg:col-span-3" tone="emerald">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              time in range
            </p>
            <p className="mt-2 text-5xl font-semibold tabular-nums" style={display}>
              {tir.inRange}%
            </p>
            <div className="mt-3 flex h-1.5 overflow-hidden rounded-full">
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
            <p className="mt-2 text-[11px] text-muted-foreground" style={mono}>
              {tir.below}% low · {tir.above}% high
            </p>
          </Tile>

          <Tile className="lg:col-span-6 lg:row-span-3 p-0 overflow-hidden" tone="amber">
            <header className="flex items-baseline justify-between px-5 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                today's run · {formatDistance(workout.distance)}
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                style={mono}
              >
                open <ArrowUpRight className="size-3" />
              </button>
            </header>
            <div className="aspect-[16/9]">
              <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                <MapRoute coordinates={coords} color="#f59e0b" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 gap-2 p-4">
              {[
                ["Pace", formatPace(workout.duration, workout.distance)],
                ["Time", formatDuration(workout.duration)],
                ["Avg HR", `${workout.avgHr}`],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`, true],
              ].map(([k, v, accent]) => (
                <div key={k as string} className="rounded-xl bg-muted/50 px-3 py-2">
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-0.5 tabular-nums ${accent ? "text-amber-600 dark:text-amber-400" : ""}`}
                    style={data}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </Tile>

          <Tile className="lg:col-span-3" tone="indigo" icon={<Heart className="size-3.5" />}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              recovery
            </p>
            <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
              {recovery.score}
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              HRV {recovery.hrv}ms
            </p>
          </Tile>

          <Tile className="lg:col-span-3" tone="violet" icon={<Moon className="size-3.5" />}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              sleep
            </p>
            <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
              {recovery.sleep}h
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              RHR {recovery.rhr} bpm
            </p>
          </Tile>

          <Tile className="lg:col-span-3" tone="rose" icon={<Zap className="size-3.5" />}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              strain
            </p>
            <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
              {recovery.strain.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              peak HR {workout.avgHr + 18}
            </p>
          </Tile>

          <Tile className="lg:col-span-3" tone="muted">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              weekly · tir
            </p>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="text-center">
                  <div className="grid h-12 place-items-end overflow-hidden rounded-md bg-muted/40">
                    <div
                      className="w-full rounded-md"
                      style={{
                        height: `${d.inRange}%`,
                        backgroundColor: d.inRange >= 75 ? "rgb(45 212 191)" : "rgb(245 158 11)",
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-[9px] text-muted-foreground" style={mono}>
                    {d.weekday[0]}
                  </p>
                </div>
              ))}
            </div>
          </Tile>

          <Tile className="lg:col-span-6" tone="muted">
            <header className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                events · today
              </p>
              <span className="text-[11px] text-muted-foreground" style={mono}>
                {treatments.length}
              </span>
            </header>
            <ul className="mt-3 grid grid-cols-2 gap-1.5 text-xs" style={data}>
              {treatments.slice(0, 8).map((t) => (
                <li key={t.t} className="flex items-center gap-2 rounded-lg bg-muted/50 px-2 py-1">
                  <span className="tabular-nums text-muted-foreground">{formatClock(t.t)}</span>
                  <span className={`size-2 rounded-full ${kindDot(t.kind)}`} />
                  <span className="flex-1 truncate">{t.label}</span>
                  <span className="tabular-nums text-muted-foreground">{t.detail ?? ""}</span>
                </li>
              ))}
            </ul>
          </Tile>

          <Tile className="lg:col-span-6" tone="muted">
            <header className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                recent.runs
              </p>
              <button type="button" className="text-[11px] text-muted-foreground" style={mono}>
                see all →
              </button>
            </header>
            <ul className="mt-3 space-y-1 text-sm">
              {recentWorkouts.slice(0, 4).map((w) => (
                <li key={w.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {w.sport} · {formatDistance(w.distance)}
                    </p>
                    <p className="text-[11px] text-muted-foreground" style={mono}>
                      {w.date} · {formatPace(w.duration, w.distance)}
                    </p>
                  </div>
                  <span
                    className="text-xs tabular-nums"
                    style={{
                      ...mono,
                      color: w.glucoseDelta < 0 ? "rgb(45 212 191)" : "rgb(245 158 11)",
                    }}
                  >
                    Δ {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </Tile>
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
  tone: "teal" | "emerald" | "amber" | "indigo" | "violet" | "rose" | "muted";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const bar = {
    teal: "before:bg-teal-500",
    emerald: "before:bg-emerald-500",
    amber: "before:bg-amber-500",
    indigo: "before:bg-indigo-500",
    violet: "before:bg-violet-500",
    rose: "before:bg-rose-500",
    muted: "before:bg-muted-foreground/30",
  }[tone];
  return (
    <article
      className={`relative rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl before:absolute before:left-0 before:top-4 before:h-8 before:w-0.5 before:rounded-full ${bar} ${className}`}
    >
      {icon ? <div className="absolute right-4 top-4 text-muted-foreground">{icon}</div> : null}
      {children}
    </article>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 tabular-nums">{value}</p>
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
      return "bg-muted-foreground/40";
  }
}
