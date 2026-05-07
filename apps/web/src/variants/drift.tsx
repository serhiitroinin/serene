import { ArrowUpRight, Heart, MapPin, Moon, Plus } from "lucide-react";
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

export function DriftVariant() {
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
            "radial-gradient(60% 70% at 50% -10%, color-mix(in oklch, oklch(0.82 0.10 240) 18%, transparent), transparent 65%), radial-gradient(40% 50% at 0% 100%, color-mix(in oklch, oklch(0.82 0.08 200) 14%, transparent), transparent 75%)",
        }}
      />

      <main className="relative mx-auto max-w-[1100px] px-6 py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-foreground text-sm font-bold text-background">
              s
            </span>
            <div>
              <p className="text-base font-semibold tracking-tight" style={display}>
                serene
              </p>
              <p className="text-xs text-muted-foreground" style={mono}>
                today · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-0.5 rounded-full border border-border/40 bg-card/70 p-0.5 text-xs backdrop-blur"
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
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs text-background"
            >
              <Plus className="size-3" /> Log event
            </button>
          </div>
        </header>

        <section className="mt-12 text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500" /> in range · stable · 4 min ago
          </p>
          <p
            className="mt-6 text-[clamp(7rem,15vw,15rem)] font-semibold leading-[0.85] tracking-tight tabular-nums"
            style={display}
          >
            {formatGlucose(glucose.current)}
          </p>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
            mmol/L · target 3.9 – 10.0
          </p>
          <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white/40 bg-white/55 p-6 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="h-24 text-sky-500/85">
              <Sparkline
                data={glucose.last24h}
                width={680}
                height={96}
                showRangeBand
                strokeColor="currentColor"
                bandColor="hsl(220 70% 60%)"
                className="size-full"
              />
            </div>
            <div
              className="mt-3 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground"
              style={mono}
            >
              <span>−24h</span>
              <span>−18h</span>
              <span>−12h</span>
              <span>−6h</span>
              <span>now</span>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-3 lg:grid-cols-4">
          <Stat
            tone="emerald"
            label="Time in range"
            value={`${tir.inRange}%`}
            sub={`${tir.below}% low · ${tir.above}% high`}
          />
          <Stat
            tone="indigo"
            label="Recovery"
            value={`${recovery.score}`}
            unit="/100"
            sub={`HRV ${recovery.hrv}ms`}
            icon={<Heart className="size-3.5" />}
          />
          <Stat
            tone="rose"
            label="Sleep"
            value={`${recovery.sleep}h`}
            sub={`RHR ${recovery.rhr} bpm`}
            icon={<Moon className="size-3.5" />}
          />
          <Stat
            tone="amber"
            label="Today's run"
            value={formatDistance(workout.distance)}
            sub={`${formatPace(workout.duration, workout.distance)} · strain ${recovery.strain.toFixed(1)}`}
          />
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-7 overflow-hidden rounded-3xl border border-white/40 bg-white/55 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <header className="flex items-baseline justify-between p-5">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  today's run
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight" style={display}>
                  Vondelpark loop
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-xs dark:bg-white/5"
              >
                Open <ArrowUpRight className="size-3" />
              </button>
            </header>
            <div className="aspect-[16/8]">
              <Map center={ROUTE_CENTER} zoom={12.5} className="size-full">
                <MapRoute coordinates={coords} color="#3b82f6" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 gap-2 p-4">
              {[
                ["pace", formatPace(workout.duration, workout.distance)],
                ["time", formatDuration(workout.duration)],
                ["avg HR", `${workout.avgHr}`],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)}`, true],
              ].map(([k, v, accent]) => (
                <div key={k as string} className="rounded-xl bg-white/45 px-3 py-2 dark:bg-white/5">
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-0.5 tabular-nums ${accent ? "text-blue-600 dark:text-blue-400" : ""}`}
                    style={mono}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:col-span-5 rounded-3xl border border-white/40 bg-white/55 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
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
          <article className="lg:col-span-5 rounded-3xl border border-white/40 bg-white/55 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              weekly · tir
            </p>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <div className="grid h-16 w-full place-items-end overflow-hidden rounded-2xl bg-white/60 dark:bg-white/5">
                    <div
                      className="w-full rounded-2xl"
                      style={{
                        height: `${d.inRange}%`,
                        background: "linear-gradient(180deg, hsl(220 70% 65%), hsl(200 70% 55%))",
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
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                recent · activity
              </p>
              <span className="text-xs text-muted-foreground" style={mono}>
                last {recentWorkouts.length}
              </span>
            </header>
            <ul className="divide-y divide-white/40 dark:divide-white/5">
              {recentWorkouts.slice(0, 4).map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between gap-4 px-5 py-2.5 text-sm"
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
                      color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(59 130 246)",
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
          className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground"
          style={mono}
        >
          <MapPin className="size-3" /> 52.358°N · 4.879°E · synced{" "}
          {formatClock(Date.now() - 60_000)}
        </footer>
      </main>
    </div>
  );
}

function Stat({
  tone,
  label,
  value,
  unit,
  sub,
  icon,
}: {
  tone: "emerald" | "indigo" | "rose" | "amber";
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  const ring = {
    emerald: "ring-emerald-500/30",
    indigo: "ring-indigo-500/30",
    rose: "ring-rose-500/30",
    amber: "ring-amber-500/30",
  }[tone];
  return (
    <article
      className={`rounded-3xl bg-white/55 p-5 ring-1 ${ring} backdrop-blur-2xl dark:bg-white/5`}
    >
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
        style={mono}
      >
        {icon}
        <span>{label}</span>
      </div>
      <p
        className="mt-2 flex items-baseline gap-1.5 text-3xl font-semibold tabular-nums tracking-tight"
        style={display}
      >
        {value}
        {unit ? (
          <span className="text-sm font-normal text-muted-foreground" style={mono}>
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
      return "bg-blue-500/15 text-blue-700 dark:text-blue-300";
    case "carbs":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "exercise":
      return "bg-violet-500/15 text-violet-700 dark:text-violet-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
