import { ArrowUpRight, Heart, Moon, Sparkles } from "lucide-react";
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

const display = { fontFamily: "var(--font-serif-editorial)" } as const;
const sans = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function OrchidVariant() {
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
            "radial-gradient(40% 50% at 90% 0%, color-mix(in oklch, oklch(0.82 0.13 340) 22%, transparent), transparent 75%), radial-gradient(40% 50% at 0% 90%, color-mix(in oklch, oklch(0.82 0.10 130) 18%, transparent), transparent 75%), radial-gradient(35% 45% at 100% 100%, color-mix(in oklch, oklch(0.85 0.10 50) 12%, transparent), transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        <header className="mb-3 flex items-center justify-between rounded-3xl border border-border/40 bg-card/85 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-2xl bg-gradient-to-br from-rose-300 via-pink-300 to-emerald-300 text-xs font-bold text-white">
              <Sparkles className="size-3.5" />
            </span>
            <span className="text-lg italic" style={display}>
              Orchid
            </span>
            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500" /> in range · stable
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full border border-rose-300/30 bg-card/80 p-0.5 text-xs"
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

        <div className="grid gap-3 lg:grid-cols-6 lg:grid-rows-[auto_auto_auto_auto]">
          <Tile className="lg:col-span-3 lg:row-span-2" tone="rose">
            <Eyebrow label="now · 01" />
            <p
              className="mt-3 text-7xl font-medium leading-[0.85] tabular-nums italic"
              style={display}
            >
              {formatGlucose(glucose.current)}
            </p>
            <p className="text-sm text-muted-foreground" style={sans}>
              mmol/L · stable · in range
            </p>
            <div className="mt-5 h-24 text-rose-500/85">
              <Sparkline
                data={glucose.last24h}
                width={420}
                height={96}
                showRangeBand
                strokeColor="currentColor"
                bandColor="rgb(244 114 182)"
                className="size-full"
              />
            </div>
            <p
              className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground"
              style={display}
            >
              "Held inside the band for {tir.inRange}% of the day; a{" "}
              {formatDistance(workout.distance)} run drew the line briefly south."
            </p>
          </Tile>

          <Tile className="lg:col-span-3" tone="emerald">
            <Eyebrow label="range · 02" />
            <p className="mt-2 text-5xl font-medium tabular-nums italic" style={display}>
              {tir.inRange}
              <span className="text-xl text-muted-foreground not-italic">%</span>
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
              {tir.below}% low · {tir.above}% high · gmi {today.gmi.toFixed(1)}
            </p>
          </Tile>

          <Tile className="lg:col-span-2" tone="amber" icon={<Heart className="size-3.5" />}>
            <Eyebrow label="recovery · 03" />
            <p className="mt-2 text-4xl font-medium tabular-nums italic" style={display}>
              {recovery.score}
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              /100 · HRV {recovery.hrv}ms
            </p>
          </Tile>

          <Tile className="lg:col-span-1" tone="indigo" icon={<Moon className="size-3.5" />}>
            <Eyebrow label="04" />
            <p className="mt-2 text-3xl font-medium tabular-nums italic" style={display}>
              {recovery.sleep}h
            </p>
            <p className="text-xs text-muted-foreground" style={mono}>
              sleep
            </p>
          </Tile>

          <Tile className="lg:col-span-4 p-0 overflow-hidden" tone="rose">
            <header className="flex items-baseline justify-between px-5 py-3">
              <Eyebrow label="route · 05" sub={formatDistance(workout.distance)} />
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-rose-300/30 px-3 py-1 text-xs"
              >
                open <ArrowUpRight className="size-3" />
              </button>
            </header>
            <div className="aspect-[16/9]">
              <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                <MapRoute coordinates={coords} color="#e879f9" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-fuchsia-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 gap-2 p-3">
              {[
                ["pace", formatPace(workout.duration, workout.distance)],
                ["time", formatDuration(workout.duration)],
                ["avg HR", `${workout.avgHr}`],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`, true],
              ].map(([k, v, accent]) => (
                <div key={k as string} className="rounded-xl bg-rose-500/5 px-3 py-2">
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-0.5 tabular-nums italic ${accent ? "text-rose-600 dark:text-rose-400" : ""}`}
                    style={display}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </Tile>

          <Tile className="lg:col-span-2" tone="emerald">
            <Eyebrow label="weekly · 06" sub="tir" />
            <div className="mt-3 grid grid-cols-7 gap-1">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="text-center">
                  <div className="grid h-16 place-items-end overflow-hidden rounded-lg bg-muted/40">
                    <div
                      className="w-full rounded-lg"
                      style={{
                        height: `${d.inRange}%`,
                        background: "linear-gradient(180deg, hsl(330 60% 70%), hsl(140 50% 60%))",
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-[9px] uppercase text-muted-foreground" style={mono}>
                    {d.weekday[0]}
                  </p>
                  <p className="text-[9px] tabular-nums" style={mono}>
                    {d.inRange}
                  </p>
                </div>
              ))}
            </div>
          </Tile>

          <Tile className="lg:col-span-3" tone="violet">
            <Eyebrow label="events · 07" sub="today" />
            <ul className="mt-3 space-y-1.5 text-sm">
              {treatments.slice(0, 6).map((t) => (
                <li key={t.t} className="flex items-center gap-3">
                  <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {formatClock(t.t)}
                  </span>
                  <span
                    className={`grid size-5 place-items-center rounded-full text-[10px] font-medium ${kindBadge(t.kind)}`}
                  >
                    {kindLetter(t.kind)}
                  </span>
                  <span className="flex-1 truncate italic" style={display}>
                    {t.label}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {t.detail ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          </Tile>

          <Tile className="lg:col-span-3" tone="muted">
            <Eyebrow label="recent · 08" sub={`last ${recentWorkouts.length}`} />
            <ul className="mt-3 space-y-2 text-sm">
              {recentWorkouts.slice(0, 4).map((w) => (
                <li key={w.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="italic" style={display}>
                      {w.sport} · {formatDistance(w.distance)}
                    </p>
                    <p className="text-xs text-muted-foreground" style={mono}>
                      {w.date} · {formatPace(w.duration, w.distance)}
                    </p>
                  </div>
                  <span
                    className="text-xs tabular-nums"
                    style={{
                      ...mono,
                      color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(232 121 249)",
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
  tone: "rose" | "emerald" | "amber" | "indigo" | "violet" | "muted";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const bar = {
    rose: "before:bg-rose-400",
    emerald: "before:bg-emerald-400",
    amber: "before:bg-amber-400",
    indigo: "before:bg-indigo-400",
    violet: "before:bg-violet-400",
    muted: "before:bg-muted-foreground/30",
  }[tone];
  return (
    <article
      className={`relative rounded-3xl border border-border/40 bg-card/85 p-5 backdrop-blur-xl before:absolute before:left-0 before:top-4 before:h-8 before:w-0.5 before:rounded-full ${bar} ${className}`}
    >
      {icon ? <div className="absolute right-4 top-4 text-muted-foreground">{icon}</div> : null}
      {children}
    </article>
  );
}

function Eyebrow({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-rose-600 dark:text-rose-300"
        style={mono}
      >
        {label}
      </p>
      {sub ? (
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          · {sub}
        </p>
      ) : null}
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
      return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
