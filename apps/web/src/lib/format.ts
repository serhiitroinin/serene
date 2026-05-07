export type GlucosePoint = { t: number; v: number };

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

export const formatRelativeTime = (t: number | Date | null): string => {
  if (!t) return "never";
  const ts = t instanceof Date ? t.getTime() : t;
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} h ago`;
  return `${Math.round(diff / 86400)} d ago`;
};

export const formatClock = (t: number | Date): string => {
  const date = t instanceof Date ? t : new Date(t);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
};

export const computeRouteCenter = (
  track: ReadonlyArray<{ lat: number; lng: number }>,
): [number, number] => {
  if (track.length === 0) return [4.879, 52.358];
  const lat = track.reduce((s, p) => s + p.lat, 0) / track.length;
  const lng = track.reduce((s, p) => s + p.lng, 0) / track.length;
  return [lng, lat];
};
