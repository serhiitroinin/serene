type TrackPoint = {
  t: number;
  hr: number | null;
  speed: number | null;
};

type GlucosePoint = { t: number; v: number };

type Props = {
  start: number;
  duration: number;
  track: ReadonlyArray<TrackPoint>;
  glucose: ReadonlyArray<GlucosePoint>;
  width?: number;
  height?: number;
  className?: string;
};

const TARGET_LOW = 3.9;
const TARGET_HIGH = 10.0;
const G_MIN = 2;
const G_MAX = 18;

// HR + speed + glucose on a shared time axis. The serene-original lens.
// Three stacked tracks instead of overlapping lines so each signal is
// readable; vertical hour ticks tie them together.
export function WorkoutOverlay({
  start,
  duration,
  track,
  glucose,
  width = 1200,
  height = 320,
  className,
}: Props) {
  const tStart = start;
  const tEnd = start + duration * 1000;
  const tSpan = Math.max(1, tEnd - tStart);
  const xAt = (t: number) => ((t - tStart) / tSpan) * width;

  const trackHr = track.filter((p) => p.hr != null) as Array<TrackPoint & { hr: number }>;
  const trackSpeed = track.filter((p) => p.speed != null) as Array<TrackPoint & { speed: number }>;

  // Three lanes, equal height.
  const lanes = 3;
  const laneH = height / lanes;
  const padY = 6;

  // HR lane scale
  const hrMin = trackHr.length ? Math.min(...trackHr.map((p) => p.hr)) : 60;
  const hrMax = trackHr.length ? Math.max(...trackHr.map((p) => p.hr)) : 180;
  const hrSpan = Math.max(20, hrMax - hrMin);
  const hrYAt = (v: number) => laneH - padY - ((v - hrMin) / hrSpan) * (laneH - 2 * padY);

  // Speed lane (we pretend mps; user reads pace mentally)
  const spMin = trackSpeed.length ? Math.min(...trackSpeed.map((p) => p.speed)) : 0;
  const spMax = trackSpeed.length ? Math.max(...trackSpeed.map((p) => p.speed)) : 5;
  const spSpan = Math.max(0.5, spMax - spMin);
  const spYAt = (v: number) => laneH * 2 - padY - ((v - spMin) / spSpan) * (laneH - 2 * padY);

  // Glucose lane
  const gYAt = (v: number) =>
    laneH * 3 - padY - ((v - G_MIN) / (G_MAX - G_MIN)) * (laneH - 2 * padY);
  const gTargetLowY = gYAt(TARGET_LOW);
  const gTargetHighY = gYAt(TARGET_HIGH);

  const hrPath =
    trackHr.length > 1
      ? trackHr.map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(p.t)} ${hrYAt(p.hr)}`).join(" ")
      : null;
  const spPath =
    trackSpeed.length > 1
      ? trackSpeed.map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(p.t)} ${spYAt(p.speed)}`).join(" ")
      : null;
  const gPath =
    glucose.length > 1
      ? glucose.map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(p.t)} ${gYAt(p.v)}`).join(" ")
      : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="HR, pace, and glucose on a shared timeline"
    >
      {/* Lane backgrounds */}
      <rect x={0} y={0} width={width} height={laneH} fill="currentColor" opacity={0.02} />
      <rect x={0} y={laneH * 2} width={width} height={laneH} fill="currentColor" opacity={0.02} />

      {/* Glucose target band */}
      <rect
        x={0}
        y={gTargetHighY}
        width={width}
        height={gTargetLowY - gTargetHighY}
        fill="hsl(150 60% 55%)"
        opacity={0.08}
      />

      {/* Lane separators */}
      <line x1={0} x2={width} y1={laneH} y2={laneH} stroke="currentColor" strokeOpacity={0.08} />
      <line
        x1={0}
        x2={width}
        y1={laneH * 2}
        y2={laneH * 2}
        stroke="currentColor"
        strokeOpacity={0.08}
      />

      {/* HR (rose) */}
      {hrPath ? (
        <path
          d={hrPath}
          fill="none"
          stroke="hsl(0 80% 65%)"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      ) : null}

      {/* Speed (amber) */}
      {spPath ? (
        <path
          d={spPath}
          fill="none"
          stroke="hsl(38 92% 60%)"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      ) : null}

      {/* Glucose (emerald) */}
      {gPath ? (
        <path
          d={gPath}
          fill="none"
          stroke="hsl(150 60% 55%)"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      ) : null}

      {/* Lane labels */}
      <text x={6} y={14} fontSize={10} fill="currentColor" opacity={0.6}>
        HR
      </text>
      <text x={6} y={laneH + 14} fontSize={10} fill="currentColor" opacity={0.6}>
        SPEED (m/s)
      </text>
      <text x={6} y={laneH * 2 + 14} fontSize={10} fill="currentColor" opacity={0.6}>
        GLUCOSE (mmol/L)
      </text>
    </svg>
  );
}

// Per-zone median glucose computed from {hr, glucose} samples aligned in time.
// Zones derived from HR using a maxHR fallback model (not power); good enough
// for descriptive zone-by-zone glucose output. The actual zone definition can
// be refined per user later.
export function ZoneStats({
  track,
  glucose,
  maxHr,
}: {
  track: ReadonlyArray<TrackPoint>;
  glucose: ReadonlyArray<GlucosePoint>;
  maxHr: number;
}) {
  if (glucose.length === 0 || track.length === 0 || maxHr === 0) return null;

  const zoneOf = (hr: number): number | null => {
    const pct = hr / maxHr;
    if (pct < 0.6) return 1;
    if (pct < 0.7) return 2;
    if (pct < 0.8) return 3;
    if (pct < 0.9) return 4;
    return 5;
  };

  // For each glucose reading, find the nearest HR sample; assign a zone; bucket.
  const buckets = new Map<number, number[]>();
  for (const g of glucose) {
    let nearest: TrackPoint | null = null;
    let nearestDelta = Number.POSITIVE_INFINITY;
    for (const p of track) {
      if (p.hr == null) continue;
      const dt = Math.abs(p.t - g.t);
      if (dt < nearestDelta) {
        nearestDelta = dt;
        nearest = p;
      }
    }
    if (!nearest || nearest.hr == null) continue;
    const zone = zoneOf(nearest.hr);
    if (zone == null) continue;
    if (!buckets.has(zone)) buckets.set(zone, []);
    buckets.get(zone)!.push(g.v);
  }

  if (buckets.size === 0) return null;

  const stats = [1, 2, 3, 4, 5].map((zone) => {
    const vals = buckets.get(zone) ?? [];
    if (vals.length === 0) return { zone, n: 0, median: null };
    const sorted = [...vals].toSorted((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
    return { zone, n: vals.length, median };
  });

  return (
    <div className="grid grid-cols-5 gap-2 text-center">
      {stats.map((s) => (
        <div key={s.zone} className="rounded-md border border-border/40 bg-card/60 px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Zone {s.zone}
          </p>
          <p className="mt-1 font-mono text-base">{s.median != null ? s.median.toFixed(1) : "—"}</p>
          <p className="text-[10px] text-muted-foreground">
            {s.n} reading{s.n === 1 ? "" : "s"}
          </p>
        </div>
      ))}
    </div>
  );
}
