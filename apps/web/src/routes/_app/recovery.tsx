import { createFileRoute } from "@tanstack/react-router";
import { Heart, Moon, TrendingDown, TrendingUp } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { mockData } from "~/data/mock";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/_app/recovery")({
  component: RecoveryPage,
});

function RecoveryPage() {
  const { recovery, weeklyTIR } = mockData;

  // Mock 30-day recovery scores
  const scores = Array.from({ length: 30 }, (_, i) => {
    const drift = Math.sin(i / 5) * 14 + Math.cos(i / 7) * 8;
    return Math.max(35, Math.min(95, 65 + drift + (Math.random() - 0.5) * 6));
  });

  // Mock sleep stages
  const stages = [
    { label: "Awake", hours: 0.4, color: "bg-rose-500" },
    { label: "Light", hours: 3.6, color: "bg-indigo-300" },
    { label: "Deep", hours: 1.6, color: "bg-indigo-700" },
    { label: "REM", hours: 1.8, color: "bg-violet-500" },
  ];
  const totalSleep = stages.reduce((s, x) => s + x.hours, 0);

  return (
    <>
      <PageTopbar
        title="Recovery"
        meta="HRV · sleep · resting heart rate · strain"
        windows={["7d", "30d", "90d", "1y"]}
        activeWindow="30d"
      />
      <main className="grid gap-3 px-6 py-5 lg:grid-cols-12">
        <article className="lg:col-span-5 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-card to-card p-6 ring-1 ring-indigo-500/20 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
            recovery · today
          </p>
          <div className="mt-4 flex items-center gap-6">
            <RecoveryRing value={recovery.score} />
            <div>
              <p className="text-6xl font-semibold leading-none tabular-nums" style={display}>
                {recovery.score}
              </p>
              <p className="text-sm text-muted-foreground">/ 100 · ample</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm text-muted-foreground">
            Your nervous system has recovered well from yesterday's session. Strain capacity for
            today: <span className="text-foreground">12 – 16</span>.
          </p>
        </article>

        <article className="lg:col-span-7 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <header className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                30-day recovery trend
              </p>
              <h3 className="mt-1 text-lg font-semibold" style={display}>
                The line your nights tell
              </h3>
            </div>
            <span className="text-xs text-muted-foreground" style={mono}>
              avg {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}
            </span>
          </header>
          <div className="mt-5 h-36">
            <svg
              viewBox={`0 0 ${scores.length * 24} 144`}
              preserveAspectRatio="none"
              className="size-full"
            >
              <line
                x1={0}
                x2={scores.length * 24}
                y1={144 - (67 / 100) * 144}
                y2={144 - (67 / 100) * 144}
                stroke="currentColor"
                opacity={0.2}
                strokeDasharray="4 4"
              />
              <line
                x1={0}
                x2={scores.length * 24}
                y1={144 - (33 / 100) * 144}
                y2={144 - (33 / 100) * 144}
                stroke="currentColor"
                opacity={0.2}
                strokeDasharray="4 4"
              />
              {scores.map((s, i) => (
                <rect
                  key={i}
                  x={i * 24 + 4}
                  y={144 - (s / 100) * 144}
                  width={16}
                  height={(s / 100) * 144}
                  rx={3}
                  fill={
                    s >= 67 ? "rgb(16 185 129)" : s >= 33 ? "rgb(245 158 11)" : "rgb(244 63 94)"
                  }
                  opacity={0.85}
                />
              ))}
            </svg>
          </div>
          <div
            className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground"
            style={mono}
          >
            <span>−30d</span>
            <span>−15d</span>
            <span>today</span>
          </div>
        </article>

        <article className="lg:col-span-7 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <header className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                sleep · last night
              </p>
              <h3 className="mt-1 text-lg font-semibold" style={display}>
                {recovery.sleep} hours · 87% efficient
              </h3>
            </div>
            <span className="text-xs text-muted-foreground" style={mono}>
              23:14 → 06:36
            </span>
          </header>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full">
            {stages.map((s) => (
              <div
                key={s.label}
                className={s.color}
                style={{ width: `${(s.hours / totalSleep) * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stages.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2"
              >
                <span className={`size-2 rounded-full ${s.color}`} />
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    {s.label}
                  </p>
                  <p className="text-sm tabular-nums" style={mono}>
                    {s.hours.toFixed(1)}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="lg:col-span-5 grid gap-3">
          <Card
            label="HRV"
            value={`${recovery.hrv}`}
            unit="ms"
            delta={+4}
            sub="7d avg 44ms"
            icon={<Heart className="size-3.5 text-rose-500" />}
          />
          <Card
            label="Resting heart rate"
            value={`${recovery.rhr}`}
            unit="bpm"
            delta={-2}
            sub="7d avg 54 bpm"
            icon={<TrendingDown className="size-3.5 text-emerald-500" />}
          />
          <Card
            label="Yesterday's strain"
            value={recovery.strain.toFixed(1)}
            sub="Moderate · within capacity"
            icon={<TrendingUp className="size-3.5 text-amber-500" />}
          />
          <Card
            label="Sleep debt · 7d"
            value="−2.3h"
            sub="catch up tonight"
            icon={<Moon className="size-3.5 text-indigo-500" />}
          />
        </aside>

        <article className="lg:col-span-12 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
          <header className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              recovery × glucose · 7 days
            </p>
            <span className="text-xs text-muted-foreground" style={mono}>
              are good nights driving stable days?
            </span>
          </header>
          <div className="mt-5 grid grid-cols-7 gap-3">
            {weeklyTIR.map((d, i) => {
              const rec = scores[scores.length - 7 + i] ?? 65;
              return (
                <article
                  key={d.date}
                  className="rounded-2xl border border-border/40 bg-card/60 p-4"
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    style={mono}
                  >
                    {d.weekday}
                  </p>
                  <p className="mt-2 text-xl font-semibold tabular-nums" style={display}>
                    {Math.round(rec)}
                  </p>
                  <p className="text-[10px] text-muted-foreground" style={mono}>
                    recovery
                  </p>
                  <hr className="my-3 border-border/40" />
                  <p className="text-xl font-semibold tabular-nums" style={display}>
                    {d.inRange}%
                  </p>
                  <p className="text-[10px] text-muted-foreground" style={mono}>
                    tir
                  </p>
                </article>
              );
            })}
          </div>
        </article>
      </main>
    </>
  );
}

function RecoveryRing({ value }: { value: number }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color =
    value >= 67 ? "rgb(16 185 129)" : value >= 33 ? "rgb(245 158 11)" : "rgb(244 63 94)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        opacity={0.12}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function Card({
  label,
  value,
  unit,
  sub,
  delta,
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  delta?: number;
  icon?: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          {label}
        </p>
        {icon}
      </div>
      <p
        className="mt-2 flex items-baseline gap-1 text-3xl font-semibold tabular-nums"
        style={display}
      >
        {value}
        {unit ? (
          <span className="text-sm font-normal text-muted-foreground" style={mono}>
            {unit}
          </span>
        ) : null}
        {delta !== undefined ? (
          <span
            className="ml-2 text-xs tabular-nums"
            style={{ ...mono, color: delta >= 0 ? "rgb(16 185 129)" : "rgb(244 63 94)" }}
          >
            {delta > 0 ? "+" : ""}
            {delta}
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
