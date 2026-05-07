import { ArrowRight, ChevronRight } from "lucide-react";
import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";
import { Sparkline } from "./sparkline";

export function LinearGridVariant() {
  const { glucose, tir, today, recovery, workout } = mockData;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-tight">serene</span>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <span className="text-muted-foreground">Dashboard</span>
          </div>
          <nav className="flex items-center gap-5 text-muted-foreground">
            <span className="text-foreground">Today</span>
            <span>Activity</span>
            <span>Recovery</span>
            <span>Settings</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="grid grid-cols-12 gap-x-6 gap-y-8 border-b border-border/60 pb-10">
          <div className="col-span-12 md:col-span-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current</p>
            <div className="mt-3 flex items-baseline gap-2 font-mono">
              <span className="text-7xl font-light tracking-tight tabular-nums">
                {formatGlucose(glucose.current)}
              </span>
              <span className="text-sm text-muted-foreground">mmol/L</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Stable · 4 minutes ago</p>
          </div>

          <Stat
            label="In range"
            value={`${tir.inRange}%`}
            sub={`${tir.below}% low · ${tir.above}% high`}
          />
          <Stat label="GMI" value={today.gmi.toFixed(1)} sub="estimated A1C" />
          <Stat label="Variance" value={`${today.cv}%`} sub={`SD ${today.sd.toFixed(1)}`} />
          <Stat label="Readings" value={today.readings.toString()} sub="last 24h" />
        </section>

        <section className="grid grid-cols-12 gap-6 border-b border-border/60 py-8">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Last 24 hours
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                avg {formatGlucose(today.avg)} mmol/L
              </p>
            </div>
            <div className="mt-4 h-32 text-foreground/70">
              <Sparkline
                data={glucose.last24h}
                showRangeBand
                strokeColor="currentColor"
                bandColor="var(--color-glucose-in-range)"
                className="h-full w-full"
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <span>—24h</span>
              <span>—12h</span>
              <span>now</span>
            </div>
          </div>

          <div className="col-span-12 space-y-4 border-l border-border/60 pl-6 md:col-span-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Time in range
            </p>
            <div className="space-y-2">
              <Bar label="Below" value={tir.below} color="var(--color-glucose-low)" />
              <Bar label="In range" value={tir.inRange} color="var(--color-glucose-in-range)" />
              <Bar label="Above" value={tir.above} color="var(--color-glucose-high)" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-6 py-8">
          <div className="col-span-12 md:col-span-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recovery</p>
            <div className="mt-3 flex items-baseline gap-3 font-mono">
              <span className="text-5xl font-light tabular-nums">{recovery.score}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 font-mono text-xs">
              <Detail label="HRV" value={`${recovery.hrv} ms`} />
              <Detail label="RHR" value={`${recovery.rhr} bpm`} />
              <Detail label="Sleep" value={`${recovery.sleep}h`} />
            </div>
          </div>

          <div className="col-span-12 border-l border-border/60 pl-6 md:col-span-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Last workout
            </p>
            <p className="mt-3 font-mono text-2xl font-light">{workout.sport}</p>
            <p className="mt-1 text-xs text-muted-foreground">{workout.when}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs">
              <Detail label="Distance" value={formatDistance(workout.distance)} />
              <Detail label="Pace" value={formatPace(workout.duration, workout.distance)} />
              <Detail label="Time" value={formatDuration(workout.duration)} />
              <Detail label="Strain" value={workout.strain.toFixed(1)} />
            </div>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              See route on map
              <ArrowRight className="size-3" />
            </button>
          </div>
        </section>

        <footer className="border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          serene v0.0.1 · scaffolding · linear grid variant
        </footer>
      </main>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="col-span-6 md:col-span-7/4 lg:col-span-2 border-l border-border/60 pl-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-2xl font-light tabular-nums">{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground/80">{sub}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 tabular-nums">{value}</p>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums">{value}%</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden bg-border/40">
        <div className="h-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
