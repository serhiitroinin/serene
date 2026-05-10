import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { getDb, getOwnerId } from "../db/client";
import {
  garminActivities,
  garminScheduledWorkouts,
  garminTrackPoints,
  glucoseReadings,
  treatments,
  whoopRecoveries,
  whoopSleeps,
  whoopWorkouts,
} from "../db/schema";

export const getDashboardFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOwnerId();

  const sinceDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sinceWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const sinceOvernight = new Date(Date.now() - 8 * 60 * 60 * 1000);

  const last24hReadings = db
    .select()
    .from(glucoseReadings)
    .where(and(eq(glucoseReadings.userId, userId), gte(glucoseReadings.timestamp, sinceDay)))
    .orderBy(asc(glucoseReadings.timestamp))
    .all();

  const current = last24hReadings.at(-1) ?? null;

  const targetLow = 3.9;
  const targetHigh = 10.0;
  let inRange = 0;
  let below = 0;
  let above = 0;
  let sum = 0;
  for (const r of last24hReadings) {
    if (r.valueMmol < targetLow) below++;
    else if (r.valueMmol > targetHigh) above++;
    else inRange++;
    sum += r.valueMmol;
  }
  const total = last24hReadings.length || 1;
  const tir = {
    inRange: Math.round((inRange / total) * 100),
    below: Math.round((below / total) * 100),
    above: Math.round((above / total) * 100),
  };
  const avg = last24hReadings.length ? sum / last24hReadings.length : 0;
  const sd = last24hReadings.length
    ? Math.sqrt(
        last24hReadings.reduce((s, r) => s + (r.valueMmol - avg) ** 2, 0) / last24hReadings.length,
      )
    : 0;
  const cv = avg > 0 ? Math.round((sd / avg) * 100) : 0;
  const gmi = avg > 0 ? Number((3.31 + 0.02392 * avg * 18).toFixed(1)) : 0;

  // Overnight TIR (last 8h) — distinct from the 24h TIR. The "what happened
  // while I slept" answer for the Today card.
  const overnightReadings = last24hReadings.filter((r) => r.timestamp >= sinceOvernight);
  let overnightInRange = 0;
  for (const r of overnightReadings) {
    if (r.valueMmol >= targetLow && r.valueMmol <= targetHigh) overnightInRange++;
  }
  const overnightTir = {
    inRange: overnightReadings.length
      ? Math.round((overnightInRange / overnightReadings.length) * 100)
      : null,
    readings: overnightReadings.length,
  };

  const todayRecovery = db
    .select()
    .from(whoopRecoveries)
    .where(eq(whoopRecoveries.userId, userId))
    .orderBy(desc(whoopRecoveries.date))
    .limit(1)
    .all()[0];

  const lastSleep = db
    .select()
    .from(whoopSleeps)
    .where(eq(whoopSleeps.userId, userId))
    .orderBy(desc(whoopSleeps.start))
    .limit(1)
    .all()[0];

  const lastWorkoutWhoop = db
    .select()
    .from(whoopWorkouts)
    .where(eq(whoopWorkouts.userId, userId))
    .orderBy(desc(whoopWorkouts.start))
    .limit(1)
    .all()[0];

  const lastActivityGarmin = db
    .select()
    .from(garminActivities)
    .where(eq(garminActivities.userId, userId))
    .orderBy(desc(garminActivities.start))
    .limit(1)
    .all()[0];

  // Today's planned workout from Garmin Coach (next not-yet-completed entry
  // for today's date, if any). This is what F10 (Tomorrow card) extends.
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todaysScheduled = db
    .select()
    .from(garminScheduledWorkouts)
    .where(
      and(
        eq(garminScheduledWorkouts.userId, userId),
        eq(garminScheduledWorkouts.scheduledDate, todayDateStr),
      ),
    )
    .all();
  const todaysPlanned = todaysScheduled.find((s) => !s.completed) ?? null;

  const recentActivities = db
    .select()
    .from(garminActivities)
    .where(eq(garminActivities.userId, userId))
    .orderBy(desc(garminActivities.start))
    .limit(5)
    .all();

  const todaysTreatments = db
    .select()
    .from(treatments)
    .where(and(eq(treatments.userId, userId), gte(treatments.timestamp, sinceDay)))
    .orderBy(desc(treatments.timestamp))
    .all();

  const weekReadings = db
    .select()
    .from(glucoseReadings)
    .where(and(eq(glucoseReadings.userId, userId), gte(glucoseReadings.timestamp, sinceWeek)))
    .orderBy(asc(glucoseReadings.timestamp))
    .all();

  const weeklyTIR: Array<{ date: string; weekday: string; inRange: number; avg: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const day = weekReadings.filter((r) => r.timestamp >= dayStart && r.timestamp < dayEnd);
    const dayInRange = day.filter(
      (r) => r.valueMmol >= targetLow && r.valueMmol <= targetHigh,
    ).length;
    const dayAvg = day.length ? day.reduce((s, r) => s + r.valueMmol, 0) / day.length : 0;
    weeklyTIR.push({
      date: dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weekday: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
      inRange: day.length ? Math.round((dayInRange / day.length) * 100) : 0,
      avg: Number(dayAvg.toFixed(1)),
    });
  }

  return {
    glucose: {
      current: current?.valueMmol ?? null,
      trend: current?.trend ?? null,
      lastReadingAt: current?.timestamp.getTime() ?? null,
      readings: last24hReadings.map((r) => ({ t: r.timestamp.getTime(), v: r.valueMmol })),
    },
    tir,
    overnightTir,
    todaysPlanned: todaysPlanned
      ? {
          name: todaysPlanned.name ?? "Scheduled workout",
          sport: todaysPlanned.sport ?? null,
          durationSeconds: todaysPlanned.durationSeconds ?? null,
          planName: todaysPlanned.planName ?? null,
        }
      : null,
    today: {
      avg: Number(avg.toFixed(1)),
      gmi,
      sd: Number(sd.toFixed(1)),
      cv,
      readings: last24hReadings.length,
    },
    recovery: todayRecovery
      ? {
          score: todayRecovery.score ?? 0,
          hrv: todayRecovery.hrvMs ?? 0,
          rhr: todayRecovery.restingHrBpm ?? 0,
          sleep: lastSleep ? Math.round(((lastSleep.durationSeconds ?? 0) / 3600) * 10) / 10 : 0,
          strain: lastWorkoutWhoop?.strain ?? 0,
        }
      : null,
    todayActivity: lastActivityGarmin
      ? {
          id: lastActivityGarmin.activityId,
          sport: lastActivityGarmin.sport ?? "Activity",
          date: lastActivityGarmin.start.toLocaleString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          duration: lastActivityGarmin.durationSeconds ?? 0,
          distance: lastActivityGarmin.distanceMeters ?? 0,
          avgHr: lastActivityGarmin.avgHr ?? 0,
        }
      : null,
    recentActivities: recentActivities.map((a) => ({
      id: a.activityId,
      sport: a.sport ?? "Activity",
      date: a.start.toLocaleString("en-US", { month: "short", day: "numeric" }),
      duration: a.durationSeconds ?? 0,
      distance: a.distanceMeters ?? 0,
      avgHr: a.avgHr ?? 0,
      strain: 0,
      glucoseDelta: 0,
    })),
    treatments: todaysTreatments.map((t) => ({
      t: t.timestamp.getTime(),
      kind: t.kind,
      label: t.label,
      detail: t.detail,
    })),
    weeklyTIR,
  };
});

