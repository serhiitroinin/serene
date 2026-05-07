import { TrendingUp } from "lucide-react";
import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";
import { Sparkline } from "./sparkline";

export function WhoopDramaticVariant() {
  const { glucose, tir, today, recovery, workout } = mockData;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="relative">
        <div className="absolute inset-0 -z-10 h-[420px] bg-gradient-to-b from-card/60 to-transparent" />
        <header className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5 text-sm">
          <span className="font-semibold tracking-tight">serene</span>
          <nav className="flex gap-7 text-muted-foreground">
            <span className="text-foreground">Today</span>
            <span>Activity</span>
            <span>Recovery</span>
            <span>Settings</span>
          </nav>
        </header>

        <section className="mx-auto max-w-7xl px-8 pb-10 pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            current glucose · stable
          </p>
          <div className="mt-4 flex items-end gap-6">
            <span className="text-[10rem] font-extralight leading-none tracking-tighter tabular-nums text-foreground">
              {formatGlucose(glucose.current)}
            </span>
            <div className="flex flex-col gap-1 pb-4">
              <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                mmol/L
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-[var(--color-glucose-in-range)]">
                <TrendingUp className="size-4" />
                in range
              </span>
            </div>
          </div>

          <div className="mt-10 h-56 w-full">
            <Sparkline
              data={glucose.last24h}
              width={1200}
              height={220}
              showRangeBand
              strokeColor="var(--color-glucose-in-range)"
              bandColor="var(--color-glucose-in-range)"
              className="h-full w-full"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            24-hour trace · target range {glucose.targetLow.toFixed(1)} –{" "}
            {glucose.targetHigh.toFixed(1)} mmol/L
          </p>
        </section>
      </div>

      <main className="mx-auto max-w-7xl px-8 pb-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DramaticCard
            label="Time in range"
            big={`${tir.inRange}%`}
            sub="last 24h"
            tone="ok"
            footer={
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Pip color="var(--color-glucose-low)" /> {tir.below}%
                <Pip color="var(--color-glucose-in-range)" /> {tir.inRange}%
                <Pip color="var(--color-glucose-high)" /> {tir.above}%
              </div>
            }
          />
          <DramaticCard
            label="Recovery"
            big={`${recovery.score}`}
            sub={`HRV ${recovery.hrv}ms · RHR ${recovery.rhr}`}
            tone="ok"
            footer={
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Slept {recovery.sleep}h
              </div>
            }
          />
          <DramaticCard
            label="Today's run"
            big={formatDistance(workout.distance)}
            sub={`${formatDuration(workout.duration)} · ${formatPace(workout.duration, workout.distance)}`}
            tone="accent"
            footer={
              <div className="text-xs text-muted-foreground">
                Strain {workout.strain.toFixed(1)} · avg HR {workout.avgHr}
              </div>
            }
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <MiniStat label="Average" value={formatGlucose(today.avg)} unit="mmol/L" />
          <MiniStat label="GMI" value={today.gmi.toFixed(1)} unit="A1C est." />
          <MiniStat label="Std Dev" value={today.sd.toFixed(1)} unit="mmol/L" />
          <MiniStat label="CV" value={`${today.cv}%`} unit="variance" />
        </div>

        <footer className="mt-12 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          serene v0.0.1 · whoop dramatic variant
        </footer>
      </main>
    </div>
  );
}

function DramaticCard({
  label,
  big,
  sub,
  footer,
  tone = "neutral",
}: {
  label: string;
  big: string;
  sub: string;
  tone?: "neutral" | "ok" | "accent";
  footer?: React.ReactNode;
}) {
  const ring =
    tone === "ok"
      ? "border-[var(--color-glucose-in-range)]/30"
      : tone === "accent"
        ? "border-[var(--color-glucose-high)]/30"
        : "border-border";
  return (
    <div className={`rounded-2xl border bg-card/60 p-6 ${ring}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-5xl font-light tabular-nums">{big}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      {footer ? <div className="mt-4 border-t border-border/60 pt-3">{footer}</div> : null}
    </div>
  );
}

function MiniStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/30 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-light tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{unit}</p>
    </div>
  );
}

function Pip({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-2 rounded-full"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}
