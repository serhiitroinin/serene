import { Activity, ArrowUpRight, Bell, Heart, Map as MapIcon, Moon } from "lucide-react";
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

const TIME_WINDOWS = ["1h", "4h", "24h", "7d", "30d"] as const;

export function AuroraVariant() {
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
            "radial-gradient(40% 60% at 8% 0%, color-mix(in oklch, oklch(0.72 0.15 200) 22%, transparent), transparent 70%)," +
            "radial-gradient(35% 50% at 100% 20%, color-mix(in oklch, oklch(0.72 0.18 320) 18%, transparent), transparent 70%)," +
            "radial-gradient(45% 55% at 50% 100%, color-mix(in oklch, oklch(0.72 0.15 60) 14%, transparent), transparent 75%)",
        }}
      />
      <div className="relative">
        <header className="flex items-center justify-between rounded-3xl border border-white/40 bg-white/45 px-5 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-violet-400 to-pink-400 text-xs font-bold text-white shadow-md">
              s
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              serene
            </span>
            <span className="text-muted-foreground/80">/</span>
            <span className="text-sm">today</span>
            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500" /> in range · stable
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-0.5 rounded-full bg-white/60 p-0.5 text-xs dark:bg-white/5 md:flex">
              {TIME_WINDOWS.map((w, i) => (
                <button
                  key={w}
                  type="button"
                  className={`rounded-full px-3 py-1 ${
                    i === 2
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={mono}
                >
                  {w}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="grid size-8 place-items-center rounded-full bg-white/60 text-muted-foreground hover:text-foreground dark:bg-white/5"
            >
              <Bell className="size-3.5" />
            </button>
            <span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
              S
            </span>
          </div>
        </header>

        <section className="mt-3 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-7 rounded-3xl border border-white/40 bg-gradient-to-br from-white/65 via-white/40 to-white/30 p-7 backdrop-blur-2xl dark:border-white/10 dark:from-white/10 dark:via-white/[0.06] dark:to-white/[0.04]">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              current glucose
            </p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span
                className="text-[clamp(5rem,12vw,9rem)] font-semibold leading-[0.85] tracking-tight tabular-nums"
                style={display}
              >
                {formatGlucose(glucose.current)}
              </span>
              <span className="text-base font-medium uppercase text-muted-foreground" style={mono}>
                mmol/L
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                stable · 4 min ago
              </span>
            </div>
            <div className="mt-6 h-28">
              <Sparkline
                data={glucose.last24h}
                width={620}
                height={112}
                showRangeBand
                strokeColor="hsl(220 70% 60%)"
                bandColor="hsl(220 70% 60%)"
                className="size-full"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-xs" style={mono}>
              <Mini label="avg" value={`${formatGlucose(today.avg)} mmol`} />
              <Mini label="gmi" value={today.gmi.toFixed(1)} />
              <Mini label="cv" value={`${today.cv}%`} />
              <Mini label="reads" value={today.readings.toString()} />
            </div>
          </article>

          <aside className="lg:col-span-5 grid gap-3">
            <Ring
              tone="emerald"
              label="Time in range"
              value={`${tir.inRange}%`}
              sub={`${tir.below}% low · ${tir.above}% high`}
            >
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
            </Ring>
            <div className="grid grid-cols-2 gap-3">
              <Ring
                tone="indigo"
                icon={<Heart className="size-3.5" />}
                label="Recovery"
                value={`${recovery.score}`}
                sub={`HRV ${recovery.hrv}ms`}
              />
              <Ring
                tone="rose"
                icon={<Moon className="size-3.5" />}
                label="Sleep"
                value={`${recovery.sleep}h`}
                sub={`RHR ${recovery.rhr}bpm`}
              />
            </div>
          </aside>
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-8 overflow-hidden rounded-3xl border border-white/40 bg-white/45 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <header className="flex items-baseline justify-between p-5">
              <div className="flex items-center gap-2">
                <MapIcon className="size-4 text-muted-foreground" />
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  today's run
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1 text-xs dark:bg-white/5"
              >
                Open <ArrowUpRight className="size-3" />
              </button>
            </header>
            <div className="aspect-[16/8]">
              <Map center={ROUTE_CENTER} zoom={12.5} className="size-full">
                <MapRoute coordinates={coords} color="#a855f7" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 gap-2 p-4">
              {[
                ["Distance", formatDistance(workout.distance)],
                ["Time", formatDuration(workout.duration)],
                ["Pace", formatPace(workout.duration, workout.distance)],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)} mmol`, true],
              ].map(([k, v, accent]) => (
                <div
                  key={k as string}
                  className="rounded-2xl bg-white/55 px-4 py-2.5 dark:bg-white/5"
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-0.5 tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                    style={mono}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:col-span-4 rounded-3xl border border-white/40 bg-white/45 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                events · today
              </p>
              <span className="text-xs text-muted-foreground" style={mono}>
                {treatments.length}
              </span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {treatments.slice(0, 8).map((t) => (
                <li
                  key={t.t}
                  className="flex items-center gap-3 rounded-xl bg-white/55 px-3 py-1.5 dark:bg-white/5"
                >
                  <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {formatClock(t.t)}
                  </span>
                  <span
                    className={`grid size-5 place-items-center rounded-full text-[10px] font-medium ${kindBadge(t.kind)}`}
                  >
                    {kindLetter(t.kind)}
                  </span>
                  <span className="flex-1 truncate">{t.label}</span>
                  <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {t.detail ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-7 rounded-3xl border border-white/40 bg-white/45 p-6 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <header className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                weekly · time in range
              </p>
              <span className="text-xs text-muted-foreground" style={mono}>
                avg {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}%
              </span>
            </header>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1.5">
                  <div className="grid h-24 w-full place-items-end overflow-hidden rounded-2xl bg-white/60 dark:bg-white/5">
                    <div
                      className="w-full rounded-2xl"
                      style={{
                        height: `${d.inRange}%`,
                        background:
                          "linear-gradient(180deg, hsl(220 70% 70%), hsl(280 70% 65%) 50%, hsl(330 70% 65%))",
                      }}
                    />
                  </div>
                  <p className="text-[10px] uppercase text-muted-foreground" style={mono}>
                    {d.weekday[0]}
                  </p>
                  <p className="text-[11px] tabular-nums" style={mono}>
                    {d.inRange}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="lg:col-span-5 rounded-3xl border border-white/40 bg-white/45 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <header className="flex items-baseline justify-between p-5 pb-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                recent runs
              </p>
              <Activity className="size-3.5 text-muted-foreground" />
            </header>
            <ul className="divide-y divide-white/40 dark:divide-white/5">
              {recentWorkouts.map((w) => (
                <li
                  key={w.id}
                  className="flex items-baseline justify-between gap-4 px-5 py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium">
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
                      color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "var(--color-glucose-high)",
                    }}
                  >
                    Δ {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}

function Ring({
  tone,
  icon,
  label,
  value,
  sub,
  children,
}: {
  tone: "emerald" | "indigo" | "rose";
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  const ring =
    tone === "emerald"
      ? "ring-emerald-500/30"
      : tone === "indigo"
        ? "ring-indigo-500/30"
        : "ring-rose-500/30";
  return (
    <article
      className={`rounded-3xl bg-white/55 p-5 ring-1 ${ring} backdrop-blur-2xl dark:bg-white/5`}
    >
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
        style={{ fontFamily: "var(--font-mono-grotesque)" }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <p
        className="mt-2 text-4xl font-semibold tabular-nums tracking-tight"
        style={{ fontFamily: "var(--font-bricolage)" }}
      >
        {value}
      </p>
      {sub ? (
        <p
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "var(--font-mono-grotesque)" }}
        >
          {sub}
        </p>
      ) : null}
      {children}
    </article>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/55 px-3 py-2 dark:bg-white/5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm tabular-nums">{value}</p>
    </div>
  );
}

function kindBadge(kind: string): string {
  switch (kind) {
    case "insulin":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300";
    case "carbs":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
    case "exercise":
      return "bg-violet-500/20 text-violet-700 dark:text-violet-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
