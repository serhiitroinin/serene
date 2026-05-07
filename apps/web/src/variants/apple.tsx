import { ChevronRight, Heart, Moon, Activity as Run, TrendingDown, TrendingUp } from "lucide-react";
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

export function AppleVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="min-h-dvh bg-muted/30 text-foreground">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-pink-500 text-sm">
              ❤
            </span>
            <span className="text-base font-semibold tracking-tight" style={display}>
              Health
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            {["Summary", "Sharing", "Browse"].map((n, i) => (
              <button
                key={n}
                type="button"
                className={`${i === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {n}
              </button>
            ))}
          </nav>
          <span className="grid size-8 place-items-center rounded-full bg-foreground/10 text-xs font-medium">
            S
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 py-8">
        <h1 className="text-3xl font-bold tracking-tight" style={display}>
          Summary
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        <section className="mt-6 space-y-4">
          <h2 className="text-base font-semibold" style={display}>
            Favourites
          </h2>
          <div className="grid gap-3 lg:grid-cols-3">
            <Card
              icon="🩸"
              tone="rose"
              title="Blood glucose"
              value={`${formatGlucose(glucose.current)}`}
              unit="mmol/L"
              sub="stable · 4 min ago"
            >
              <div className="mt-3 h-12 text-rose-600 dark:text-rose-400">
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
            </Card>
            <Card
              icon="💚"
              tone="emerald"
              title="Time in range"
              value={`${tir.inRange}%`}
              sub={`${tir.below}% low · ${tir.above}% high`}
            >
              <div className="mt-3 flex h-2 overflow-hidden rounded-full">
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
              <p className="mt-3 text-xs text-muted-foreground">7-day avg 75% · trending steady</p>
            </Card>
            <Card
              icon="🌙"
              tone="indigo"
              title="Recovery"
              value={`${recovery.score}`}
              unit="/ 100"
              sub={`HRV ${recovery.hrv}ms · RHR ${recovery.rhr}`}
            >
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <Mini
                  icon={<Heart className="size-3.5 text-rose-500" />}
                  value={`${recovery.rhr}`}
                  unit="bpm"
                />
                <Mini
                  icon={<Moon className="size-3.5 text-indigo-500" />}
                  value={`${recovery.sleep}`}
                  unit="h"
                />
                <Mini
                  icon={<TrendingUp className="size-3.5 text-emerald-500" />}
                  value={`${recovery.hrv}`}
                  unit="ms"
                />
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-base font-semibold" style={display}>
            Today's workout
          </h2>
          <article className="overflow-hidden rounded-2xl bg-background shadow-sm ring-1 ring-border/40">
            <header className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-orange-500/15 text-orange-500">
                  <Run className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Outdoor run</p>
                  <p className="text-xs text-muted-foreground">{workout.date}</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </header>
            <div className="aspect-[16/9]">
              <Map center={ROUTE_CENTER} zoom={12.5} className="size-full">
                <MapRoute coordinates={coords} color="#f97316" width={3.5} opacity={0.95} />
                <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      S
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                  <MarkerContent>
                    <span className="grid size-6 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                      F
                    </span>
                  </MarkerContent>
                </MapMarker>
                <MapControls position="top-right" />
              </Map>
            </div>
            <div className="grid grid-cols-2 divide-x divide-border/40 sm:grid-cols-4">
              <Stat title="Distance" value={formatDistance(workout.distance)} icon="🛣️" />
              <Stat title="Duration" value={formatDuration(workout.duration)} icon="⏱️" />
              <Stat
                title="Avg pace"
                value={formatPace(workout.duration, workout.distance)}
                icon="⚡"
              />
              <Stat title="Avg heart rate" value={`${workout.avgHr} bpm`} icon="❤" />
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl bg-background p-5 shadow-sm ring-1 ring-border/40">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold" style={display}>
                Treatments today
              </h3>
              <button type="button" className="text-xs text-muted-foreground">
                Add
              </button>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {treatments.slice(0, 7).map((t) => (
                <li key={t.t} className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2">
                  <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {formatClock(t.t)}
                  </span>
                  <span className="text-base">{kindEmoji(t.kind)}</span>
                  <span className="flex-1">{t.label}</span>
                  <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {t.detail ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl bg-background p-5 shadow-sm ring-1 ring-border/40">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold" style={display}>
                Trends · 7 days
              </h3>
              <span className="text-xs text-muted-foreground" style={mono}>
                {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}% avg
              </span>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="flex flex-col items-center">
                  <div className="grid h-24 w-full place-items-end overflow-hidden rounded-xl bg-muted">
                    <div
                      className="w-full rounded-xl"
                      style={{
                        height: `${d.inRange}%`,
                        background: "linear-gradient(180deg, rgb(244 114 182), rgb(236 72 153))",
                      }}
                    />
                  </div>
                  <p
                    className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"
                    style={mono}
                  >
                    {d.weekday[0]}
                  </p>
                  <p className="text-xs tabular-nums" style={mono}>
                    {d.inRange}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border/40 pt-4 text-sm">
              <Stat title="Average" value={formatGlucose(today.avg)} icon="📊" small />
              <Stat title="GMI" value={today.gmi.toFixed(1)} icon="📈" small />
              <Stat title="CV" value={`${today.cv}%`} icon="📉" small />
            </div>
          </article>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-base font-semibold" style={display}>
            Recent activity
          </h2>
          <ul className="overflow-hidden rounded-2xl bg-background shadow-sm ring-1 ring-border/40">
            {recentWorkouts.map((w, i) => (
              <li
                key={w.id}
                className={`flex items-center justify-between gap-4 px-5 py-3 ${i > 0 ? "border-t border-border/40" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-orange-500/15 text-base">
                    {sportEmoji(w.sport)}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {w.sport} · {formatDistance(w.distance)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {w.date} · {formatPace(w.duration, w.distance)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">strain</p>
                  <p className="text-sm font-semibold tabular-nums" style={mono}>
                    {w.strain.toFixed(1)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {w.glucoseDelta < 0 ? (
                    <TrendingDown className="size-3.5 text-emerald-500" />
                  ) : (
                    <TrendingUp className="size-3.5 text-rose-500" />
                  )}
                  <span className="tabular-nums" style={mono}>
                    {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Card({
  icon,
  tone,
  title,
  value,
  unit,
  sub,
  children,
}: {
  icon: string;
  tone: "rose" | "emerald" | "indigo";
  title: string;
  value: string;
  unit?: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  const ring =
    tone === "rose"
      ? "ring-rose-500/20"
      : tone === "emerald"
        ? "ring-emerald-500/20"
        : "ring-indigo-500/20";
  return (
    <article className={`rounded-2xl bg-background p-5 shadow-sm ring-1 ${ring}`}>
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      </div>
      <p
        className="mt-2 flex items-baseline gap-1.5 text-3xl font-bold tabular-nums tracking-tight"
        style={display}
      >
        {value}
        {unit ? <span className="text-sm font-normal text-muted-foreground">{unit}</span> : null}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
      {children}
    </article>
  );
}

function Mini({ icon, value, unit }: { icon: React.ReactNode; value: string; unit: string }) {
  return (
    <div className="flex items-baseline gap-1 rounded-lg bg-muted/40 px-2 py-1.5">
      <span>{icon}</span>
      <span className="font-medium tabular-nums" style={mono}>
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground" style={mono}>
        {unit}
      </span>
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
  small = false,
}: {
  title: string;
  value: string;
  icon?: string;
  small?: boolean;
}) {
  return (
    <div className={small ? "" : "px-5 py-4"}>
      <p className="text-xs text-muted-foreground">
        {icon ? `${icon} ` : ""}
        {title}
      </p>
      <p className={`mt-0.5 tabular-nums ${small ? "" : "text-base font-medium"}`} style={mono}>
        {value}
      </p>
    </div>
  );
}

function kindEmoji(kind: string): string {
  switch (kind) {
    case "insulin":
      return "💉";
    case "carbs":
      return "🍞";
    case "exercise":
      return "🏃";
    default:
      return "📍";
  }
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
