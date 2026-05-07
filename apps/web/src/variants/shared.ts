export type VariantKey = "linear" | "whoop" | "editorial" | "activity";

export type GlucosePoint = { t: number; v: number };

export type MockData = {
  glucose: {
    current: number;
    trend: "rising" | "stable" | "falling";
    unit: "mmol";
    targetLow: number;
    targetHigh: number;
    urgentLow: number;
    last24h: ReadonlyArray<GlucosePoint>;
  };
  tir: { inRange: number; above: number; below: number };
  today: { avg: number; gmi: number; sd: number; cv: number; readings: number };
  recovery: { score: number; hrv: number; rhr: number; sleep: number };
  workout: {
    sport: string;
    duration: number;
    distance: number;
    avgHr: number;
    strain: number;
    when: string;
  };
};

const generateTrace = (): ReadonlyArray<GlucosePoint> => {
  const points: GlucosePoint[] = [];
  const start = Date.now() - 24 * 60 * 60 * 1000;
  let v = 6.2;
  for (let i = 0; i < 96; i++) {
    const drift = (Math.sin(i / 6) + Math.sin(i / 11)) * 1.6;
    const noise = (Math.random() - 0.5) * 0.4;
    v = Math.max(3.2, Math.min(13.5, 6.5 + drift + noise));
    points.push({ t: start + i * 15 * 60 * 1000, v: Number(v.toFixed(1)) });
  }
  return points;
};

export const mockData: MockData = {
  glucose: {
    current: 6.8,
    trend: "stable",
    unit: "mmol",
    targetLow: 3.9,
    targetHigh: 10.0,
    urgentLow: 3.0,
    last24h: generateTrace(),
  },
  tir: { inRange: 78, above: 14, below: 8 },
  today: { avg: 7.2, gmi: 6.4, sd: 1.8, cv: 24, readings: 287 },
  recovery: { score: 64, hrv: 48, rhr: 52, sleep: 7.4 },
  workout: {
    sport: "Run",
    duration: 5400,
    distance: 14200,
    avgHr: 152,
    strain: 14.8,
    when: "2h ago",
  },
};

export const formatGlucose = (v: number, unit: "mmol" = "mmol"): string =>
  unit === "mmol" ? v.toFixed(1) : Math.round(v * 18).toString();

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatDistance = (meters: number): string =>
  meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;

export const formatPace = (durationSec: number, distanceMeters: number): string => {
  const paceSecPerKm = (durationSec / distanceMeters) * 1000;
  const m = Math.floor(paceSecPerKm / 60);
  const s = Math.round(paceSecPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}/km`;
};
