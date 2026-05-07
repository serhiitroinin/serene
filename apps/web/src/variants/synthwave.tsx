import {
  formatClock,
  formatDistance,
  formatDuration,
  formatGlucose,
  formatPace,
  mockData,
} from "./shared";
import { RouteMap } from "./route-map";

const crt = { fontFamily: "var(--font-mono-crt)" } as const;
const display = { fontFamily: "var(--font-display-crt)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

const C = {
  bg: "#0a0119",
  panel: "#150a2c",
  ink: "#f7d6ff",
  dim: "#9b82c8",
  magenta: "#ff2bd6",
  cyan: "#22e8ff",
  yellow: "#ffd23f",
  scan: "rgba(255, 43, 214, 0.04)",
};

export function SynthwaveVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, route } = mockData;

  return (
    <div
      className="relative min-h-dvh overflow-hidden"
      style={{ ...crt, backgroundColor: C.bg, color: C.ink }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(255,43,214,0.18), transparent 60%), radial-gradient(ellipse 80% 60% at 0% 0%, rgba(34,232,255,0.1), transparent 65%), radial-gradient(ellipse 60% 50% at 100% 30%, rgba(255,210,63,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,43,214,0.06) 2px, rgba(255,43,214,0.06) 3px)",
        }}
      />

      <div className="relative grid" style={{ gridTemplateColumns: "240px 1fr" }}>
        <aside
          className="sticky top-0 h-dvh border-r p-5"
          style={{
            borderColor: "rgba(255,43,214,0.35)",
            backgroundColor: "rgba(10, 1, 25, 0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: C.magenta, boxShadow: `0 0 12px ${C.magenta}` }}
            />
            <h1 className="text-2xl tracking-[0.32em]" style={{ ...display, color: C.cyan }}>
              SЯƎИƎ
            </h1>
          </div>
          <p className="mt-1 text-[10px] tracking-[0.32em] uppercase" style={{ color: C.dim }}>
            v0.0.1 · build 0507
          </p>

          <div className="mt-8">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: C.cyan }}>
              ▰▰▰ MENU ▰▰▰
            </p>
            <ul className="space-y-1.5 text-sm uppercase">
              {[
                "TODAY",
                "TRACE.LOG",
                "ACTIVITY.RUN",
                "RECOVERY",
                "TREATMENTS",
                "WEEKLY.HEAT",
                "SHARE.LINK",
                "CONFIG.SYS",
              ].map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-2"
                  style={{
                    color: i === 0 ? C.magenta : C.ink,
                    textShadow: i === 0 ? `0 0 8px ${C.magenta}` : "none",
                  }}
                >
                  <span style={{ color: i === 0 ? C.magenta : C.dim }}>{i === 0 ? "▶" : "◇"}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="mt-10 rounded border-2 p-3"
            style={{
              borderColor: C.cyan,
              boxShadow: `0 0 12px ${C.cyan}55, inset 0 0 12px ${C.cyan}22`,
            }}
          >
            <p className="text-xs" style={{ color: C.cyan }}>
              ::: SIGNAL :::
            </p>
            <p className="mt-1 text-2xl" style={display}>
              {tir.inRange < 80 ? "OK" : "OK+"}
            </p>
            <p className="text-[11px]" style={{ color: C.dim }}>
              libre.cgm: ONLINE
              <br />
              whoop.api: ONLINE
              <br />
              garmin.fit: SYNC..
            </p>
          </div>

          <p className="mt-12 text-[10px]" style={{ color: C.dim }}>
            ▒▒▒ DO NOT POWER OFF ▒▒▒
          </p>
        </aside>

        <main className="p-8">
          <div
            className="rounded-md border-2 p-6"
            style={{
              borderColor: C.magenta,
              backgroundColor: "rgba(21, 10, 44, 0.6)",
              boxShadow: `0 0 24px ${C.magenta}55, inset 0 0 32px ${C.magenta}22`,
            }}
          >
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: C.cyan, ...mono }}>
                ░░░ GLUCOSE.PRIMARY ░░░
              </p>
              <p className="text-xs tabular-nums" style={{ ...mono, color: C.dim }}>
                T+ {formatClock(Date.now())} · 96 reads
              </p>
            </div>
            <div className="mt-4 flex items-center gap-8">
              <span
                className="leading-none tabular-nums"
                style={{
                  ...display,
                  fontSize: "clamp(8rem, 16vw, 16rem)",
                  color: C.magenta,
                  textShadow: `0 0 16px ${C.magenta}, 0 0 32px ${C.magenta}88`,
                }}
              >
                {formatGlucose(glucose.current)}
              </span>
              <div>
                <p className="text-2xl uppercase" style={{ color: C.cyan }}>
                  mmol/L
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.4em]" style={{ color: C.dim }}>
                  {">_ STABLE"}
                </p>
                <p className="text-xs uppercase tracking-[0.4em]" style={{ color: C.yellow }}>
                  {">_ IN.BAND"}
                </p>
              </div>
            </div>

            <div className="mt-6 h-44">
              <svg
                viewBox="0 0 1000 180"
                preserveAspectRatio="none"
                className="size-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="synth-line-grad" x1="0" x2="1">
                    <stop offset="0%" stopColor={C.cyan} />
                    <stop offset="50%" stopColor={C.magenta} />
                    <stop offset="100%" stopColor={C.yellow} />
                  </linearGradient>
                  <linearGradient id="synth-fill-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={C.magenta} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={C.magenta} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <g stroke={C.magenta} strokeOpacity={0.18} strokeWidth={1}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line key={`vh${i}`} x1={(i + 1) * 80} x2={(i + 1) * 80} y1={0} y2={180} />
                  ))}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <line key={`hh${i}`} y1={(i + 1) * 30} y2={(i + 1) * 30} x1={0} x2={1000} />
                  ))}
                </g>
                <rect
                  x={0}
                  y={180 - ((10 - 2) / 12) * 180}
                  width={1000}
                  height={((10 - 3.9) / 12) * 180}
                  fill={C.cyan}
                  opacity={0.07}
                />
                <path
                  d={
                    glucose.last24h
                      .map((p, i) => {
                        const x = (i / (glucose.last24h.length - 1)) * 1000;
                        const y = 180 - ((p.v - 2) / 12) * 180;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ") + " L 1000 180 L 0 180 Z"
                  }
                  fill="url(#synth-fill-grad)"
                />
                <path
                  d={glucose.last24h
                    .map((p, i) => {
                      const x = (i / (glucose.last24h.length - 1)) * 1000;
                      const y = 180 - ((p.v - 2) / 12) * 180;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="url(#synth-line-grad)"
                  strokeWidth={2}
                  style={{ filter: `drop-shadow(0 0 4px ${C.magenta})` }}
                />
              </svg>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Panel title="TIR.STATUS" accent={C.cyan}>
              <div
                className="flex h-3 w-full overflow-hidden border"
                style={{ borderColor: C.cyan }}
              >
                <div
                  style={{
                    width: `${tir.below}%`,
                    backgroundColor: C.yellow,
                    boxShadow: `inset 0 0 4px ${C.yellow}`,
                  }}
                />
                <div
                  style={{
                    width: `${tir.inRange}%`,
                    backgroundColor: C.cyan,
                    boxShadow: `inset 0 0 4px ${C.cyan}`,
                  }}
                />
                <div
                  style={{
                    width: `${tir.above}%`,
                    backgroundColor: C.magenta,
                    boxShadow: `inset 0 0 4px ${C.magenta}`,
                  }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 text-xs uppercase tabular-nums" style={mono}>
                <span style={{ color: C.yellow }}>{tir.below}% LO</span>
                <span className="text-center" style={{ color: C.cyan }}>
                  {tir.inRange}% IR
                </span>
                <span className="text-right" style={{ color: C.magenta }}>
                  {tir.above}% HI
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                <KV k="AVG" v={`${formatGlucose(today.avg)}mmol`} />
                <KV k="GMI" v={today.gmi.toFixed(1)} />
                <KV k="SD " v={today.sd.toFixed(1)} />
                <KV k="CV " v={`${today.cv}%`} />
              </div>
            </Panel>

            <Panel title="RECOVERY.OK" accent={C.magenta}>
              <p
                className="text-7xl tabular-nums"
                style={{ ...display, color: C.magenta, textShadow: `0 0 12px ${C.magenta}` }}
              >
                {recovery.score}
              </p>
              <p className="text-xs uppercase tracking-[0.32em]" style={{ color: C.dim }}>
                ::: of 100 :::
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <KV k="HRV" v={`${recovery.hrv}ms`} />
                <KV k="RHR" v={`${recovery.rhr}`} />
                <KV k="ZZZ" v={`${recovery.sleep}h`} />
              </div>
            </Panel>

            <Panel title="EFFORT.RUN" accent={C.yellow}>
              <p className="text-3xl uppercase" style={{ ...display, color: C.yellow }}>
                {workout.sport}
              </p>
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: C.dim }}>
                {workout.date}
              </p>
              <p className="mt-3 text-3xl tabular-nums" style={display}>
                {formatDistance(workout.distance)}
              </p>
              <p className="text-xs tabular-nums" style={{ color: C.dim }}>
                {formatDuration(workout.duration)} ·{" "}
                {formatPace(workout.duration, workout.distance)}
              </p>
              <p
                className="mt-3 text-sm tabular-nums"
                style={{ color: workout.glucoseDelta < 0 ? C.cyan : C.magenta }}
              >
                ΔBG = {workout.glucoseDelta > 0 ? "+" : ""}
                {workout.glucoseDelta.toFixed(1)} mmol
              </p>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div
              className="rounded-md border-2 p-5"
              style={{
                borderColor: C.cyan,
                boxShadow: `0 0 16px ${C.cyan}33, inset 0 0 16px ${C.cyan}22`,
              }}
            >
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: C.magenta }}>
                {">_ EVENT.LOG --tail 9"}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {treatments.slice(0, 9).map((t) => (
                  <li
                    key={t.t}
                    className="grid items-baseline gap-3 border-b border-dashed pb-1"
                    style={{
                      gridTemplateColumns: "70px 80px 1fr auto",
                      borderColor: "rgba(255,43,214,0.2)",
                    }}
                  >
                    <span className="tabular-nums" style={{ color: C.dim }}>
                      {formatClock(t.t)}
                    </span>
                    <span
                      className="uppercase"
                      style={{
                        color:
                          t.kind === "insulin"
                            ? C.cyan
                            : t.kind === "carbs"
                              ? C.yellow
                              : t.kind === "exercise"
                                ? C.magenta
                                : C.dim,
                      }}
                    >
                      {t.kind}
                    </span>
                    <span>{t.label}</span>
                    <span className="tabular-nums" style={{ color: C.dim }}>
                      {t.detail ?? ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="overflow-hidden rounded-md border-2"
              style={{ borderColor: C.magenta, boxShadow: `0 0 16px ${C.magenta}55` }}
            >
              <div
                className="flex items-baseline justify-between border-b px-4 py-2 text-xs uppercase"
                style={{ borderColor: C.magenta, color: C.cyan }}
              >
                <span>{">_ ROUTE.TODAY.GLUCOSE_OVERLAY"}</span>
                <span style={{ color: C.dim }}>
                  {formatDistance(workout.distance)} · {formatDuration(workout.duration)}
                </span>
              </div>
              <div className="aspect-[16/9] w-full">
                <RouteMap route={route} variant="neon" className="size-full" showGlucoseGradient />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: C.cyan }}>
              {">_ MISSIONS.PAST"}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
              {recentWorkouts.map((w) => (
                <div
                  key={w.id}
                  className="rounded-md border p-3"
                  style={{
                    borderColor: "rgba(34,232,255,0.5)",
                    backgroundColor: "rgba(34,232,255,0.04)",
                  }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{ ...mono, color: C.dim }}
                  >
                    {w.date}
                  </p>
                  <p className="mt-2 text-2xl uppercase" style={{ ...display, color: C.cyan }}>
                    {w.sport}
                  </p>
                  <p className="text-sm tabular-nums" style={mono}>
                    {formatDistance(w.distance)}
                  </p>
                  <p
                    className="text-xs tabular-nums"
                    style={{ ...mono, color: w.glucoseDelta < 0 ? C.cyan : C.magenta }}
                  >
                    Δ {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p
            className="mt-10 text-center text-[10px] uppercase tracking-[0.4em]"
            style={{ color: C.dim }}
          >
            ░ © 1986 Æ 2026 · serene corp · ALL RIGHTS RESERVED · NOT MEDICAL ADVICE ░
          </p>
        </main>
      </div>
    </div>
  );
}

function Panel({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-md border-2 p-5"
      style={{
        borderColor: accent,
        backgroundColor: "rgba(21, 10, 44, 0.55)",
        boxShadow: `0 0 16px ${accent}44, inset 0 0 16px ${accent}22`,
      }}
    >
      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: accent }}>
        {">_ "}
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="flex items-baseline justify-between border-b border-dashed pb-1"
      style={{ borderColor: "rgba(255,43,214,0.2)" }}
    >
      <span
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--syn-dim, #9b82c8)" }}
      >
        {k}
      </span>
      <span className="tabular-nums">{v}</span>
    </div>
  );
}
