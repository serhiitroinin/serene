import {
  formatClock,
  formatDistance,
  formatDuration,
  formatGlucose,
  formatPace,
  formatRelativeTime,
  mockData,
} from "./shared";

const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

const PALETTE = {
  bg: "#070b10",
  bgAlt: "#0c1219",
  panel: "#0e151f",
  border: "#1c2735",
  text: "#dbe7f3",
  dim: "#6b7d92",
  accent: "#ffb845",
  green: "#5dd2a4",
  red: "#ff6b6b",
  blue: "#74b8ff",
};

export function TerminalVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR } =
    mockData;
  const peak = Math.max(...glucose.last24h.map((p) => p.v));
  const low = Math.min(...glucose.last24h.map((p) => p.v));

  return (
    <div
      className="min-h-dvh"
      style={{ ...mono, backgroundColor: PALETTE.bg, color: PALETTE.text }}
    >
      <header
        className="flex items-center justify-between border-b px-4 py-2 text-[11px] uppercase"
        style={{ borderColor: PALETTE.border, backgroundColor: PALETTE.bgAlt }}
      >
        <div className="flex items-center gap-6">
          <span className="font-bold" style={{ color: PALETTE.accent }}>
            SERENE
          </span>
          <span style={{ color: PALETTE.dim }}>NET ▶ /dashboard</span>
          <span style={{ color: PALETTE.dim }}>SESSION 3:21:08</span>
        </div>
        <div className="flex items-center gap-4 tabular-nums" style={{ color: PALETTE.dim }}>
          <span>FX: 1 mmol/L → 18 mg/dL</span>
          <span>UTC {formatClock(Date.now())}</span>
          <span style={{ color: PALETTE.green }}>● link.libre OK</span>
          <span style={{ color: PALETTE.green }}>● whoop OK</span>
          <span style={{ color: PALETTE.accent }}>● garmin SYNCING</span>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: "200px 1fr 240px" }}>
        <aside
          className="border-r p-3 text-[11px]"
          style={{ borderColor: PALETTE.border, minHeight: "calc(100dvh - 60px)" }}
        >
          <p className="mb-2 uppercase" style={{ color: PALETTE.dim }}>
            Channels
          </p>
          <ul className="space-y-0.5">
            {[
              ["F1", "GLUCOSE", true],
              ["F2", "ACTIVITY", false],
              ["F3", "RECOVERY", false],
              ["F4", "TREATMENTS", false],
              ["F5", "REPORTS", false],
              ["F6", "SOURCES", false],
              ["F7", "SHARE", false],
              ["F8", "SETTINGS", false],
            ].map(([key, label, active]) => (
              <li
                key={key as string}
                className="flex items-center gap-2 px-1.5 py-1"
                style={{
                  backgroundColor: active ? PALETTE.border : "transparent",
                  color: active ? PALETTE.accent : PALETTE.text,
                }}
              >
                <span style={{ color: PALETTE.dim }}>{key}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <p className="uppercase mb-2" style={{ color: PALETTE.dim }}>
              Watchlist
            </p>
            <div className="space-y-1.5 text-[10px]">
              {[
                ["TIR", `${tir.inRange}%`, "+2"],
                ["GMI", today.gmi.toFixed(1), "−0.1"],
                ["CV", `${today.cv}%`, "−1"],
                ["RHR", `${recovery.rhr}`, "−2"],
                ["HRV", `${recovery.hrv}ms`, "+4"],
              ].map(([k, val, delta]) => (
                <div key={k as string} className="flex justify-between">
                  <span style={{ color: PALETTE.dim }}>{k}</span>
                  <span className="tabular-nums">{val}</span>
                  <span
                    className="tabular-nums"
                    style={{
                      color: (delta as string).startsWith("+") ? PALETTE.green : PALETTE.red,
                    }}
                  >
                    {delta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="p-4">
          <div className="grid grid-cols-12 gap-3">
            <div
              className="col-span-12 rounded-sm border p-4 lg:col-span-7"
              style={{ borderColor: PALETTE.border, backgroundColor: PALETTE.panel }}
            >
              <div
                className="flex items-baseline justify-between text-[11px] uppercase"
                style={{ color: PALETTE.dim }}
              >
                <span>Glucose · 24h trace</span>
                <span>
                  peak {peak.toFixed(1)} · low {low.toFixed(1)} · target 3.9–10.0
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span
                  className="text-6xl font-semibold tabular-nums"
                  style={{ color: PALETTE.accent }}
                >
                  {formatGlucose(glucose.current)}
                </span>
                <span className="text-xs uppercase" style={{ color: PALETTE.dim }}>
                  mmol/L
                </span>
                <span className="text-xs" style={{ color: PALETTE.green }}>
                  STABLE · IN RANGE
                </span>
              </div>
              <div className="relative mt-4 h-44">
                <svg
                  viewBox="0 0 600 180"
                  preserveAspectRatio="none"
                  className="absolute inset-0 size-full"
                >
                  <g stroke={PALETTE.border} strokeWidth={0.5} strokeDasharray="2 2">
                    {[3, 6, 10, 14].map((v) => {
                      const y = 180 - ((v - 2) / 12) * 180;
                      return <line key={v} x1={0} x2={600} y1={y} y2={y} />;
                    })}
                  </g>
                  <rect
                    x={0}
                    y={180 - ((10 - 2) / 12) * 180}
                    width={600}
                    height={((10 - 3.9) / 12) * 180}
                    fill={PALETTE.accent}
                    opacity={0.06}
                  />
                  <path
                    d={glucose.last24h
                      .map((p, i) => {
                        const x = (i / (glucose.last24h.length - 1)) * 600;
                        const y = 180 - ((p.v - 2) / 12) * 180;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke={PALETTE.accent}
                    strokeWidth={1.25}
                  />
                </svg>
              </div>
              <div
                className="mt-2 flex justify-between text-[10px] uppercase"
                style={{ color: PALETTE.dim }}
              >
                <span>−24h</span>
                <span>−18h</span>
                <span>−12h</span>
                <span>−6h</span>
                <span>now</span>
              </div>
            </div>

            <div
              className="col-span-12 rounded-sm border p-4 lg:col-span-5"
              style={{ borderColor: PALETTE.border, backgroundColor: PALETTE.panel }}
            >
              <p className="text-[11px] uppercase" style={{ color: PALETTE.dim }}>
                Time in range · 24h
              </p>
              <div
                className="mt-3 flex h-3 overflow-hidden border"
                style={{ borderColor: PALETTE.border }}
              >
                <div style={{ width: `${tir.below}%`, backgroundColor: PALETTE.red }} />
                <div style={{ width: `${tir.inRange}%`, backgroundColor: PALETTE.green }} />
                <div style={{ width: `${tir.above}%`, backgroundColor: PALETTE.blue }} />
              </div>
              <div className="mt-2 grid grid-cols-3 text-[11px] tabular-nums">
                <span style={{ color: PALETTE.red }}>{tir.below}% LOW</span>
                <span className="text-center" style={{ color: PALETTE.green }}>
                  {tir.inRange}% IR
                </span>
                <span className="text-right" style={{ color: PALETTE.blue }}>
                  {tir.above}% HIGH
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
                {[
                  ["AVG", formatGlucose(today.avg), "mmol/L"],
                  ["GMI", today.gmi.toFixed(1), "A1C est."],
                  ["SD", today.sd.toFixed(1), "mmol/L"],
                  ["CV", `${today.cv}%`, "variance"],
                  ["READINGS", today.readings.toString(), "scans"],
                  ["UPTIME", "99.6%", "sensor"],
                ].map(([label, value, unit]) => (
                  <div
                    key={label as string}
                    className="flex items-baseline justify-between border-b pb-1"
                    style={{ borderColor: PALETTE.border }}
                  >
                    <span style={{ color: PALETTE.dim }}>{label}</span>
                    <span className="text-right">
                      <span className="text-sm tabular-nums" style={{ color: PALETTE.text }}>
                        {value}
                      </span>
                      <span className="ml-1 text-[10px]" style={{ color: PALETTE.dim }}>
                        {unit}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="col-span-12 rounded-sm border p-4 lg:col-span-7"
              style={{ borderColor: PALETTE.border, backgroundColor: PALETTE.panel }}
            >
              <div
                className="flex items-baseline justify-between text-[11px] uppercase"
                style={{ color: PALETTE.dim }}
              >
                <span>Treatments · last 24h</span>
                <span>{treatments.length} events</span>
              </div>
              <ul
                className="mt-3 divide-y text-[11px]"
                style={{ ...data, borderColor: PALETTE.border }}
              >
                {treatments.slice(0, 7).map((t) => (
                  <li
                    key={t.t}
                    className="flex items-baseline gap-3 py-1.5"
                    style={{ borderColor: PALETTE.border }}
                  >
                    <span className="w-16 tabular-nums" style={{ color: PALETTE.dim }}>
                      {formatClock(t.t)}
                    </span>
                    <span
                      className="w-20 uppercase tracking-wider"
                      style={{
                        color:
                          t.kind === "insulin"
                            ? PALETTE.blue
                            : t.kind === "carbs"
                              ? PALETTE.accent
                              : t.kind === "exercise"
                                ? PALETTE.green
                                : PALETTE.dim,
                      }}
                    >
                      {t.kind}
                    </span>
                    <span className="flex-1">{t.label}</span>
                    <span className="tabular-nums" style={{ color: PALETTE.dim }}>
                      {t.detail ?? ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="col-span-12 rounded-sm border p-4 lg:col-span-5"
              style={{ borderColor: PALETTE.border, backgroundColor: PALETTE.panel }}
            >
              <p className="text-[11px] uppercase" style={{ color: PALETTE.dim }}>
                Recent workouts
              </p>
              <table className="mt-3 w-full text-[11px]">
                <thead>
                  <tr style={{ color: PALETTE.dim }}>
                    {["WHEN", "SPORT", "DIST", "PACE", "ΔBG"].map((h) => (
                      <th key={h} className="pb-2 text-left font-normal uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentWorkouts.map((w) => (
                    <tr key={w.id} className="border-t" style={{ borderColor: PALETTE.border }}>
                      <td className="py-1.5" style={{ color: PALETTE.dim }}>
                        {w.date.split("·")[0]?.trim()}
                      </td>
                      <td>{w.sport}</td>
                      <td className="tabular-nums">{formatDistance(w.distance)}</td>
                      <td className="tabular-nums">{formatPace(w.duration, w.distance)}</td>
                      <td
                        className="tabular-nums"
                        style={{ color: w.glucoseDelta < 0 ? PALETTE.green : PALETTE.red }}
                      >
                        {w.glucoseDelta > 0 ? "+" : ""}
                        {w.glucoseDelta.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <aside
          className="border-l p-3 text-[11px]"
          style={{ borderColor: PALETTE.border, backgroundColor: PALETTE.bgAlt }}
        >
          <p className="uppercase mb-2" style={{ color: PALETTE.dim }}>
            This run
          </p>
          <p className="text-2xl font-semibold" style={{ color: PALETTE.accent }}>
            {formatDistance(workout.distance)}
          </p>
          <p style={{ color: PALETTE.dim }}>
            {formatDuration(workout.duration)} · {formatPace(workout.duration, workout.distance)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <Field label="HR" value={`${workout.avgHr} bpm`} dim={PALETTE.dim} />
            <Field label="STRAIN" value={workout.strain.toFixed(1)} dim={PALETTE.dim} />
            <Field
              label="ΔBG"
              value={`${workout.glucoseDelta.toFixed(1)}`}
              dim={PALETTE.dim}
              accent={PALETTE.green}
            />
            <Field label="LANE" value="Z3" dim={PALETTE.dim} />
          </div>

          <div className="mt-6">
            <p className="uppercase mb-2" style={{ color: PALETTE.dim }}>
              Week ▶ TIR
            </p>
            <div className="grid grid-cols-7 gap-0.5">
              {weeklyTIR.map((d) => (
                <div key={d.date} className="text-center text-[9px]">
                  <div
                    className="h-12 w-full"
                    style={{
                      backgroundColor: PALETTE.green,
                      opacity: 0.2 + (d.inRange / 100) * 0.8,
                    }}
                    title={`${d.date}: ${d.inRange}% TIR`}
                  />
                  <p className="mt-1" style={{ color: PALETTE.dim }}>
                    {d.weekday[0]}
                  </p>
                  <p className="tabular-nums">{d.inRange}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="uppercase mb-2" style={{ color: PALETTE.dim }}>
              Last sync
            </p>
            <ul className="space-y-1 tabular-nums">
              <li className="flex justify-between">
                <span>libre</span>
                <span style={{ color: PALETTE.green }}>
                  {formatRelativeTime(Date.now() - 60_000)}
                </span>
              </li>
              <li className="flex justify-between">
                <span>whoop</span>
                <span style={{ color: PALETTE.green }}>
                  {formatRelativeTime(Date.now() - 5 * 60_000)}
                </span>
              </li>
              <li className="flex justify-between">
                <span>garmin</span>
                <span style={{ color: PALETTE.accent }}>
                  {formatRelativeTime(Date.now() - 23 * 60_000)}
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <footer
        className="border-t px-4 py-1.5 text-[10px] uppercase tabular-nums"
        style={{ borderColor: PALETTE.border, backgroundColor: PALETTE.bgAlt, color: PALETTE.dim }}
      >
        F1 GLUCOSE · F2 ACTIVITY · F3 RECOVERY · F4 TREATMENTS ▷
        <span className="float-right">serene v0.0.1 · terminal · 78fps · &gt;_</span>
      </footer>
    </div>
  );
}

function Field({
  label,
  value,
  dim,
  accent,
}: {
  label: string;
  value: string;
  dim: string;
  accent?: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase" style={{ color: dim }}>
        {label}
      </p>
      <p className="tabular-nums" style={{ color: accent ?? "inherit" }}>
        {value}
      </p>
    </div>
  );
}
