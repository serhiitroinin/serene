type AgpBin = {
  bin: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
  n: number;
};

type Props = {
  bins: ReadonlyArray<AgpBin>;
  binMinutes: number;
  width?: number;
  height?: number;
  className?: string;
};

const Y_MIN = 2;
const Y_MAX = 18;
const TARGET_LOW = 3.9;
const TARGET_HIGH = 10.0;
const LEVEL_2_LOW = 3.0;
const VERY_HIGH = 13.9;

// AGP — Ambulatory Glucose Profile. 14-day percentile-band view by
// time-of-day. Descriptive, never predictive. Reference bands at the
// clinical thresholds cited in the legend.
export function AgpChart({ bins, binMinutes, width = 1200, height = 320, className }: Props) {
  const totalN = bins.reduce((s, b) => s + b.n, 0);
  if (totalN === 0) return null;

  const xStep = width / bins.length;
  const yScale = (v: number) => height - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * height;

  // Build polygon paths for the IQR (25–75) and outer (5–95) bands. Skip bins
  // with insufficient samples to avoid drawing through a noisy median.
  const valid = bins.filter((b) => b.n >= 3);
  if (valid.length < 4) return null;

  const xAt = (b: AgpBin) => b.bin * xStep + xStep / 2;
  const polyForward = (key: "p5" | "p25") =>
    valid.map((b) => `${xAt(b)},${yScale(b[key])}`).join(" ");
  const polyReverse = (key: "p75" | "p95") =>
    [...valid]
      .reverse()
      .map((b) => `${xAt(b)},${yScale(b[key])}`)
      .join(" ");
  const outerBand = `${polyForward("p5")} ${polyReverse("p95")}`;
  const iqrBand = `${polyForward("p25")} ${polyReverse("p75")}`;
  const median = valid.map((b, i) => `${i === 0 ? "M" : "L"} ${xAt(b)} ${yScale(b.p50)}`).join(" ");

  const hourTicks = [0, 6, 12, 18, 24];
  const yTicks = [3.9, 7, 10, 13.9];

  const targetTop = yScale(TARGET_HIGH);
  const targetBottom = yScale(TARGET_LOW);
  const lowTop = yScale(TARGET_LOW);
  const lowBottom = yScale(LEVEL_2_LOW);
  const highTop = yScale(VERY_HIGH);
  const highBottom = yScale(TARGET_HIGH);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="14-day Ambulatory Glucose Profile"
    >
      {/* Reference bands — drawn first so the data sits on top */}
      <rect
        x={0}
        y={targetTop}
        width={width}
        height={targetBottom - targetTop}
        fill="hsl(150 60% 55%)"
        opacity={0.07}
      />
      <rect
        x={0}
        y={lowTop}
        width={width}
        height={lowBottom - lowTop}
        fill="hsl(40 100% 60%)"
        opacity={0.06}
      />
      <rect
        x={0}
        y={highTop}
        width={width}
        height={highBottom - highTop}
        fill="hsl(20 90% 60%)"
        opacity={0.06}
      />

      {/* Outer 5–95 band */}
      <polygon points={outerBand} fill="currentColor" opacity={0.12} />

      {/* IQR 25–75 band */}
      <polygon points={iqrBand} fill="currentColor" opacity={0.28} />

      {/* Median */}
      <path d={median} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />

      {/* Y-axis grid */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={0}
            x2={width}
            y1={yScale(v)}
            y2={yScale(v)}
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeDasharray="3 4"
          />
        </g>
      ))}

      {/* Hour ticks */}
      {hourTicks.map((h) => {
        const idx = (h * 60) / binMinutes;
        return (
          <line
            key={h}
            x1={idx * xStep}
            x2={idx * xStep}
            y1={0}
            y2={height}
            stroke="currentColor"
            strokeOpacity={0.06}
          />
        );
      })}
    </svg>
  );
}
