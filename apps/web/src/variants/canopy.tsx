import { ArrowUpRight, Heart, Leaf, Moon } from "lucide-react";
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

export function CanopyVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(50% 60% at 30% 0%, color-mix(in oklch, oklch(0.78 0.13 130) 22%, transparent), transparent 70%), radial-gradient(40% 50% at 90% 30%, color-mix(in oklch, oklch(0.78 0.13 60) 16%, transparent), transparent 75%), radial-gradient(40% 50% at 50% 100%, color-mix(in oklch, oklch(0.78 0.10 30) 12%, transparent), transparent 75%)",
        }}
      />

      <header className="relative">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white shadow">
              <Leaf className="size-4" />
            </span>
            <span className="text-xl italic" style={display}>
              serene
            </span>
          </div>
          <nav className="hidden items-center gap-1 rounded-full border border-border/40 bg-card/60 p-1 text-sm backdrop-blur-md md:flex">
            {["Today", "Glucose", "Activity", "Recovery", "Field notes"].map((n, i) => (
              <button
                key={n}
                type="button"
                className={`rounded-full px-4 py-1.5 ${i === 0 ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {n}
              </button>
            ))}
          </nav>
          <div
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 p-0.5 text-xs"
            style={mono}
          >
            {["24h", "7d", "30d"].map((w, i) => (
              <button
                key={w}
                type="button"
                className={`rounded-full px-2.5 py-1 ${i === 0 ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1240px] px-8 pb-16">
        <section className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p
              className="text-xs uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-300"
              style={mono}
            >
              {new Date().toLocaleDateString("en-US", { weekday: "long" })} · 7 May
            </p>
            <h1 className="mt-4 text-6xl leading-[1.05] italic" style={display}>
              <span>The line held all morning,</span>
              <br />
              <span className="text-muted-foreground">until a long run drew it briefly south.</span>
            </h1>
            <p
              className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
              style={display}
            >
              Time-in-range posted <span className="text-foreground">{tir.inRange}%</span>. The{" "}
              {formatDistance(workout.distance)} loop dipped glucose by{" "}
              {Math.abs(workout.glucoseDelta).toFixed(1)} mmol/L between kilometres seven and
              eleven; the recovery shake walked it back.
            </p>
          </div>
          <div className="lg:col-span-5 rounded-3xl border border-white/40 bg-white/55 p-6 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <p
              className="text-xs uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300"
              style={mono}
            >
              current glucose
            </p>
            <p
              className="mt-3 flex items-baseline gap-2 text-7xl font-medium leading-[0.85] italic"
              style={display}
            >
              <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
              <span className="text-base not-italic font-normal text-muted-foreground" style={mono}>
                mmol/L
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">stable · 4 minutes ago</p>
            <div className="mt-5 h-20 text-emerald-600/85">
              <Sparkline
                data={glucose.last24h}
                width={420}
                height={80}
                showRangeBand
                strokeColor="currentColor"
                bandColor="rgb(34 197 94)"
                className="size-full"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-3 lg:grid-cols-4">
          <Stat
            tone="emerald"
            label="In range"
            value={`${tir.inRange}%`}
            sub={`${tir.below}% low · ${tir.above}% high`}
          />
          <Stat
            tone="amber"
            label="Recovery"
            value={`${recovery.score}`}
            unit="/100"
            sub={`HRV ${recovery.hrv}ms · RHR ${recovery.rhr}`}
            icon={<Heart className="size-3.5" />}
          />
          <Stat
            tone="rose"
            label="Sleep"
            value={`${recovery.sleep}h`}
            sub={`strain ${recovery.strain.toFixed(1)} · today`}
            icon={<Moon className="size-3.5" />}
          />
          <Stat
            tone="emerald"
            label="GMI"
            value={today.gmi.toFixed(1)}
            sub={`avg ${formatGlucose(today.avg)} · cv ${today.cv}%`}
          />
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-8 overflow-hidden rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
            <header className="flex items-baseline justify-between p-5 pb-3">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300"
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
                className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1.5 text-xs"
              >
                Open <ArrowUpRight className="size-3" />
              </button>
            </header>
            <div className="aspect-[16/8]">
              <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                <MapRoute coordinates={coords} color="#16a34a" width={4} opacity={0.95} />
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
            <div className="grid grid-cols-4 divide-x divide-border/40 text-sm">
              {[
                ["pace", formatPace(workout.duration, workout.distance)],
                ["time", formatDuration(workout.duration)],
                ["avg HR", `${workout.avgHr} bpm`],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)} mmol`, true],
              ].map(([k, v, accent]) => (
                <div key={k as string} className="px-5 py-4">
                  <p
                    className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-1 italic tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                    style={display}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:col-span-4 grid gap-3">
            <article className="rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
              <p
                className="text-xs uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300"
                style={mono}
              >
                events · today
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {treatments.slice(0, 6).map((t) => (
                  <li
                    key={t.t}
                    className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-1.5"
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
            <article className="rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
              <p
                className="text-xs uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300"
                style={mono}
              >
                weekly · tir
              </p>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {weeklyTIR.map((d) => (
                  <div key={d.date} className="flex flex-col items-center gap-1">
                    <div className="grid h-16 w-full place-items-end overflow-hidden rounded-xl bg-muted/40">
                      <div
                        className="w-full rounded-xl"
                        style={{
                          height: `${d.inRange}%`,
                          background: "linear-gradient(180deg, hsl(140 60% 55%), hsl(40 80% 55%))",
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
          </aside>
        </section>

        <section className="mt-4 rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          <header className="flex items-baseline justify-between p-5 pb-3">
            <p
              className="text-xs uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300"
              style={mono}
            >
              field notes · recent
            </p>
            <span className="text-xs text-muted-foreground" style={mono}>
              last {recentWorkouts.length}
            </span>
          </header>
          <ul className="divide-y divide-border/40">
            {recentWorkouts.map((w) => (
              <li key={w.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-emerald-500/15 text-base">
                    {sportEmoji(w.sport)}
                  </span>
                  <div>
                    <p className="italic" style={display}>
                      {w.sport} · {formatDistance(w.distance)}
                    </p>
                    <p className="text-xs text-muted-foreground" style={mono}>
                      {w.date} · {formatPace(w.duration, w.distance)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs" style={mono}>
                  <span className="text-muted-foreground">strain {w.strain.toFixed(1)}</span>
                  <span
                    style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(217 119 6)" }}
                    className="tabular-nums"
                  >
                    Δ {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
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
  tone: "emerald" | "amber" | "rose";
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  const ring =
    tone === "emerald"
      ? "ring-emerald-500/30"
      : tone === "amber"
        ? "ring-amber-500/30"
        : "ring-rose-500/30";
  return (
    <article className={`rounded-3xl bg-card/90 p-5 ring-1 ${ring} backdrop-blur-xl`}>
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        style={mono}
      >
        {icon}
        <span>{label}</span>
      </div>
      <p
        className="mt-2 flex items-baseline gap-1.5 text-3xl font-medium tabular-nums italic"
        style={display}
      >
        {value}
        {unit ? (
          <span className="text-sm not-italic font-normal text-muted-foreground" style={mono}>
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
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}

function sportEmoji(sport: string): string {
  switch (sport) {
    case "Run":
      return "🏃";
    case "Ride":
      return "🚴";
    case "Swim":
      return "🏊";
    case "Strength":
      return "🏋️";
    default:
      return "💪";
  }
}
