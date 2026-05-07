import { Activity, Heart, MapPin, Moon, TrendingUp } from "lucide-react";
import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";
import { Sparkline } from "./sparkline";

export function ActivityCardVariant() {
  const { glucose, tir, today, recovery, workout } = mockData;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-baseline gap-3">
          <span className="text-lg font-semibold tracking-tight">serene</span>
          <span className="text-sm text-muted-foreground">today</span>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <NavPill active>Today</NavPill>
          <NavPill>Activity</NavPill>
          <NavPill>Recovery</NavPill>
          <NavPill>Settings</NavPill>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid grid-cols-12 gap-4">
          {/* Glucose hero card — large */}
          <div className="col-span-12 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[var(--color-glucose-in-range)]/10 via-card to-card p-7 md:col-span-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Glucose
                </p>
                <p className="mt-3 text-7xl font-light tabular-nums">
                  {formatGlucose(glucose.current)}
                  <span className="ml-2 text-base text-muted-foreground">mmol/L</span>
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--color-glucose-in-range)]">
                  <TrendingUp className="size-4" /> stable · in range
                </p>
              </div>
              <div className="flex flex-col items-end text-xs text-muted-foreground">
                <span>last reading</span>
                <span>4 min ago</span>
              </div>
            </div>
            <div className="mt-6 h-28">
              <Sparkline
                data={glucose.last24h}
                width={700}
                height={110}
                showRangeBand
                strokeColor="var(--color-glucose-in-range)"
                bandColor="var(--color-glucose-in-range)"
                className="h-full w-full"
              />
            </div>
            <div className="mt-3 grid grid-cols-3 text-xs text-muted-foreground">
              <span>—24h</span>
              <span className="text-center">—12h</span>
              <span className="text-right">now</span>
            </div>
          </div>

          {/* TIR card — medium */}
          <div className="col-span-12 rounded-3xl border border-border/60 bg-card p-6 md:col-span-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Time in range
            </p>
            <p className="mt-3 text-6xl font-light tabular-nums">{tir.inRange}%</p>
            <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full">
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
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>{tir.below}% below</span>
              <span>{tir.inRange}% in range</span>
              <span>{tir.above}% above</span>
            </div>
          </div>

          {/* Today's workout — featured map placeholder */}
          <div className="col-span-12 overflow-hidden rounded-3xl border border-border/60 bg-card md:col-span-8">
            <div className="relative aspect-[16/7] w-full bg-gradient-to-br from-[var(--color-glucose-high)]/30 via-[var(--color-glucose-in-range)]/20 to-[var(--color-glucose-low)]/20">
              <svg
                viewBox="0 0 400 175"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full opacity-60"
                aria-hidden="true"
              >
                <path
                  d="M20 140 Q 90 60, 150 80 T 260 50 T 380 110"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  fill="none"
                  className="text-foreground/70"
                />
                <circle cx="20" cy="140" r="4" className="fill-[var(--color-glucose-low)]" />
                <circle cx="380" cy="110" r="4" className="fill-[var(--color-glucose-in-range)]" />
              </svg>
              <div className="absolute left-6 top-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/70">
                  {workout.when}
                </p>
                <p className="mt-1 text-2xl font-medium">{workout.sport}</p>
              </div>
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-xs backdrop-blur-sm">
                <MapPin className="size-3" /> route preview
              </span>
            </div>
            <div className="grid grid-cols-4 divide-x divide-border/60 px-6 py-4 text-sm">
              <Metric
                icon={<Activity className="size-3.5" />}
                label="Distance"
                value={formatDistance(workout.distance)}
              />
              <Metric label="Duration" value={formatDuration(workout.duration)} />
              <Metric label="Pace" value={formatPace(workout.duration, workout.distance)} />
              <Metric
                icon={<Heart className="size-3.5" />}
                label="Avg HR"
                value={`${workout.avgHr}`}
              />
            </div>
          </div>

          {/* Recovery */}
          <div className="col-span-12 rounded-3xl border border-border/60 bg-card p-6 md:col-span-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Recovery
              </p>
              <Moon className="size-3.5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-6xl font-light tabular-nums">{recovery.score}</p>
            <p className="text-xs text-muted-foreground">/ 100 · today</p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
              <SmallStat label="HRV" value={`${recovery.hrv}ms`} />
              <SmallStat label="RHR" value={`${recovery.rhr}bpm`} />
              <SmallStat label="Sleep" value={`${recovery.sleep}h`} />
            </div>
          </div>

          {/* Stats strip */}
          <div className="col-span-12 grid grid-cols-2 gap-3 rounded-3xl border border-border/60 bg-card/50 p-4 md:grid-cols-4">
            <BoxStat label="Average" value={formatGlucose(today.avg)} unit="mmol/L" />
            <BoxStat label="GMI" value={today.gmi.toFixed(1)} unit="A1C est." />
            <BoxStat label="Std Dev" value={today.sd.toFixed(1)} unit="mmol/L" />
            <BoxStat label="Readings" value={today.readings.toString()} unit="last 24h" />
          </div>
        </div>

        <footer className="mt-8 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          serene v0.0.1 · activity card variant
        </footer>
      </main>
    </div>
  );
}

function NavPill({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 ${
        active ? "bg-card text-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon ?? null}
        <span>{label}</span>
      </div>
      <p className="mt-1 tabular-nums">{value}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/40 p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 tabular-nums">{value}</p>
    </div>
  );
}

function BoxStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-light tabular-nums">{value}</p>
      <p className="text-[10px] uppercase text-muted-foreground/80">{unit}</p>
    </div>
  );
}
