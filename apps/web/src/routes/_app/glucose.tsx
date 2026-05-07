import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { Sparkline } from "~/components/charts/sparkline";
import { PageTopbar } from "~/components/app/topbar";
import { formatClock, formatGlucose, mockData } from "~/data/mock";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/_app/glucose")({
  component: GluPage,
});

function GluPage() {
  const { glucose, tir, today, weeklyTIR, treatments } = mockData;
  const peak = Math.max(...glucose.last24h.map((p) => p.v));
  const low = Math.min(...glucose.last24h.map((p) => p.v));
  const hyperEvents = glucose.last24h.filter((p) => p.v > 10).length;
  const hypoEvents = glucose.last24h.filter((p) => p.v < 3.9).length;

  return (
    <>
      <PageTopbar
        title="Glucose"
        meta="trace · time-in-range · daily summary"
        windows={["1h", "4h", "24h", "7d", "30d"]}
        activeWindow="24h"
      />
      <main className="grid gap-3 px-6 py-5 lg:grid-cols-12">
        <article className="lg:col-span-7 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                ambulatory glucose profile · 14d
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight" style={display}>
                The day, in profile
              </h2>
            </div>
            <span className="text-xs text-muted-foreground" style={mono}>
              median + 25/75 + 5/95 percentiles
            </span>
          </div>
          <div className="mt-5 h-64">
            <AGPChart />
          </div>
          <div
            className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground"
            style={mono}
          >
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </article>

        <aside className="lg:col-span-5 grid gap-3">
          <article className="rounded-3xl border border-emerald-500/20 bg-card/95 p-5 ring-1 ring-emerald-500/30 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              time in range · 24h
            </p>
            <p className="mt-3 text-5xl font-semibold tabular-nums" style={display}>
              {tir.inRange}%
            </p>
            <div className="mt-4 flex h-2 overflow-hidden rounded-full">
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
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs" style={mono}>
              <Pill label="Below" value={`${tir.below}%`} tone="amber" />
              <Pill label="In range" value={`${tir.inRange}%`} tone="emerald" />
              <Pill label="Above" value={`${tir.above}%`} tone="violet" />
            </div>
          </article>

          <article className="rounded-3xl border border-border/40 bg-card/95 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              events · last 24h
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Event
                icon={<ArrowUp className="size-3.5 text-violet-500" />}
                label="Hyper events"
                value={hyperEvents.toString()}
                sub=">10.0 mmol"
              />
              <Event
                icon={<ArrowDown className="size-3.5 text-amber-500" />}
                label="Hypo events"
                value={hypoEvents.toString()}
                sub="<3.9 mmol"
              />
              <Event
                icon={<TrendingUp className="size-3.5 text-emerald-500" />}
                label="Peak"
                value={peak.toFixed(1)}
                sub="mmol/L"
              />
              <Event label="Low" value={low.toFixed(1)} sub="mmol/L" />
            </div>
          </article>
        </aside>

        <article className="lg:col-span-12 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                24h trace · with treatments
              </p>
              <h3 className="mt-1 text-lg font-semibold" style={display}>
                Continuous reading
              </h3>
            </div>
            <span className="text-xs text-muted-foreground" style={mono}>
              {glucose.last24h.length} readings · target 3.9–10.0
            </span>
          </div>
          <div className="relative mt-4 h-56">
            <Sparkline
              data={glucose.last24h}
              width={1200}
              height={224}
              showRangeBand
              strokeColor="hsl(150 60% 55%)"
              bandColor="hsl(150 60% 55%)"
              className="size-full"
            />
            <div className="absolute inset-x-0 bottom-0 flex pointer-events-none">
              {treatments.slice(0, 8).map((t) => {
                const start = Date.now() - 24 * 60 * 60 * 1000;
                const x = ((t.t - start) / (24 * 60 * 60 * 1000)) * 100;
                if (x < 0 || x > 100) return null;
                return (
                  <span
                    key={t.t}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${x}%`, bottom: 0 }}
                    title={`${formatClock(t.t)} · ${t.label}`}
                  >
                    <span
                      className={`grid size-4 place-items-center rounded-full text-[8px] font-medium shadow ring-2 ring-background ${kindBadge(t.kind)}`}
                    >
                      {kindLetter(t.kind)}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
          <div
            className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground"
            style={mono}
          >
            <span>−24h</span>
            <span>−18h</span>
            <span>−12h</span>
            <span>−6h</span>
            <span>now</span>
          </div>
        </article>

        <article className="lg:col-span-12 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <header className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                past 7 days · summary
              </p>
              <h3 className="mt-1 text-lg font-semibold" style={display}>
                Daily glucose
              </h3>
            </div>
            <span className="text-xs text-muted-foreground" style={mono}>
              avg {Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length)}% TIR
              · gmi {today.gmi.toFixed(1)}
            </span>
          </header>
          <div className="mt-5 grid gap-3 lg:grid-cols-7">
            {weeklyTIR.map((d) => (
              <article key={d.date} className="rounded-2xl border border-border/40 bg-card/60 p-4">
                <p
                  className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  {d.weekday} · {d.date.split(" ")[1]}
                </p>
                <p className="mt-2 text-2xl font-medium tabular-nums" style={display}>
                  {d.inRange}%
                </p>
                <p className="text-xs text-muted-foreground" style={mono}>
                  avg {d.avg.toFixed(1)} mmol
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full"
                    style={{
                      width: `${d.inRange}%`,
                      backgroundColor:
                        d.inRange >= 75
                          ? "var(--color-glucose-in-range)"
                          : "var(--color-glucose-low)",
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="lg:col-span-12 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
            statistics · 24h
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            <Stat label="Average" value={formatGlucose(today.avg)} unit="mmol" />
            <Stat label="GMI" value={today.gmi.toFixed(1)} unit="A1c est." />
            <Stat label="Std dev" value={today.sd.toFixed(1)} unit="mmol" />
            <Stat label="CV" value={`${today.cv}%`} unit="variance" />
            <Stat label="Peak" value={peak.toFixed(1)} unit="mmol" />
            <Stat label="Low" value={low.toFixed(1)} unit="mmol" />
            <Stat label="Readings" value={today.readings.toString()} unit="last 24h" />
            <Stat label="Sensor" value="99.6%" unit="uptime" />
          </div>
        </article>
      </main>
    </>
  );
}

const agpMedian = (hour: number) =>
  6 +
  Math.sin(((hour - 6) / 24) * Math.PI * 2) * 1.4 +
  (hour >= 7 && hour <= 9 ? 1.5 : 0) +
  (hour >= 12 && hour <= 14 ? 1 : 0);

function AGPChart() {
  const w = 1200;
  const h = 256;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const path = (offset: number) => {
    return hours
      .map((hour, i) => {
        const v = agpMedian(hour) + offset;
        const x = (i / 23) * w;
        const y = 256 - ((v - 2) / 12) * 256;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="size-full">
      <rect
        x={0}
        y={256 - ((10 - 2) / 12) * 256}
        width={w}
        height={((10 - 3.9) / 12) * 256}
        fill="hsl(150 60% 55%)"
        opacity={0.05}
      />
      <line
        x1={0}
        x2={w}
        y1={256 - ((3.9 - 2) / 12) * 256}
        y2={256 - ((3.9 - 2) / 12) * 256}
        stroke="currentColor"
        opacity={0.2}
        strokeDasharray="3 6"
      />
      <line
        x1={0}
        x2={w}
        y1={256 - ((10 - 2) / 12) * 256}
        y2={256 - ((10 - 2) / 12) * 256}
        stroke="currentColor"
        opacity={0.2}
        strokeDasharray="3 6"
      />
      <path d={`${path(2.5)} L ${w} 256 L 0 256 Z`} fill="hsl(280 60% 60%)" opacity={0.08} />
      <path d={`${path(-2.5)} L ${w} 256 L 0 256 Z`} fill="hsl(35 60% 55%)" opacity={0.08} />
      <path d={`${path(1.2)} L ${w} 256 L 0 256 Z`} fill="hsl(280 60% 60%)" opacity={0.12} />
      <path d={`${path(-1.2)} L ${w} 256 L 0 256 Z`} fill="hsl(35 60% 55%)" opacity={0.12} />
      <path d={path(0)} fill="none" stroke="hsl(150 60% 55%)" strokeWidth={2.5} />
    </svg>
  );
}

function Pill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "amber" | "violet";
}) {
  const cls = {
    emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  }[tone];
  return (
    <div className={`rounded-lg ${cls} px-2.5 py-1.5 text-center`}>
      <p className="text-[10px] uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-0.5 font-medium tabular-nums">{value}</p>
    </div>
  );
}

function Event({
  icon,
  label,
  value,
  sub,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p
        className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        style={mono}
      >
        {icon}
        {label}
      </p>
      <p className="mt-1 text-2xl font-medium tabular-nums" style={display}>
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground" style={mono}>
        {sub}
      </p>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-medium tabular-nums" style={display}>
        {value}
      </p>
      {unit ? (
        <p className="text-[10px] text-muted-foreground" style={mono}>
          {unit}
        </p>
      ) : null}
    </div>
  );
}

function kindBadge(kind: string): string {
  switch (kind) {
    case "insulin":
      return "bg-blue-500 text-white";
    case "carbs":
      return "bg-amber-500 text-white";
    case "exercise":
      return "bg-emerald-500 text-white";
    default:
      return "bg-muted-foreground/40 text-background";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}
