import type { GlucosePoint } from "~/lib/format";

type Props = {
  data: ReadonlyArray<GlucosePoint>;
  width?: number;
  height?: number;
  targetLow?: number;
  targetHigh?: number;
  showRangeBand?: boolean;
  strokeColor?: string;
  bandColor?: string;
  className?: string;
};

export function Sparkline({
  data,
  width = 600,
  height = 120,
  targetLow = 3.9,
  targetHigh = 10.0,
  showRangeBand = false,
  strokeColor = "currentColor",
  bandColor = "var(--color-glucose-in-range)",
  className,
}: Props) {
  if (data.length === 0) return null;

  const min = 2;
  const max = 14;
  const xStep = width / (data.length - 1);
  const yScale = (v: number) => height - ((v - min) / (max - min)) * height;

  const path = data.map((p, i) => `${i === 0 ? "M" : "L"} ${i * xStep} ${yScale(p.v)}`).join(" ");

  const bandTop = yScale(targetHigh);
  const bandBottom = yScale(targetLow);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="24-hour glucose trace"
    >
      {showRangeBand ? (
        <rect
          x={0}
          y={bandTop}
          width={width}
          height={bandBottom - bandTop}
          fill={bandColor}
          opacity={0.08}
        />
      ) : null}
      <path d={path} fill="none" stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}
