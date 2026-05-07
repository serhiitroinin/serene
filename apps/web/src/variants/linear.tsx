import {
  Activity,
  ArrowUpRight,
  Bell,
  Calendar,
  ChevronsUpDown,
  Heart,
  Inbox,
  Layers,
  LineChart,
  MapPin,
  Search,
  Settings,
} from "lucide-react";
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

const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function LinearVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR, route } =
    mockData;

  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);
  const peak = Math.max(...glucose.last24h.map((p) => p.v));
  const low = Math.min(...glucose.last24h.map((p) => p.v));

  return (
    <div className="min-h-dvh bg-background text-foreground" data-variant="linear">
      <div className="grid lg:grid-cols-[224px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-border/60 bg-muted/20 px-3 py-4 lg:flex">
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted/70"
            >
              <span className="grid size-5 place-items-center rounded-sm bg-foreground text-[10px] font-bold text-background">
                S
              </span>
              <span className="text-sm font-medium">serene</span>
              <ChevronsUpDown className="size-3 text-muted-foreground" />
            </button>
            <button
              type="button"
              className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted/70"
              aria-label="Notifications"
            >
              <Bell className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border/60 bg-background px-2 py-1.5 text-xs text-muted-foreground">
            <Search className="size-3" />
            <span>Search</span>
            <span className="ml-auto rounded border border-border/60 px-1 text-[10px]">⌘K</span>
          </div>

          <nav className="space-y-0.5 text-sm">
            <NavGroup title="Today">
              <Item icon={<Inbox />} label="Overview" badge={`${tir.inRange}%`} active />
              <Item icon={<LineChart />} label="Glucose" />
              <Item icon={<Activity />} label="Activity" />
              <Item icon={<Heart />} label="Recovery" />
              <Item icon={<Calendar />} label="Treatments" />
            </NavGroup>
            <NavGroup title="Configure">
              <Item icon={<Layers />} label="Sources" />
              <Item icon={<MapPin />} label="Share-link" />
              <Item icon={<Settings />} label="Settings" />
            </NavGroup>
          </nav>

          <div className="mt-auto rounded-md border border-border/60 bg-background p-3 text-xs">
            <p className="font-medium">Marathon · 39 days</p>
            <p className="mt-1 text-muted-foreground">Plan on track. 3 sessions this week.</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-foreground" style={{ width: "62%" }} />
            </div>
          </div>
        </aside>

        <div>
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-background/85 px-6 py-3 backdrop-blur">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Today</span>
              <span className="text-muted-foreground">·</span>
              <span>Overview</span>
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" /> in range · stable
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground" style={mono}>
                synced {formatClock(Date.now() - 60_000)}
              </span>
              <button
                type="button"
                className="rounded-md border border-border/60 px-2.5 py-1 text-xs hover:bg-muted/60"
              >
                Share link
              </button>
              <button
                type="button"
                className="rounded-md bg-foreground px-2.5 py-1 text-xs text-background"
              >
                Add event
              </button>
            </div>
          </header>

          <main className="mx-auto max-w-[1200px] px-6 py-6">
            <section className="grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-5 rounded-lg border border-border/60 bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Current glucose
                  </p>
                  <span className="text-xs text-muted-foreground" style={mono}>
                    4 min ago
                  </span>
                </div>
                <p className="mt-2 flex items-baseline gap-2 text-6xl font-semibold tabular-nums tracking-tight">
                  {formatGlucose(glucose.current)}
                  <span className="text-sm font-normal text-muted-foreground">mmol/L</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">stable · target 3.9 – 10.0</p>
                <div className="mt-5 h-20 text-foreground/80">
                  <Sparkline
                    data={glucose.last24h}
                    width={500}
                    height={80}
                    showRangeBand
                    strokeColor="currentColor"
                    bandColor="var(--color-glucose-in-range)"
                    className="size-full"
                  />
                </div>
                <div
                  className="mt-3 grid grid-cols-3 text-[11px] text-muted-foreground"
                  style={mono}
                >
                  <span>−24h</span>
                  <span className="text-center">
                    peak {peak.toFixed(1)} · low {low.toFixed(1)}
                  </span>
                  <span className="text-right">now</span>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-lg border border-border/60 bg-card p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Time in range · 24h
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
                <p className="mt-3 text-4xl font-semibold tabular-nums tracking-tight">
                  {tir.inRange}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {tir.below}% below · {tir.above}% above
                </p>
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <KV label="Average" value={`${formatGlucose(today.avg)} mmol/L`} />
                  <KV label="GMI" value={today.gmi.toFixed(1)} />
                  <KV label="Std dev" value={today.sd.toFixed(1)} />
                  <KV label="CV" value={`${today.cv}%`} />
                </div>
              </div>

              <div className="lg:col-span-3 rounded-lg border border-border/60 bg-card p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Recovery</p>
                <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight">
                  {recovery.score}
                </p>
                <p className="text-sm text-muted-foreground">/ 100 · today</p>
                <div className="mt-5 space-y-2 text-sm">
                  <KV label="HRV" value={`${recovery.hrv} ms`} />
                  <KV label="Resting HR" value={`${recovery.rhr} bpm`} />
                  <KV label="Sleep" value={`${recovery.sleep} h`} />
                </div>
              </div>
            </section>

            <section className="mt-4 grid gap-4 lg:grid-cols-12">
              <article className="lg:col-span-7 overflow-hidden rounded-lg border border-border/60 bg-card">
                <header className="flex items-baseline justify-between border-b border-border/60 px-5 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Today's run
                    </p>
                    <h3 className="mt-0.5 text-base font-medium">
                      {workout.sport} · {formatDistance(workout.distance)}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-xs hover:bg-muted/60"
                  >
                    Open <ArrowUpRight className="size-3" />
                  </button>
                </header>
                <div className="aspect-[16/9] w-full">
                  <Map center={ROUTE_CENTER} zoom={12.4} interactive className="size-full">
                    <MapRoute coordinates={coords} color="#5e6ad2" width={3.5} opacity={0.95} />
                    <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                      <MarkerContent>
                        <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg">
                          S
                        </span>
                      </MarkerContent>
                    </MapMarker>
                    <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                      <MarkerContent>
                        <span className="grid size-5 place-items-center rounded-full border-2 border-white bg-foreground text-[10px] font-bold text-background shadow-lg">
                          F
                        </span>
                      </MarkerContent>
                    </MapMarker>
                    <MapControls position="top-right" />
                  </Map>
                </div>
                <div className="grid grid-cols-4 divide-x divide-border/60 px-1 py-3 text-sm">
                  <Metric label="Pace" value={formatPace(workout.duration, workout.distance)} />
                  <Metric label="Time" value={formatDuration(workout.duration)} />
                  <Metric label="Avg HR" value={`${workout.avgHr}`} />
                  <Metric label="ΔBG" value={`${workout.glucoseDelta.toFixed(1)} mmol`} accent />
                </div>
              </article>

              <aside className="lg:col-span-5 rounded-lg border border-border/60 bg-card">
                <header className="flex items-baseline justify-between border-b border-border/60 px-5 py-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Treatments · today
                  </p>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    See all
                  </button>
                </header>
                <ul className="divide-y divide-border/60">
                  {treatments.slice(0, 7).map((t) => (
                    <li
                      key={t.t}
                      className="grid items-center gap-3 px-5 py-2.5"
                      style={{ gridTemplateColumns: "60px 22px 1fr auto" }}
                    >
                      <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                        {formatClock(t.t)}
                      </span>
                      <span
                        className={`grid size-5 place-items-center rounded text-[10px] font-medium ${kindStyles(t.kind)}`}
                      >
                        {kindLetter(t.kind)}
                      </span>
                      <span className="text-sm">{t.label}</span>
                      <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                        {t.detail ?? ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </section>

            <section className="mt-4 grid gap-4 lg:grid-cols-12">
              <article className="lg:col-span-8 rounded-lg border border-border/60 bg-card p-5">
                <header className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Weekly time-in-range
                    </p>
                    <p className="mt-0.5 text-sm">
                      7-day average ·{" "}
                      <span className="text-foreground" style={mono}>
                        {Math.round(
                          weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length,
                        )}
                        %
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">last 7 days</span>
                </header>
                <div className="mt-5 grid grid-cols-7 gap-2">
                  {weeklyTIR.map((d) => (
                    <div key={d.date} className="text-center">
                      <div
                        className="h-20 w-full overflow-hidden rounded-sm bg-muted"
                        title={`${d.date} · ${d.inRange}%`}
                      >
                        <div
                          className="ml-auto block w-full"
                          style={{
                            height: `${d.inRange}%`,
                            backgroundColor:
                              d.inRange >= 75
                                ? "var(--color-glucose-in-range)"
                                : "var(--color-glucose-low)",
                            opacity: 0.55 + (d.inRange / 100) * 0.45,
                            marginTop: `${100 - d.inRange}%`,
                          }}
                        />
                      </div>
                      <p
                        className="mt-1.5 text-[10px] uppercase text-muted-foreground"
                        style={mono}
                      >
                        {d.weekday[0]}
                      </p>
                      <p className="text-[11px] tabular-nums" style={mono}>
                        {d.inRange}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="lg:col-span-4 rounded-lg border border-border/60 bg-card p-5">
                <header className="flex items-baseline justify-between">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Recent efforts
                  </p>
                  <span className="text-xs text-muted-foreground">{recentWorkouts.length}</span>
                </header>
                <ul className="mt-4 space-y-3 text-sm">
                  {recentWorkouts.slice(0, 4).map((w) => (
                    <li key={w.id} className="flex items-baseline justify-between">
                      <div>
                        <p className="font-medium">{w.sport}</p>
                        <p className="text-xs text-muted-foreground" style={mono}>
                          {w.date.split("·")[0]?.trim()} · {formatDistance(w.distance)}
                        </p>
                      </div>
                      <span className="text-xs tabular-nums" style={mono}>
                        <span
                          style={{
                            color:
                              w.glucoseDelta < 0 ? "rgb(16 185 129)" : "var(--color-glucose-high)",
                          }}
                        >
                          Δ {w.glucoseDelta > 0 ? "+" : ""}
                          {w.glucoseDelta.toFixed(1)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function Item({
  icon,
  label,
  badge,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
        }`}
      >
        <span className="size-3.5 [&_svg]:size-3.5">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge ? (
          <span
            className="rounded bg-background px-1.5 py-0.5 text-[10px] tabular-nums"
            style={mono}
          >
            {badge}
          </span>
        ) : null}
      </button>
    </li>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="tabular-nums" style={mono}>
        {value}
      </p>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="px-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}
        style={mono}
      >
        {value}
      </p>
    </div>
  );
}

function kindStyles(kind: string): string {
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
