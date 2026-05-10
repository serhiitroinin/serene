import { randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { getDb, getOwnerId } from "../db/client";
import { garminActivities, garminTrackPoints, glucoseReadings, shareLinks } from "../db/schema";

const DEFAULT_EXPIRY_DAYS = 7;

function newToken(): string {
  return randomBytes(24).toString("base64url");
}

export const createActivityShareLinkFn = createServerFn({ method: "POST" })
  .inputValidator((input: { activityId: string; expiryDays?: number }) => ({
    activityId: z.string().min(1).parse(input.activityId),
    expiryDays: z
      .number()
      .int()
      .min(1)
      .max(30)
      .default(DEFAULT_EXPIRY_DAYS)
      .parse(input.expiryDays),
  }))
  .handler(async ({ data }) => {
    const db = getDb();
    const userId = getOwnerId();
    // Verify the activity belongs to this user before issuing a token.
    const activity = db
      .select({ id: garminActivities.activityId })
      .from(garminActivities)
      .where(
        and(eq(garminActivities.userId, userId), eq(garminActivities.activityId, data.activityId)),
      )
      .limit(1)
      .all()[0];
    if (!activity) return { ok: false as const, error: "Activity not found" };

    const token = newToken();
    const expiresAt = new Date(Date.now() + data.expiryDays * 24 * 60 * 60 * 1000);
    db.insert(shareLinks)
      .values({
        token,
        userId,
        kind: "activity",
        targetId: data.activityId,
        expiresAt,
      })
      .run();
    return { ok: true as const, token, expiresAt: expiresAt.getTime() };
  });

export const revokeShareLinkFn = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => ({
    token: z.string().min(1).parse(input.token),
  }))
  .handler(async ({ data }) => {
    const db = getDb();
    const userId = getOwnerId();
    db.delete(shareLinks)
      .where(and(eq(shareLinks.userId, userId), eq(shareLinks.token, data.token)))
      .run();
    return { ok: true };
  });

export const getSharedActivityFn = createServerFn({ method: "GET" })
  .inputValidator((input: { token: string }) => ({
    token: z.string().min(1).parse(input.token),
  }))
  .handler(async ({ data }) => {
    const db = getDb();
    const link = db
      .select()
      .from(shareLinks)
      .where(eq(shareLinks.token, data.token))
      .limit(1)
      .all()[0];
    if (!link) return { ok: false as const, reason: "not-found" as const };
    if (link.expiresAt.getTime() <= Date.now()) {
      return { ok: false as const, reason: "expired" as const };
    }
    if (link.kind !== "activity") return { ok: false as const, reason: "not-found" as const };

    const activity = db
      .select()
      .from(garminActivities)
      .where(
        and(
          eq(garminActivities.userId, link.userId),
          eq(garminActivities.activityId, link.targetId),
        ),
      )
      .limit(1)
      .all()[0];
    if (!activity) return { ok: false as const, reason: "not-found" as const };

    const points = db
      .select()
      .from(garminTrackPoints)
      .where(eq(garminTrackPoints.activityId, link.targetId))
      .orderBy(asc(garminTrackPoints.timestamp))
      .all();
    const overlap = db
      .select()
      .from(glucoseReadings)
      .where(
        and(
          eq(glucoseReadings.userId, link.userId),
          gte(glucoseReadings.timestamp, activity.start),
          lte(
            glucoseReadings.timestamp,
            new Date(activity.start.getTime() + (activity.durationSeconds ?? 0) * 1000),
          ),
        ),
      )
      .orderBy(asc(glucoseReadings.timestamp))
      .all();

    // Public read-only projection — explicitly drop user_id, raw, anything that
    // could carry PII. The athlete's name / email are not in the activity row.
    return {
      ok: true as const,
      activity: {
        sport: activity.sport ?? "Activity",
        start: activity.start.getTime(),
        duration: activity.durationSeconds ?? 0,
        distance: activity.distanceMeters ?? 0,
        avgHr: activity.avgHr ?? 0,
        maxHr: activity.maxHr ?? 0,
        elevation: activity.elevationGainMeters ?? 0,
        hasGps: activity.hasGps ?? false,
        track: points.map((p) => ({
          lat: p.lat,
          lng: p.lng,
          t: p.timestamp.getTime(),
          hr: p.hrBpm,
          speed: p.speedMps,
        })),
        glucoseOverlap: overlap.map((r) => ({ t: r.timestamp.getTime(), v: r.valueMmol })),
      },
      expiresAt: link.expiresAt.getTime(),
    };
  });
