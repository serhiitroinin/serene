import { ArrowUpRight, Heart, Moon, Server } from "lucide-react";
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

export function BentoVariant() {
  const { glucose, tir, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background p-4 text-foreground sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(35% 50% at 100% 0%, color-mix(in oklch, oklch(0.7 0.18 240) 16%, transparent), transparent 70%), radial-gradient(35% 50% at 0% 100%, color-mix(in oklch, oklch(0.7 0.16 160) 12%, transparent), transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px]">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-xl bg-foreground text-xs font-bold text-background">
              s
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              serene
            </span>
            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500" /> live
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 p-0.5 text-xs backdrop-blur"
            style={mono}
          >
            {["1h", "4h", "24h", "7d", "30d"].map((w, i) => (
              <button
                key={w}
                type="button"
                className={`rounded-full px-2.5 py-1 ${i === 2 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                {w}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-3 lg:grid-cols-6 lg:grid-rows-[auto_auto_auto_auto]">
          <Cell className="lg:col-span-2 lg:row-span-2" tone="indigo">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              current glucose
            </p>
            <p
              className="mt-3 text-7xl font-semibold leading-[0.9] tabular-nums tracking-tight"
              style={display}
            >
              {formatGlucose(glucose.current)}
            </p>
            <p className="text-sm text-muted-foreground">mmol/L · stable · in range</p>
            <div className="mt-5 h-20 text-indigo-500/80">
              <Sparkline
                data={glucose.last24h}
                width={300}
                height={80}
                showRangeBand
                strokeColor="currentColor"
                bandColor="hsl(245 70% 60%)"
                className="size-full"
              />
            </div>
          </Cell>

          <Cell className="lg:col-span-2" tone="emerald">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              time in range
            </p>
            <p className="mt-3 text-5xl font-semibold tabular-nums" style={display}>
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
            <p className="mt-2 text-xs text-muted-foreground" style={mono}>
              {tir.below}% low · {tir.above}% high
            </p>
          </Cell>

          <Cell tone="rose" icon={<Heart className="size-3.5" />}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              recovery
            </p>
            <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
              {recovery.score}
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              HRV {recovery.hrv}ms · RHR {recovery.rhr}
            </p>
          </Cell>

          <Cell tone="amber" icon={<Moon className="size-3.5" />}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              sleep
            </p>
            <p className="mt-2 text-4xl font-semibold tabular-nums" style={display}>
              {recovery.sleep}
              <span className="text-base font-normal text-muted-foreground">h</span>
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              strain {recovery.strain.toFixed(1)} · today
            </p>
          </Cell>

          <Cell className="lg:col-span-4 lg:row-span-2 p-0 overflow-hidden" tone="violet">
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
                <MapRoute coordinates={coords} color="#8b5cf6" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-violet-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-5 divide-x divide-border/40 px-1 py-3 text-sm">
              {[
                ["pace", formatPace(workout.duration, workout.distance)],
                ["time", formatDuration(workout.duration)],
                ["avg HR", `${workout.avgHr}`],
                ["strain", workout.strain.toFixed(1)],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`, true],
              ].map(([k, v, accent]) => (
                <div key={k as string} className="px-4">
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-1 tabular-nums ${accent ? "text-violet-600 dark:text-violet-300" : ""}`}
                    style={data}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </Cell>

          <Cell className="lg:col-span-2" tone="muted">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              today.events
            </p>
            <ul className="mt-3 space-y-1 text-xs" style={data}>
              {treatments.slice(0, 6).map((t) => (
                <li
                  key={t.t}
                  className="grid items-center gap-2 border-b border-border/30 pb-1 last:border-b-0"
                  style={{ gridTemplateColumns: "44px 14px 1fr auto" }}
                >
                  <span className="tabular-nums text-muted-foreground">{formatClock(t.t)}</span>
                  <span className={`size-2 rounded-full ${kindDot(t.kind)}`} />
                  <span className="truncate">{t.label}</span>
                  <span className="tabular-nums text-muted-foreground">{t.detail ?? ""}</span>
                </li>
              ))}
            </ul>
          </Cell>

          <Cell className="lg:col-span-2" tone="muted">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              weekly · tir
            </p>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="text-center">
                  <div className="grid h-16 w-full place-items-end overflow-hidden rounded-md bg-muted/40">
                    <div
                      className="w-full rounded-md bg-foreground/70"
                      style={{ height: `${d.inRange}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground" style={mono}>
                    {d.weekday[0]}
                  </p>
                  <p className="text-[10px] tabular-nums" style={mono}>
                    {d.inRange}
                  </p>
                </div>
              ))}
            </div>
          </Cell>

          <Cell className="lg:col-span-2" tone="muted" icon={<Server className="size-3.5" />}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              sources
            </p>
            <ul className="mt-3 space-y-1 text-xs" style={data}>
              <li className="flex justify-between border-b border-border/30 pb-1">
                <span>libre.linkup</span>
                <span className="text-emerald-600 dark:text-emerald-400">● healthy</span>
              </li>
              <li className="flex justify-between border-b border-border/30 pb-1">
                <span>whoop.api</span>
                <span className="text-emerald-600 dark:text-emerald-400">● healthy</span>
              </li>
              <li className="flex justify-between border-b border-border/30 pb-1">
                <span>garmin.connect</span>
                <span className="text-amber-600 dark:text-amber-400">● syncing</span>
              </li>
              <li className="flex justify-between">
                <span>last refresh</span>
                <span className="text-muted-foreground">{formatClock(Date.now() - 60_000)}</span>
              </li>
            </ul>
          </Cell>

          <Cell className="lg:col-span-6" tone="muted">
            <header className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                recent.runs
              </p>
              <span className="text-[11px] text-muted-foreground" style={mono}>
                last 5
              </span>
            </header>
            <table className="mt-3 w-full text-sm" style={data}>
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border/40">
                  {["when", "sport", "distance", "duration", "pace", "avg HR", "strain", "ΔBG"].map(
                    (h) => (
                      <th key={h} className="py-2 text-left font-normal">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {recentWorkouts.map((w) => (
                  <tr key={w.id} className="border-b border-border/30 last:border-b-0">
                    <td className="py-2 text-muted-foreground">{w.date}</td>
                    <td className="py-2">{w.sport}</td>
                    <td className="py-2 tabular-nums">{formatDistance(w.distance)}</td>
                    <td className="py-2 tabular-nums">{formatDuration(w.duration)}</td>
                    <td className="py-2 tabular-nums">{formatPace(w.duration, w.distance)}</td>
                    <td className="py-2 tabular-nums">{w.avgHr}</td>
                    <td className="py-2 tabular-nums">{w.strain.toFixed(1)}</td>
                    <td
                      className="py-2 text-right tabular-nums"
                      style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(139 92 246)" }}
                    >
                      {w.glucoseDelta > 0 ? "+" : ""}
                      {w.glucoseDelta.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Cell>
        </div>
      </div>
    </div>
  );
}

function Cell({
  className = "",
  tone,
  icon,
  children,
}: {
  className?: string;
  tone: "indigo" | "emerald" | "rose" | "amber" | "violet" | "muted";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const ring =
    tone === "indigo"
      ? "ring-indigo-500/30"
      : tone === "emerald"
        ? "ring-emerald-500/30"
        : tone === "rose"
          ? "ring-rose-500/30"
          : tone === "amber"
            ? "ring-amber-500/30"
            : tone === "violet"
              ? "ring-violet-500/30"
              : "ring-border/60";
  const bar =
    tone === "indigo"
      ? "before:bg-indigo-500"
      : tone === "emerald"
        ? "before:bg-emerald-500"
        : tone === "rose"
          ? "before:bg-rose-500"
          : tone === "amber"
            ? "before:bg-amber-500"
            : tone === "violet"
              ? "before:bg-violet-500"
              : "before:bg-muted-foreground/30";
  return (
    <article
      className={`relative rounded-3xl bg-card/85 p-5 ring-1 ${ring} backdrop-blur-xl before:absolute before:left-0 before:top-4 before:h-8 before:w-0.5 before:rounded-full ${bar} ${className}`}
    >
      {icon ? <div className="absolute right-4 top-4 text-muted-foreground">{icon}</div> : null}
      {children}
    </article>
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
