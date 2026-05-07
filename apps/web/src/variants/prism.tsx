import { Activity, Calendar, Heart, Home, Inbox, MapPin, Moon, Settings } from "lucide-react";
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

export function PrismVariant() {
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
            "radial-gradient(40% 50% at 0% 30%, color-mix(in oklch, oklch(0.75 0.16 30) 14%, transparent), transparent 70%), radial-gradient(35% 45% at 100% 60%, color-mix(in oklch, oklch(0.75 0.16 200) 12%, transparent), transparent 70%), radial-gradient(35% 45% at 50% 100%, color-mix(in oklch, oklch(0.75 0.18 280) 10%, transparent), transparent 75%)",
        }}
      />

      <div className="relative grid lg:grid-cols-[60px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col items-center gap-2 border-r border-border/40 bg-card/60 py-4 backdrop-blur-xl lg:flex">
          <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 via-amber-400 to-emerald-400 text-xs font-bold text-white">
            s
          </span>
          <hr className="my-1 w-6 border-border/40" />
          {[
            [<Home className="size-4" key="h" />, "Today", true],
            [<Inbox className="size-4" key="i" />, "Glucose"],
            [<Activity className="size-4" key="a" />, "Activity"],
            [<Heart className="size-4" key="r" />, "Recovery"],
            [<Calendar className="size-4" key="c" />, "Plan"],
            [<MapPin className="size-4" key="m" />, "Routes"],
            [<Settings className="size-4" key="s" />, "Settings"],
          ].map(([icon, label, active]) => (
            <button
              key={label as string}
              type="button"
              title={label as string}
              className={`grid size-9 place-items-center rounded-xl ${
                active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {icon}
            </button>
          ))}
        </aside>

        <div>
          <header className="flex items-center justify-between border-b border-border/40 bg-background/70 px-6 py-3 backdrop-blur-xl">
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-semibold tracking-tight" style={display}>
                Today
              </h1>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" /> in range · stable
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="flex items-center gap-0.5 rounded-full border border-border/60 bg-card/80 p-0.5"
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
              <span className="text-muted-foreground" style={mono}>
                synced {formatClock(Date.now() - 60_000)}
              </span>
            </div>
          </header>

          <main className="mx-auto max-w-[1300px] px-6 py-5">
            <section className="grid gap-3 lg:grid-cols-6">
              <Prism
                tone="rose"
                icon="🩸"
                label="Glucose"
                value={formatGlucose(glucose.current)}
                unit="mmol/L"
                sub="stable · 4 min ago"
                big
              >
                <div className="mt-3 h-12 text-rose-500/80">
                  <Sparkline
                    data={glucose.last24h}
                    width={300}
                    height={48}
                    showRangeBand
                    strokeColor="currentColor"
                    bandColor="hsl(345 70% 60%)"
                    className="size-full"
                  />
                </div>
              </Prism>
              <Prism
                tone="emerald"
                icon="💚"
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
              </Prism>
              <Prism
                tone="indigo"
                icon="💤"
                label="Recovery"
                value={`${recovery.score}`}
                unit="/100"
                sub={`HRV ${recovery.hrv}ms · RHR ${recovery.rhr}`}
              />
              <Prism
                tone="amber"
                icon="🔥"
                label="Strain"
                value={recovery.strain.toFixed(1)}
                sub={`avg HR ${workout.avgHr}`}
              />
              <Prism
                tone="sky"
                icon={<Moon className="size-4" />}
                label="Sleep"
                value={`${recovery.sleep}h`}
                sub="last night"
              />
              <Prism
                tone="violet"
                icon="📊"
                label="GMI"
                value={today.gmi.toFixed(1)}
                sub={`avg ${formatGlucose(today.avg)} · cv ${today.cv}%`}
              />
            </section>

            <section className="mt-3 grid gap-3 lg:grid-cols-12">
              <article className="lg:col-span-8 overflow-hidden rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl">
                <header className="flex items-baseline justify-between px-5 py-4">
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                      style={mono}
                    >
                      today's run
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight" style={display}>
                      {workout.sport} · {formatDistance(workout.distance)}
                    </h3>
                  </div>
                  <span
                    className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300"
                    style={mono}
                  >
                    strain {workout.strain.toFixed(1)}
                  </span>
                </header>
                <div className="aspect-[16/8]">
                  <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                    <MapRoute coordinates={coords} color="#f43f5e" width={4} opacity={0.95} />
                    <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                      <MarkerContent>
                        <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                          S
                        </span>
                      </MarkerContent>
                    </MapMarker>
                    <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                      <MarkerContent>
                        <span className="grid size-6 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                          F
                        </span>
                      </MarkerContent>
                    </MapMarker>
                    <MapControls position="top-right" />
                  </Map>
                </div>
                <div className="grid grid-cols-4 divide-x divide-border/40 text-sm">
                  {[
                    ["Pace", formatPace(workout.duration, workout.distance)],
                    ["Time", formatDuration(workout.duration)],
                    ["Avg HR", `${workout.avgHr} bpm`],
                    ["ΔBG", `${workout.glucoseDelta.toFixed(1)} mmol`, "rose"],
                  ].map(([k, v, accent]) => (
                    <div key={k as string} className="px-5 py-4">
                      <p
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                        style={mono}
                      >
                        {k}
                      </p>
                      <p
                        className={`mt-1 tabular-nums ${accent === "rose" ? "text-rose-600 dark:text-rose-400" : ""}`}
                        style={mono}
                      >
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <aside className="lg:col-span-4 grid gap-3">
                <article className="rounded-3xl border border-border/40 bg-card/80 p-5 backdrop-blur-xl">
                  <p
                    className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    events · today
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {treatments.slice(0, 6).map((t) => (
                      <li
                        key={t.t}
                        className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-1.5"
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
                </article>
                <article className="rounded-3xl border border-border/40 bg-card/80 p-5 backdrop-blur-xl">
                  <p
                    className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    weekly · tir
                  </p>
                  <div className="mt-4 grid grid-cols-7 gap-1.5">
                    {weeklyTIR.map((d) => {
                      const hue = 130 + (1 - d.inRange / 100) * 50;
                      return (
                        <div key={d.date} className="flex flex-col items-center gap-1">
                          <div className="grid h-16 w-full place-items-end overflow-hidden rounded-xl bg-muted/40">
                            <div
                              className="w-full rounded-xl"
                              style={{
                                height: `${d.inRange}%`,
                                backgroundColor: `hsl(${hue} 70% 55%)`,
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
                      );
                    })}
                  </div>
                </article>
              </aside>
            </section>

            <section className="mt-3 rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl">
              <header className="flex items-baseline justify-between px-5 py-3">
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  recent activity
                </p>
                <button type="button" className="text-xs text-muted-foreground" style={mono}>
                  see all
                </button>
              </header>
              <ul className="divide-y divide-border/40">
                {recentWorkouts.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-rose-500/15 text-base">
                        {sportEmoji(w.sport)}
                      </span>
                      <div>
                        <p className="font-medium">
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
                        style={{ color: w.glucoseDelta < 0 ? "rgb(16 185 129)" : "rgb(244 63 94)" }}
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
      </div>
    </div>
  );
}

function Prism({
  tone,
  icon,
  label,
  value,
  unit,
  sub,
  big = false,
  children,
}: {
  tone: "rose" | "emerald" | "indigo" | "amber" | "sky" | "violet";
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  big?: boolean;
  children?: React.ReactNode;
}) {
  const ring = {
    rose: "ring-rose-500/30",
    emerald: "ring-emerald-500/30",
    indigo: "ring-indigo-500/30",
    amber: "ring-amber-500/30",
    sky: "ring-sky-500/30",
    violet: "ring-violet-500/30",
  }[tone];
  return (
    <article
      className={`rounded-3xl bg-card/80 p-5 ring-1 ${ring} backdrop-blur-xl ${big ? "lg:col-span-2" : ""}`}
    >
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
        style={mono}
      >
        <span className="text-base leading-none">{icon}</span>
        <span>{label}</span>
      </div>
      <p
        className="mt-2 flex items-baseline gap-1.5 text-3xl font-semibold tabular-nums"
        style={display}
      >
        {value}
        {unit ? <span className="text-sm font-normal text-muted-foreground">{unit}</span> : null}
      </p>
      {sub ? (
        <p className="text-xs text-muted-foreground" style={mono}>
          {sub}
        </p>
      ) : null}
      {children}
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