export const getActivityListFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOwnerId();
  const rows = db
    .select()
    .from(garminActivities)
    .where(eq(garminActivities.userId, userId))
    .orderBy(desc(garminActivities.start))
    .limit(50)
    .all();
  return rows.map((a) => ({
    id: a.activityId,
    sport: a.sport ?? "Activity",
    start: a.start.getTime(),
    date: a.start.toLocaleString("en-US", { month: "short", day: "numeric" }),
    duration: a.durationSeconds ?? 0,
    distance: a.distanceMeters ?? 0,
    avgHr: a.avgHr ?? 0,
    elevation: a.elevationGainMeters ?? 0,
    hasGps: a.hasGps ?? false,
  }));
});

export const getActivityDetailFn = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => ({ id: input.id }))
  .handler(async ({ data }) => {
    const db = getDb();
    const userId = getOwnerId();
    const activity = db
      .select()
      .from(garminActivities)
      .where(and(eq(garminActivities.userId, userId), eq(garminActivities.activityId, data.id)))
      .limit(1)
      .all()[0];
    if (!activity) return null;
    const points = db
      .select()
      .from(garminTrackPoints)
      .where(eq(garminTrackPoints.activityId, data.id))
      .orderBy(asc(garminTrackPoints.timestamp))
      .all();
    const overlap = db
      .select()
      .from(glucoseReadings)
      .where(
        and(
          eq(glucoseReadings.userId, userId),
          gte(glucoseReadings.timestamp, activity.start),
          lte(
            glucoseReadings.timestamp,
            new Date(activity.start.getTime() + (activity.durationSeconds ?? 0) * 1000),
          ),
        ),
      )
      .orderBy(asc(glucoseReadings.timestamp))
      .all();
    return {
      id: activity.activityId,
      sport: activity.sport ?? "Activity",
      start: activity.start.getTime(),
      duration: activity.durationSeconds ?? 0,
      distance: activity.distanceMeters ?? 0,
      avgHr: activity.avgHr ?? 0,
      maxHr: activity.maxHr ?? 0,
      elevation: activity.elevationGainMeters ?? 0,
      hasGps: activity.hasGps ?? false,
      track: points.map((p) => ({ lat: p.lat, lng: p.lng, t: p.timestamp.getTime() })),
      glucoseOverlap: overlap.map((r) => ({ t: r.timestamp.getTime(), v: r.valueMmol })),
    };
  });

