import { MapRoute } from "~/components/ui/map";

type TrackPoint = { lat: number; lng: number; t: number };
type GlucosePoint = { t: number; v: number };

const TARGET_LOW = 3.9;
const TARGET_HIGH = 10.0;
const URGENT_LOW = 3.0;
const VERY_HIGH = 13.9;

function colorFor(v: number): string {
  if (v < URGENT_LOW) return "hsl(0 80% 50%)";
  if (v < TARGET_LOW) return "hsl(38 92% 60%)";
  if (v <= TARGET_HIGH) return "hsl(150 60% 55%)";
  if (v <= VERY_HIGH) return "hsl(20 90% 60%)";
  return "hsl(0 70% 60%)";
}

// Chunk the track into N segments and color each by the nearest glucose
// reading at that segment's midpoint timestamp. Falls back to a monochrome
// route when no glucose overlap exists.
export function GlucoseTintedRoute({
  track,
  glucose,
  segments = 40,
}: {
  track: ReadonlyArray<TrackPoint>;
  glucose: ReadonlyArray<GlucosePoint>;
  segments?: number;
}) {
  if (track.length < 2) return null;

  const coords: [number, number][] = track.map((p) => [p.lng, p.lat]);

  if (glucose.length === 0) {
    return <MapRoute coordinates={coords} color="#10b981" width={4} opacity={0.95} />;
  }

  // Group track into roughly equal-size chunks. Each chunk's color is the
  // glucose value at the chunk's midpoint timestamp (nearest reading).
  const chunkSize = Math.max(2, Math.floor(track.length / segments));
  const out: { coords: [number, number][]; color: string; key: string }[] = [];

  for (let start = 0; start < track.length - 1; start += chunkSize - 1) {
    const end = Math.min(track.length, start + chunkSize);
    const slice = track.slice(start, end);
    if (slice.length < 2) continue;
    const midT = slice[Math.floor(slice.length / 2)]!.t;
    let nearestV = TARGET_LOW + (TARGET_HIGH - TARGET_LOW) / 2;
    let nearestDelta = Number.POSITIVE_INFINITY;
    for (const g of glucose) {
      const dt = Math.abs(g.t - midT);
      if (dt < nearestDelta) {
        nearestDelta = dt;
        nearestV = g.v;
      }
    }
    out.push({
      coords: slice.map((p) => [p.lng, p.lat] as [number, number]),
      color: colorFor(nearestV),
      key: `seg-${start}`,
    });
  }

  return (
    <>
      {out.map((s) => (
        <MapRoute
          key={s.key}
          id={s.key}
          coordinates={s.coords}
          color={s.color}
          width={4}
          opacity={0.95}
        />
      ))}
    </>
  );
}
