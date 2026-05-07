import { ArrowUpRight } from "lucide-react";
import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";
import { RouteMap } from "./route-map";

const display = { fontFamily: "var(--font-display-cond)" } as const;
const labels = { fontFamily: "var(--font-condensed-light)" } as const;
const body = { fontFamily: "var(--font-body-soft)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

const C = {
  bg: "#080705",
  bgSoft: "#101010",
  panel: "#16140f",
  ink: "#fafaf7",
  dim: "#7d756b",
  signal: "#ff6a13",
  signalDim: "#a64315",
  ok: "#5dd2a4",
};

export function VelocityVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, route, weeklyTIR } = mockData;
  const max = Math.max(...weeklyTIR.map((d) => d.inRange));

  return (
    <div className="min-h-dvh" style={{ ...body, backgroundColor: C.bg, color: C.ink }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 0%, rgba(255,106,19,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 75% 10%, rgba(94,210,164,0.08), transparent 70%)",
        }}
      />
      <div className="relative">
        <header
          className="mx-auto flex max-w-[1400px] items-center justify-between px-10 py-6 text-sm"
          style={mono}
        >
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2 18 L18 2" stroke={C.signal} strokeWidth={2.5} />
              <path d="M2 12 L12 2" stroke={C.signal} strokeWidth={2.5} opacity={0.55} />
              <path d="M8 18 L18 8" stroke={C.signal} strokeWidth={2.5} opacity={0.3} />
            </svg>
            <span className="tracking-[0.32em] uppercase" style={{ color: C.signal }}>
              SERENE
            </span>
          </div>
          <nav
            className="flex items-center gap-8 uppercase tracking-[0.18em] text-xs"
            style={labels}
          >
            {["Today", "Trace", "Activity", "Recovery", "Plan"].map((n, i) => (
              <span key={n} style={{ color: i === 0 ? C.ink : C.dim }}>
                {n}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-xs uppercase" style={{ color: C.dim }}>
            <span style={{ color: C.ok }}>● live</span>
            <span>5/7</span>
            <span
              className="rounded-full border px-3 py-1"
              style={{ borderColor: C.signal, color: C.signal }}
            >
              MARATHON: 39 DAYS
            </span>
          </div>
        </header>

        <section className="mx-auto max-w-[1400px] px-10 pb-8 pt-4">
          <p className="text-xs uppercase tracking-[0.32em]" style={{ ...mono, color: C.signal }}>
            TODAY · IN RANGE · STABLE · 14:38
          </p>
          <div className="mt-3 grid items-end gap-12 lg:grid-cols-[auto_1fr]">
            <div>
              <h1
                className="leading-[0.78] tracking-[-0.04em]"
                style={{ ...display, fontSize: "clamp(8rem, 18vw, 22rem)" }}
              >
                <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
                <span className="text-3xl align-top opacity-60" style={mono}>
                  {" "}
                  mmol
                </span>
              </h1>
              <p className="mt-2 text-2xl uppercase" style={{ ...labels, color: C.dim }}>
                ARROW STABLE · BAND HOLDING · {tir.inRange}% TIR
              </p>
            </div>

            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ ...mono, color: C.dim }}>
                last 24h · 96 readings
              </p>
              <div className="mt-3 h-56 w-full">
                <svg viewBox="0 0 800 220" preserveAspectRatio="none" className="size-full">
                  <defs>
                    <linearGradient id="velocity-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={C.signal} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={C.signal} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <rect
                    x={0}
                    y={220 - ((10 - 2) / 12) * 220}
                    width={800}
                    height={((10 - 3.9) / 12) * 220}
                    fill={C.ink}
                    opacity={0.04}
                  />
                  <path
                    d={
                      glucose.last24h
                        .map((p, i) => {
                          const x = (i / (glucose.last24h.length - 1)) * 800;
                          const y = 220 - ((p.v - 2) / 12) * 220;
                          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                        })
                        .join(" ") + ` L 800 220 L 0 220 Z`
                    }
                    fill="url(#velocity-fill)"
                    stroke="none"
                  />
                  <path
                    d={glucose.last24h
                      .map((p, i) => {
                        const x = (i / (glucose.last24h.length - 1)) * 800;
                        const y = 220 - ((p.v - 2) / 12) * 220;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke={C.signal}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-[1400px] grid gap-6 px-10 lg:grid-cols-12">
        <article
          className="lg:col-span-7 overflow-hidden rounded-xl border"
          style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: C.panel }}
        >
          <div className="flex items-center justify-between p-6">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ ...mono, color: C.signal }}
              >
                Today's run · 06:14
              </p>
              <h2 className="mt-1 text-5xl tracking-tight" style={display}>
                {formatDistance(workout.distance)} long run
              </h2>
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs uppercase tracking-widest"
              style={{ ...labels, borderColor: C.signal, color: C.signal }}
            >
              View route <ArrowUpRight className="size-3.5" />
            </span>
          </div>
          <div
            className="relative aspect-[16/9]"
            style={{ color: C.signal, backgroundColor: C.bgSoft }}
          >
            <RouteMap
              route={route}
              variant="topo"
              className="absolute inset-0 size-full"
              showGlucoseGradient
            />
            <div
              className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-xs uppercase tracking-widest"
              style={mono}
            >
              <span style={{ color: C.dim }}>start 7.6 mmol/L</span>
              <span style={{ color: C.signal }}>peak HR {workout.avgHr + 18}</span>
              <span style={{ color: C.dim }}>finish 5.5 mmol/L</span>
            </div>
          </div>
          <div
            className="grid grid-cols-4 divide-x px-2 py-4 text-sm"
            style={{ color: C.dim, borderColor: "rgba(255,255,255,0.08)" }}
          >
            <Stat
              label="Pace"
              value={formatPace(workout.duration, workout.distance)}
              signal={C.signal}
            />
            <Stat label="Time" value={formatDuration(workout.duration)} signal={C.signal} />
            <Stat label="Avg HR" value={`${workout.avgHr}`} signal={C.signal} />
            <Stat label="Strain" value={workout.strain.toFixed(1)} signal={C.signal} />
          </div>
        </article>

        <aside className="lg:col-span-5 grid gap-6">
          <div
            className="rounded-xl border p-6"
            style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: C.panel }}
          >
            <p className="text-xs uppercase tracking-[0.3em]" style={{ ...mono, color: C.signal }}>
              Recovery · today
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-7xl tabular-nums" style={display}>
                {recovery.score}
              </span>
              <span className="text-sm uppercase" style={{ ...labels, color: C.dim }}>
                / 100
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full"
                style={{ width: `${recovery.score}%`, backgroundColor: C.ok }}
              />
            </div>
            <div
              className="mt-5 grid grid-cols-3 gap-2 text-xs uppercase"
              style={{ ...mono, color: C.dim }}
            >
              <Tiny label="HRV" value={`${recovery.hrv}ms`} />
              <Tiny label="RHR" value={`${recovery.rhr}`} />
              <Tiny label="Sleep" value={`${recovery.sleep}h`} />
            </div>
          </div>

          <div
            className="rounded-xl border p-6"
            style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: C.panel }}
          >
            <p className="text-xs uppercase tracking-[0.3em]" style={{ ...mono, color: C.signal }}>
              7-day TIR
            </p>
            <div className="mt-4 flex items-end gap-2 h-24">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(d.inRange / max) * 100}%`,
                      backgroundColor: d.inRange >= 75 ? C.signal : C.signalDim,
                    }}
                  />
                  <span className="text-[10px] uppercase" style={{ ...mono, color: C.dim }}>
                    {d.weekday[0]}
                  </span>
                  <span className="text-[10px] tabular-nums" style={mono}>
                    {d.inRange}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl border p-6"
            style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: C.panel }}
          >
            <p className="text-xs uppercase tracking-[0.3em]" style={{ ...mono, color: C.signal }}>
              Today's Numbers
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Tiny label="Average" value={`${formatGlucose(today.avg)} mmol`} />
              <Tiny label="GMI" value={today.gmi.toFixed(1)} />
              <Tiny label="Std Dev" value={today.sd.toFixed(1)} />
              <Tiny label="CV" value={`${today.cv}%`} />
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-[1400px] px-10 py-12">
        <div className="flex items-baseline justify-between">
          <h3 className="text-3xl tracking-tight" style={display}>
            RECENT EFFORTS
          </h3>
          <span className="text-xs uppercase tracking-widest" style={{ ...mono, color: C.dim }}>
            see all →
          </span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {recentWorkouts.map((w) => (
            <article
              key={w.id}
              className="group relative overflow-hidden rounded-xl border p-5"
              style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: C.panel }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.28em]"
                style={{ ...mono, color: C.signal }}
              >
                {w.date}
              </p>
              <h4 className="mt-3 text-3xl tracking-tight" style={display}>
                {w.sport}
              </h4>
              <p className="mt-1 text-sm uppercase" style={{ ...labels, color: C.dim }}>
                {formatDistance(w.distance)} · {formatPace(w.duration, w.distance)}
              </p>
              <div
                className="mt-4 flex items-baseline justify-between text-xs uppercase tracking-wider"
                style={mono}
              >
                <span style={{ color: C.dim }}>strain {w.strain.toFixed(1)}</span>
                <span style={{ color: w.glucoseDelta < 0 ? C.ok : C.signal }}>
                  ΔBG {w.glucoseDelta > 0 ? "+" : ""}
                  {w.glucoseDelta.toFixed(1)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, signal }: { label: string; value: string; signal: string }) {
  return (
    <div className="px-4">
      <p className="text-[10px] uppercase tracking-widest" style={{ ...mono }}>
        {label}
      </p>
      <p className="mt-1 text-xl" style={{ ...display, color: signal }}>
        {value}
      </p>
    </div>
  );
}

function Tiny({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-widest"
        style={{ fontFamily: "var(--font-mono-grotesque)" }}
      >
        {label}
      </p>
      <p className="mt-1 text-base tabular-nums" style={{ fontFamily: "var(--font-body-soft)" }}>
        {value}
      </p>
    </div>
  );
}