export const getTreatmentsFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOwnerId();
  const rows = db
    .select()
    .from(treatments)
    .where(eq(treatments.userId, userId))
    .orderBy(desc(treatments.timestamp))
    .limit(200)
    .all();
  return rows.map((t) => ({
    t: t.timestamp.getTime(),
    kind: t.kind,
    label: t.label,
    detail: t.detail,
    source: t.source,
  }));
});

export const getRecoveryFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOwnerId();
  const recoveries = db
    .select()
    .from(whoopRecoveries)
    .where(eq(whoopRecoveries.userId, userId))
    .orderBy(desc(whoopRecoveries.date))
    .limit(30)
    .all();
  const sleeps = db
    .select()
    .from(whoopSleeps)
    .where(eq(whoopSleeps.userId, userId))
    .orderBy(desc(whoopSleeps.start))
    .limit(7)
    .all();
  return {
    recoveries: recoveries.map((r) => ({
      date: r.date.getTime(),
      score: r.score,
      hrv: r.hrvMs,
      rhr: r.restingHrBpm,
    })),
    sleeps: sleeps.map((s) => ({
      start: s.start.getTime(),
      end: s.end.getTime(),
      score: s.score,
      durationSeconds: s.durationSeconds,
    })),
  };
});

export const getGlucoseTraceFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOwnerId();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const rows = db
    .select()
    .from(glucoseReadings)
    .where(and(eq(glucoseReadings.userId, userId), gte(glucoseReadings.timestamp, since)))
    .orderBy(asc(glucoseReadings.timestamp))
    .all();
  return rows.map((r) => ({ t: r.timestamp.getTime(), v: r.valueMmol }));
});
