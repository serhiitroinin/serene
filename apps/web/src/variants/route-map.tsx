import type { RoutePoint } from "./shared";

type Props = {
  route: ReadonlyArray<RoutePoint>;
  width?: number;
  height?: number;
  variant?: "topo" | "neon" | "minimal" | "paper" | "blueprint";
  className?: string;
  showGlucoseGradient?: boolean;
};

const palette = {
  topo: {
    bg: "transparent",
    contour: "currentColor",
    contourOpacity: 0.18,
    routeStroke: "currentColor",
    grid: "currentColor",
    gridOpacity: 0.06,
  },
  neon: {
    bg: "transparent",
    contour: "#ff00aa",
    contourOpacity: 0.18,
    routeStroke: "#22d3ee",
    grid: "#ff00aa",
    gridOpacity: 0.1,
  },
  minimal: {
    bg: "transparent",
    contour: "currentColor",
    contourOpacity: 0.1,
    routeStroke: "currentColor",
    grid: "currentColor",
    gridOpacity: 0.04,
  },
  paper: {
    bg: "transparent",
    contour: "#7c5a3c",
    contourOpacity: 0.32,
    routeStroke: "#9b2a2a",
    grid: "#7c5a3c",
    gridOpacity: 0.12,
  },
  blueprint: {
    bg: "transparent",
    contour: "#a8d2ff",
    contourOpacity: 0.32,
    routeStroke: "#fffceb",
    grid: "#a8d2ff",
    gridOpacity: 0.18,
  },
} as const;

export function RouteMap({
  route,
  width = 600,
  height = 360,
  variant = "topo",
  className,
  showGlucoseGradient = false,
}: Props) {
  const p = palette[variant];
  const path = route
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x * width} ${pt.y * height}`)
    .join(" ");

  const minV = Math.min(...route.map((r) => r.v));
  const maxV = Math.max(...route.map((r) => r.v));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-label="route preview with glucose overlay"
      role="img"
    >
      <defs>
        <linearGradient id={`glucose-route-${variant}`} x1="0%" x2="100%">
          {route.map((pt, i) => {
            const stop = (i / (route.length - 1)) * 100;
            const norm = (pt.v - minV) / Math.max(0.01, maxV - minV);
            const hue = 200 + (1 - norm) * 75;
            return (
              <stop key={`${variant}-${i}`} offset={`${stop}%`} stopColor={`hsl(${hue} 60% 60%)`} />
            );
          })}
        </linearGradient>
      </defs>

      <g stroke={p.grid} strokeOpacity={p.gridOpacity} strokeWidth={1} fill="none">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={(i + 1) * (width / 13)}
            x2={(i + 1) * (width / 13)}
            y1={0}
            y2={height}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h${i}`}
            y1={(i + 1) * (height / 9)}
            y2={(i + 1) * (height / 9)}
            x1={0}
            x2={width}
          />
        ))}
      </g>

      <g stroke={p.contour} strokeOpacity={p.contourOpacity} strokeWidth={1} fill="none">
        {[0.15, 0.3, 0.45, 0.6, 0.75].map((depth) => (
          <path
            key={depth}
            d={`M -20 ${height * depth + Math.sin(depth * 9) * 30}
                Q ${width * 0.25} ${height * depth - 40 - depth * 30},
                  ${width * 0.5} ${height * depth + 20}
                T ${width + 20} ${height * depth - 10}`}
          />
        ))}
      </g>

      <path
        d={path}
        fill="none"
        stroke={showGlucoseGradient ? `url(#glucose-route-${variant})` : p.routeStroke}
        strokeWidth={variant === "neon" ? 2.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          variant === "neon"
            ? { filter: "drop-shadow(0 0 4px #22d3eecc) drop-shadow(0 0 10px #22d3ee66)" }
            : undefined
        }
      />

      <circle
        cx={route[0]!.x * width}
        cy={route[0]!.y * height}
        r={5}
        fill={variant === "neon" ? "#22d3ee" : p.routeStroke}
      />
      <circle
        cx={route[route.length - 1]!.x * width}
        cy={route[route.length - 1]!.y * height}
        r={5}
        fill="none"
        stroke={variant === "neon" ? "#22d3ee" : p.routeStroke}
        strokeWidth={2}
      />
    </svg>
  );
}
