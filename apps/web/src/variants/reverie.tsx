import { ArrowUpRight, Heart, MapPin, Moon } from "lucide-react";
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
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function ReverieVariant() {
  const { glucose, tir, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(50% 60% at 20% 0%, color-mix(in oklch, oklch(0.78 0.12 350) 22%, transparent), transparent 70%), radial-gradient(45% 50% at 80% 30%, color-mix(in oklch, oklch(0.78 0.13 280) 18%, transparent), transparent 75%), radial-gradient(50% 60% at 50% 100%, color-mix(in oklch, oklch(0.78 0.10 220) 16%, transparent), transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-8 py-10">
        <header className="flex items-center justify-between rounded-full border border-white/40 bg-white/45 px-5 py-2.5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <span className="text-base font-medium italic" style={display}>
              serene
            </span>
            <span className="text-xs text-muted-foreground" style={mono}>
              · today
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div
              className="flex items-center gap-0.5 rounded-full bg-white/60 p-0.5 dark:bg-white/5"
              style={mono}
            >
              {["24h", "7d", "30d"].map((w, i) => (
                <button
                  key={w}
                  type="button"
                  className={`rounded-full px-3 py-1 ${i === 0 ? "bg-foreground text-background" : "text-muted-foreground"}`}
                >
                  {w}
                </button>
              ))}
            </div>
            <span className="grid size-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
              S
            </span>
          </div>
        </header>

        <section className="mt-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground" style={mono}>
            current glucose · in range · stable
          </p>
          <p
            className="mt-5 text-[clamp(7rem,16vw,16rem)] font-medium leading-[0.85] tracking-tight italic"
            style={display}
          >
            <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
            <span className="ml-3 text-3xl text-muted-foreground not-italic" style={mono}>
              mmol/L
            </span>
          </p>
          <p
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground"
            style={display}
          >
            "Held inside the band for {tir.inRange}% of the last day, with a single excursion driven
            by a {formatDistance(workout.distance)} run before sunrise."
          </p>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-12">
          <article className="lg:col-span-8 rounded-3xl border border-white/40 bg-white/55 p-6 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" style={mono}>
                the trace · 24h
              </p>
              <span className="text-xs text-muted-foreground" style={mono}>
                peak {Math.max(...glucose.last24h.map((p) => p.v)).toFixed(1)} · low{" "}
                {Math.min(...glucose.last24h.map((p) => p.v)).toFixed(1)}
              </span>
            </div>
            <div className="mt-5 h-44 text-rose-500/80">
              <Sparkline
                data={glucose.last24h}
                width={780}
                height={176}
                showRangeBand
                strokeColor="currentColor"
                bandColor="hsl(330 60% 65%)"
                className="size-full"
              />
            </div>
          </article>
          <aside className="lg:col-span-4 grid gap-4">
            <Card
              tone="rose"
              icon={<Heart className="size-3.5" />}
              label="Recovery"
              value={`${recovery.score}`}
              unit="/ 100"
              sub={`HRV ${recovery.hrv}ms · RHR ${recovery.rhr}`}
            />
            <Card
              tone="indigo"
              icon={<Moon className="size-3.5" />}
              label="Sleep"
              value={`${recovery.sleep}h`}
              sub={`strain ${recovery.strain.toFixed(1)} · avg HR ${workout.avgHr}`}
            />
          </aside>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-12">
          <article className="lg:col-span-7 overflow-hidden rounded-3xl border border-white/40 bg-white/55 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <header className="flex items-baseline justify-between p-5">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                  style={mono}
                >
                  today's run
                </p>
                <h3 className="mt-1 text-2xl italic" style={display}>
                  {workout.sport} · {formatDistance(workout.distance)}
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                style={mono}
              >
                open <ArrowUpRight className="size-3" />
              </button>
            </header>
            <div className="aspect-[16/8]">
              <Map center={ROUTE_CENTER} zoom={12.5} className="size-full">
                <MapRoute coordinates={coords} color="#ec4899" width={3.5} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 divide-x divide-white/40 px-1 py-3 text-sm dark:divide-white/5">
              {[
                ["pace", formatPace(workout.duration, workout.distance)],
                ["time", formatDuration(workout.duration)],
                ["avg HR", `${workout.avgHr}`],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`, true],
              ].map(([k, v, accent]) => (
                <div key={k as string} className="px-4">
                  <p
                    className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-1 tabular-nums ${accent ? "text-rose-600 dark:text-rose-300" : ""}`}
                    style={mono}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="lg:col-span-5 rounded-3xl border border-white/40 bg-white/55 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" style={mono}>
              events · today
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {treatments.slice(0, 7).map((t) => (
                <li
                  key={t.t}
                  className="flex items-center gap-3 rounded-xl bg-white/45 px-3 py-1.5 dark:bg-white/5"
                >
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
          </article>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-12">
          <article className="lg:col-span-5 rounded-3xl border border-white/40 bg-white/55 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" style={mono}>
              weekly · tir
            </p>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <div className="grid h-20 w-full place-items-end overflow-hidden rounded-2xl bg-white/60 dark:bg-white/5">
                    <div
                      className="w-full rounded-2xl"
                      style={{
                        height: `${d.inRange}%`,
                        background: "linear-gradient(180deg, hsl(330 60% 75%), hsl(280 60% 70%))",
                      }}
                    />
                  </div>
                  <p className="text-[10px] uppercase text-muted-foreground" style={mono}>
                    {d.weekday[0]}
                  </p>
                  <p className="text-[10px] tabular-nums" style={mono}>
                    {d.inRange}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="lg:col-span-7 rounded-3xl border border-white/40 bg-white/55 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <header className="flex items-baseline justify-between p-5 pb-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" style={mono}>
                recent · activity
              </p>
              <span className="text-xs text-muted-foreground" style={mono}>
                last {recentWorkouts.length}
              </span>
            </header>
            <ul className="divide-y divide-white/40 dark:divide-white/5">
              {recentWorkouts.map((w) => (
                <li key={w.id} className="flex items-baseline justify-between px-5 py-2.5 text-sm">
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
                      color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(236 72 153)",
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

        <footer
          className="mt-12 flex items-center justify-center gap-3 text-xs text-muted-foreground"
          style={mono}
        >
          <MapPin className="size-3" /> 52.358°N · 4.879°E · Vondelpark loop
        </footer>
      </div>
    </div>
  );
}

function Card({
  tone,
  icon,
  label,
  value,
  unit,
  sub,
}: {
  tone: "rose" | "indigo" | "emerald";
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}) {
  const ring =
    tone === "rose"
      ? "ring-rose-500/30"
      : tone === "indigo"
        ? "ring-indigo-500/30"
        : "ring-emerald-500/30";
  return (
    <article
      className={`rounded-3xl bg-white/55 p-5 ring-1 ${ring} backdrop-blur-2xl dark:bg-white/5`}
    >
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        style={mono}
      >
        {icon}
        <span>{label}</span>
      </div>
      <p
        className="mt-2 flex items-baseline gap-1.5 text-4xl font-medium tabular-nums italic"
        style={display}
      >
        {value}
        {unit ? (
          <span className="text-sm font-normal not-italic text-muted-foreground" style={mono}>
            {unit}
          </span>
        ) : null}
      </p>
      {sub ? (
        <p className="text-xs text-muted-foreground" style={mono}>
          {sub}
        </p>
      ) : null}
    </article>
  );
}

function kindBadge(kind: string): string {
  switch (kind) {
    case "insulin":
      return "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300";
    case "carbs":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
    case "exercise":
      return "bg-rose-500/20 text-rose-700 dark:text-rose-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
