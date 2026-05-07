import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";
import { Sparkline } from "./sparkline";

export function EditorialCalmVariant() {
  const { glucose, tir, today, recovery, workout } = mockData;
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-3xl items-baseline justify-between px-8 pt-12 pb-6">
        <span className="font-serif text-xl italic tracking-tight">serene</span>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{date}</p>
      </header>

      <article className="mx-auto max-w-3xl px-8 pb-20">
        <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">In glance</p>
        <h1 className="mt-6 font-serif text-7xl font-light leading-[0.95] tracking-tight">
          <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
          <span className="ml-2 text-2xl text-muted-foreground">mmol/L</span>
        </h1>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">
          Glucose is steady at the upper edge of your morning window. Time in range across the last
          twenty-four hours sits at <span className="text-foreground">{tir.inRange}%</span>,
          recovery at <span className="text-foreground">{recovery.score}</span>, and the run you
          finished {workout.when} contributed a {workout.strain.toFixed(1)} strain score.
        </p>

        <Divider />

        <section>
          <h2 className="font-serif text-2xl font-light italic">The day so far</h2>
          <div className="mt-6 h-40 text-foreground/70">
            <Sparkline
              data={glucose.last24h}
              width={800}
              height={160}
              showRangeBand
              strokeColor="currentColor"
              bandColor="var(--color-glucose-in-range)"
              className="h-full w-full"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 font-serif text-sm text-muted-foreground sm:grid-cols-4">
            <Stat label="Average" value={`${formatGlucose(today.avg)} mmol/L`} />
            <Stat label="GMI" value={today.gmi.toFixed(1)} />
            <Stat label="Std deviation" value={today.sd.toFixed(1)} />
            <Stat label="Readings" value={today.readings.toString()} />
          </div>
        </section>

        <Divider />

        <section>
          <h2 className="font-serif text-2xl font-light italic">Recovery</h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
            Heart-rate variability of <span className="text-foreground">{recovery.hrv} ms</span>{" "}
            paired with a resting heart rate of{" "}
            <span className="text-foreground">{recovery.rhr} bpm</span> after{" "}
            <span className="text-foreground">{recovery.sleep} hours</span> of sleep.
          </p>
          <div className="mt-5 inline-flex items-baseline gap-3 font-serif">
            <span className="text-6xl font-light tabular-nums">{recovery.score}</span>
            <span className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
              recovery score
            </span>
          </div>
        </section>

        <Divider />

        <section>
          <h2 className="font-serif text-2xl font-light italic">Today's run</h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
            A {formatDistance(workout.distance)} {workout.sport.toLowerCase()} in{" "}
            {formatDuration(workout.duration)} at {formatPace(workout.duration, workout.distance)},
            heart rate averaging {workout.avgHr} bpm. The route map and per-kilometre glucose
            overlay will live here once the integrations land.
          </p>
        </section>

        <footer className="mt-20 border-t border-border/40 pt-6 text-xs italic tracking-wide text-muted-foreground">
          serene · scaffolding · editorial calm variant
        </footer>
      </article>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground/70">{label}</p>
      <p className="mt-1 text-foreground tabular-nums">{value}</p>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-12 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-border/60" />
      <span className="size-1 rounded-full bg-border" />
      <span className="h-px flex-1 bg-border/60" />
    </div>
  );
}
