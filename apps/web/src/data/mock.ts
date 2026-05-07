export type GlucosePoint = { t: number; v: number };

export type Treatment = {
  t: number;
  kind: "insulin" | "carbs" | "exercise" | "note";
  label: string;
  detail?: string;
};

export type Workout = {
  id: string;
  sport: "Run" | "Ride" | "Swim" | "Strength";
  date: string;
  duration: number;
  distance: number;
  avgHr: number;
  strain: number;
  pace?: string;
  glucoseDelta: number;
};

export type RoutePoint = { lng: number; lat: number; v: number };

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
  recovery: { score: number; hrv: number; rhr: number; sleep: number; strain: number };
  workout: Workout;
  recentWorkouts: ReadonlyArray<Workout>;
  treatments: ReadonlyArray<Treatment>;
  weeklyTIR: ReadonlyArray<{ date: string; weekday: string; inRange: number; avg: number }>;
  route: ReadonlyArray<RoutePoint>;
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

// Synthetic Amsterdam loop — Vondelpark → Westerpark → centrum → back. ~14 km.
const generateRoute = (): ReadonlyArray<RoutePoint> => {
  const points: RoutePoint[] = [];
  const center = { lng: 4.879, lat: 52.358 };
  const total = 90;
  for (let i = 0; i < total; i++) {
    const t = i / (total - 1);
    const angle = t * Math.PI * 2 + Math.sin(t * 3.5) * 0.45;
    const radius = 0.018 + Math.sin(t * 7.5) * 0.006 + Math.cos(t * 2.2) * 0.003;
    const lng = center.lng + Math.cos(angle) * radius * 1.55;
    const lat = center.lat + Math.sin(angle) * radius;
    const v = 5.5 + Math.sin(t * 7) * 1.8 + Math.cos(t * 3) * 0.6 + (Math.random() - 0.5) * 0.4;
    points.push({ lng, lat, v: Number(v.toFixed(1)) });
  }
  return points;
};

export const ROUTE_CENTER: [number, number] = [4.879, 52.358];

const treatments: ReadonlyArray<Treatment> = (() => {
  const now = Date.now();
  const h = (n: number) => now - n * 60 * 60 * 1000;
  return [
    { t: h(22), kind: "insulin", label: "Lantus", detail: "18 u" },
    { t: h(20), kind: "note", label: "Asleep" },
    { t: h(13), kind: "note", label: "Awake" },
    { t: h(12.5), kind: "carbs", label: "Oats + berries", detail: "42 g" },
    { t: h(12.4), kind: "insulin", label: "NovoRapid", detail: "4.2 u" },
    { t: h(8), kind: "carbs", label: "Almonds", detail: "8 g" },
    { t: h(4.5), kind: "exercise", label: "Long run", detail: "14.2 km · 1h 30m" },
    { t: h(2.5), kind: "carbs", label: "Recovery shake", detail: "55 g" },
    { t: h(2.45), kind: "insulin", label: "NovoRapid", detail: "5.0 u" },
    { t: h(0.1), kind: "note", label: "In range · stable" },
  ];
})();

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
  recovery: { score: 64, hrv: 48, rhr: 52, sleep: 7.4, strain: 14.8 },
  workout: {
    id: "w-today",
    sport: "Run",
    date: "Today · 06:14",
    duration: 5400,
    distance: 14200,
    avgHr: 152,
    strain: 14.8,
    glucoseDelta: -2.1,
  },
  recentWorkouts: [
    {
      id: "w-1",
      sport: "Run",
      date: "Today · 06:14",
      duration: 5400,
      distance: 14200,
      avgHr: 152,
      strain: 14.8,
      glucoseDelta: -2.1,
    },
    {
      id: "w-2",
      sport: "Ride",
      date: "Yesterday · 17:08",
      duration: 3600,
      distance: 28400,
      avgHr: 138,
      strain: 11.2,
      glucoseDelta: -1.4,
    },
    {
      id: "w-3",
      sport: "Strength",
      date: "Mon · 18:30",
      duration: 2700,
      distance: 0,
      avgHr: 124,
      strain: 9.6,
      glucoseDelta: 0.8,
    },
    {
      id: "w-4",
      sport: "Run",
      date: "Sun · 07:42",
      duration: 7800,
      distance: 21100,
      avgHr: 156,
      strain: 17.4,
      glucoseDelta: -3.6,
    },
    {
      id: "w-5",
      sport: "Swim",
      date: "Fri · 19:00",
      duration: 1800,
      distance: 1800,
      avgHr: 132,
      strain: 7.8,
      glucoseDelta: -0.4,
    },
  ],
  treatments,
  weeklyTIR: [
    { date: "May 1", weekday: "Fri", inRange: 71, avg: 7.6 },
    { date: "May 2", weekday: "Sat", inRange: 82, avg: 6.9 },
    { date: "May 3", weekday: "Sun", inRange: 64, avg: 8.1 },
    { date: "May 4", weekday: "Mon", inRange: 76, avg: 7.2 },
    { date: "May 5", weekday: "Tue", inRange: 80, avg: 7.0 },
    { date: "May 6", weekday: "Wed", inRange: 73, avg: 7.4 },
    { date: "May 7", weekday: "Thu", inRange: 78, avg: 7.2 },
  ],
  route: generateRoute(),
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
  if (distanceMeters === 0) return "—";
  const paceSecPerKm = (durationSec / distanceMeters) * 1000;
  const m = Math.floor(paceSecPerKm / 60);
  const s = Math.round(paceSecPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}/km`;
};

export const formatRelativeTime = (t: number): string => {
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} h ago`;
  return `${Math.round(diff / 86400)} d ago`;
};

export const formatClock = (t: number): string =>
  new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
