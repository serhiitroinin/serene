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
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function LuxeVariant() {
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
            "radial-gradient(50% 60% at 0% 0%, color-mix(in oklch, oklch(0.78 0.13 30) 24%, transparent), transparent 70%), radial-gradient(50% 60% at 100% 80%, color-mix(in oklch, oklch(0.78 0.13 320) 18%, transparent), transparent 75%), radial-gradient(40% 50% at 100% 0%, color-mix(in oklch, oklch(0.85 0.10 60) 14%, transparent), transparent 70%)",
        }}
      />

      <header className="relative">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-10 py-6">
          <div className="flex items-baseline gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-amber-500 via-rose-400 to-purple-500 text-xs font-bold text-white shadow-lg">
              <Sparkles className="size-4" />
            </span>
            <span className="text-xl italic" style={display}>
              serene
            </span>
            <span className="text-xs text-muted-foreground" style={mono}>
              · atelier édition
            </span>
          </div>
          <nav className="hidden items-center gap-1 rounded-full border border-amber-500/30 bg-card/70 p-1 text-sm backdrop-blur-xl md:flex">
            {["Today", "Glucose", "Activity", "Recovery", "Wardrobe"].map((n, i) => (
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
            className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-card/70 p-0.5 text-xs backdrop-blur-xl"
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

      <main className="relative mx-auto max-w-[1280px] px-10 pb-16">
        <section className="rounded-[2.5rem] border border-white/40 bg-white/55 p-12 shadow-[0_30px_100px_-30px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500" /> in range · stable · 4 min ago
          </p>
          <div className="mt-6 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1
                className="text-[clamp(5rem,12vw,11rem)] font-medium leading-[0.85] tracking-tight italic"
                style={display}
              >
                <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
                <span className="ml-3 text-3xl text-muted-foreground not-italic" style={mono}>
                  mmol/L
                </span>
              </h1>
              <p
                className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
                style={display}
              >
                Time-in-range — <span className="text-foreground">{tir.inRange}%</span>. The
                morning's run dipped the line by {Math.abs(workout.glucoseDelta).toFixed(1)} mmol/L
                between kilometres seven and eleven; a recovery shake closed the parenthesis.
              </p>
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-sm text-background"
                >
                  Open glucose <ArrowUpRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="rounded-full border border-amber-500/30 px-5 py-2 text-sm"
                >
                  View today's run
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 rounded-3xl border border-amber-500/20 bg-white/45 p-6 backdrop-blur-xl dark:bg-white/5">
              <p
                className="text-xs uppercase tracking-[0.4em] text-amber-700 dark:text-amber-300"
                style={mono}
              >
                last 24h · plate i
              </p>
              <div className="mt-4 h-32 text-amber-700 dark:text-amber-300">
                <Sparkline
                  data={glucose.last24h}
                  width={420}
                  height={128}
                  showRangeBand
                  strokeColor="currentColor"
                  bandColor="rgb(217 119 6)"
                  className="size-full"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <Mini label="avg" value={`${formatGlucose(today.avg)} mmol`} />
                <Mini label="gmi" value={today.gmi.toFixed(1)} />
                <Mini label="cv" value={`${today.cv}%`} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-4">
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
            tone="violet"
            label="Strain"
            value={recovery.strain.toFixed(1)}
            sub={`avg HR ${workout.avgHr}`}
          />
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-12">
          <article className="lg:col-span-7 overflow-hidden rounded-[2rem] border border-amber-500/20 bg-card/85 backdrop-blur-xl">
            <header className="flex items-baseline justify-between p-5 pb-3">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.4em] text-amber-700 dark:text-amber-300"
                  style={mono}
                >
                  today · plate ii
                </p>
                <h3 className="mt-1 text-2xl italic" style={display}>
                  {workout.sport} · {formatDistance(workout.distance)}
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-amber-500/30 px-3 py-1.5 text-xs"
              >
                Open
              </button>
            </header>
            <div className="aspect-[16/8]">
              <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                <MapRoute coordinates={coords} color="#d97706" width={4} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-4 divide-x divide-amber-500/10 text-sm">
              {[
                ["pace", formatPace(workout.duration, workout.distance)],
                ["time", formatDuration(workout.duration)],
                ["avg HR", `${workout.avgHr}`],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)} mmol`, true],
              ].map(([k, v, accent]) => (
                <div key={k as string} className="px-5 py-4">
                  <p
                    className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
                    style={mono}
                  >
                    {k}
                  </p>
                  <p
                    className={`mt-1 italic tabular-nums ${accent ? "text-amber-700 dark:text-amber-300" : ""}`}
                    style={display}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:col-span-5 grid gap-3">
            <article className="rounded-[2rem] border border-amber-500/20 bg-card/85 p-5 backdrop-blur-xl">
              <p
                className="text-xs uppercase tracking-[0.4em] text-amber-700 dark:text-amber-300"
                style={mono}
              >
                events · today
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {treatments.slice(0, 6).map((t) => (
                  <li
                    key={t.t}
                    className="flex items-center gap-3 rounded-2xl bg-muted/40 px-3 py-1.5"
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
            <article className="rounded-[2rem] border border-amber-500/20 bg-card/85 p-5 backdrop-blur-xl">
              <p
                className="text-xs uppercase tracking-[0.4em] text-amber-700 dark:text-amber-300"
                style={mono}
              >
                weekly · tir
              </p>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {weeklyTIR.map((d) => (
                  <div key={d.date} className="flex flex-col items-center gap-1">
                    <div className="grid h-16 w-full place-items-end overflow-hidden rounded-2xl bg-muted/40">
                      <div
                        className="w-full rounded-2xl"
                        style={{
                          height: `${d.inRange}%`,
                          background: "linear-gradient(180deg, hsl(40 80% 55%), hsl(330 70% 60%))",
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

        <section className="mt-4 rounded-[2rem] border border-amber-500/20 bg-card/85 backdrop-blur-xl">
          <header className="flex items-baseline justify-between p-5 pb-3">
            <p
              className="text-xs uppercase tracking-[0.4em] text-amber-700 dark:text-amber-300"
              style={mono}
            >
              wardrobe · recent
            </p>
            <span className="text-xs text-muted-foreground" style={mono}>
              last {recentWorkouts.length}
            </span>
          </header>
          <ul className="divide-y divide-amber-500/10">
            {recentWorkouts.map((w) => (
              <li key={w.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-amber-500/15 text-base">
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

        <footer
          className="mt-10 text-center text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
          style={mono}
        >
          set in newsreader & geist · serene · maison · MMXXVI
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
  tone: "emerald" | "amber" | "rose" | "violet";
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  const ring = {
    emerald: "ring-emerald-500/30",
    amber: "ring-amber-500/30",
    rose: "ring-rose-500/30",
    violet: "ring-violet-500/30",
  }[tone];
  return (
    <article className={`rounded-3xl bg-card/85 p-5 ring-1 ${ring} backdrop-blur-xl`}>
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-muted-foreground"
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

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-amber-500/10 px-3 py-1.5">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        style={{ fontFamily: "var(--font-mono-grotesque)" }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 text-sm tabular-nums"
        style={{ fontFamily: "var(--font-mono-grotesque)" }}
      >
        {value}
      </p>
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
