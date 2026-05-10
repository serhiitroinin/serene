# Garmin Connect — Training-Plan / Scheduled-Workout API

Research notes for serene v0.1. Date: 2026-05-10.
Goal: surface a Garmin user's scheduled workouts and active Garmin Coach plan inside serene.

## TL;DR

There is no public Garmin endpoint for this. We piggy-back on the same undocumented
`connectapi.garmin.com` services that the web app uses, plus a GraphQL endpoint for
the calendar and Coach views. Everything below is reverse-engineered from
`python-garminconnect` (`cyberjunky`) and `garmin-workouts-mcp` (`brunosantos`),
which are both actively used in 2026.

Auth in 2026 is the painful bit: classic SSO is heavily 429-rate-limited; the
working path is the SSO **web-widget** flow (`/sso/embed` + `/sso/signin`) — this
is exactly what the user's existing `luff/packages/garmin/src/auth.ts` already does.

## 1. Endpoints we actually need

Base host: `https://connectapi.garmin.com` (no `/proxy/` prefix on the modern
domain — the legacy `connect.garmin.com/modern/proxy/...` still works but is being
phased out).

| Purpose | Method | Path |
|---|---|---|
| List user's saved workouts (templates) | GET | `/workout-service/workouts?start=0&limit=100` |
| Workout detail (steps + targets) | GET | `/workout-service/workout/{workoutId}` |
| Garmin Coach workout detail (UUID) | GET | `/workout-service/fbt-adaptive/{workoutUuid}` |
| Scheduled workouts for a month | GET | `/calendar-service/year/{YYYY}/month/{MM-1}` *(0-indexed!)* |
| Scheduled workout by id | GET | `/workout-service/schedule/{scheduledId}` |
| Schedule a workout on a date | POST | `/workout-service/schedule/{workoutId}` body `{"date":"YYYY-MM-DD"}` |
| Unschedule | DELETE | `/workout-service/schedule/{scheduledId}` |
| All training plans (catalog) | GET | `/trainingplan-service/trainingplan/plans` |
| Phased plan detail | GET | `/trainingplan-service/trainingplan/phased/{planId}` |
| Adaptive (Garmin Coach) plan detail | GET | `/trainingplan-service/trainingplan/fbt-adaptive/{planId}` |
| GraphQL (calendar + coach view) | POST | `/graphql-gateway/graphql` |

The **GraphQL endpoint is the right one for serene**. It returns a curated
calendar in a single round-trip and is what the Garmin Connect web UI uses for
its "Calendar" and "Coach" pages.

```graphql
# Scheduled workouts in a date range
query { workoutScheduleSummariesScalar(startDate:"2026-05-10", endDate:"2026-06-10") }

# This week's Garmin Coach plan (returns ~7 days around the date)
query { trainingPlanScalar(calendarDate:"2026-05-10", lang:"en-US", firstDayOfWeek:"monday") }
```

Sample `trainingPlanScalar` payload (truncated, from brunosantos test fixtures):

```json
{
  "data": { "trainingPlanScalar": {
    "trainingPlanWorkoutScheduleDTOS": [{
      "planName": "5K Training Plan",
      "trainingPlanDetailsDTO": { "athletePlanId": 12345, "workoutsPerWeek": 4 },
      "workoutScheduleSummaries": [
        { "workoutUuid": "abc-123", "workoutName": "Base Run",
          "workoutType": "running", "scheduleDate": "2026-05-12",
          "tpPlanName": "5K Training Plan",
          "associatedActivityId": null, "estimatedDurationInSecs": 1800,
          "workoutPhrase": "AEROBIC_LOW_BASE", "isRestDay": false, "race": false }
      ]
    }]
  }}
}
```

`associatedActivityId != null` → workout was completed and is linked to a Garmin
activity. `workoutUuid` is the lookup key for `fbt-adaptive` to fetch full step
detail. **This means: yes, we can read the user's currently-active Garmin Coach
plan**, including weekly structure, rest days, and the upcoming race.

## 2. Existing libraries

- **python-garminconnect** ([cyberjunky](https://github.com/cyberjunky/python-garminconnect)) — canonical reverse-engineered client. Has `get_scheduled_workouts(year, month)`, `get_training_plans()`, `get_training_plan_by_id()`, `get_adaptive_training_plan_by_id()`, `schedule_workout()`. Calendar/training-plan URLs hard-coded in `garminconnect/__init__.py` lines 472–498.
- **garmin-workouts-mcp** ([brunosantos](https://github.com/brunosantos/garmin-workouts-mcp)) — wraps python-garminconnect, exposes the **GraphQL queries above** as MCP tools (`get_scheduled_workouts`, `get_training_plan_workouts`). This is the current best reference for the calendar/coach views.
- **garmin-connect** ([Pythe1337N, npm](https://github.com/Pythe1337N/garmin-connect)) — TS client, has `getWorkouts/scheduleWorkout/deleteWorkout` but **no scheduled-workout reader and no training-plan support**. We'd have to fall through to `GCClient.get(url)`.
- **garth** ([matin/garth](https://github.com/matin/garth)) — Python auth+thin-client. **Deprecated 2026-02**, but its SSO web-widget flow is what everyone copied; still works.

## 3. Auth in 2026

Classic SSO portal/mobile flow is broken — Garmin keys 429s on `clientId` +
email; users are blocked for 24–48h after a few failed logins.
The working flow (luff already implements it):

1. `GET https://sso.garmin.com/sso/embed?clientId=GarminConnect&service=https://connect.garmin.com/modern` — pick up cookies.
2. `GET /sso/signin?...` — extract `_csrf` from HTML.
3. `POST /sso/signin` with `username`, `password`, `embed=true`, `_csrf` (form-encoded). Response HTML contains `ticket=...`.
4. If body contains "MFA": prompt for code, re-POST with `mfa-code`. Plain TOTP, no email/SMS.
5. `GET https://connectapi.garmin.com/oauth-service/oauth/preauthorized?ticket=...` signed with OAuth1 HMAC-SHA1 using the consumer key/secret from `https://thegarth.s3.amazonaws.com/oauth_consumer.json` → returns OAuth1 access token.
6. `POST /oauth-service/oauth/exchange/user/2.0` signed with OAuth1 → returns OAuth2 `{access_token, refresh_token, expires_in≈3600, refresh_token_expires_in≈30 days}`.
7. All subsequent API calls: `Authorization: Bearer <access_token>`, UA `com.garmin.android.apps.connectmobile`.

Rate limits to design for: ~1 login per minute per account; data calls are
generous (hundreds/min) but get a 429 if you hammer them. Cache OAuth2 tokens to
SQLite (encrypted at rest) and only re-do steps 1–6 when the refresh token has
~24h left.

## 4. Workout JSON structure

A workout is `{ workoutName, sportType, estimatedDurationInSecs, workoutSegments[] }`.
Each segment has `workoutSteps[]`. A step is either an `ExecutableStepDTO` (warmup,
interval, recovery, cooldown, rest) or a `RepeatGroupDTO` (contains nested
`workoutSteps` plus `numberOfIterations`).

Targets use `workoutTargetTypeKey`: `no.target`, `heart.rate.zone` (use
`zoneNumber: 1–5`), `speed.zone` (m/s in `targetValueOne/Two`), `power.zone`,
`cadence`, `pace.zone`. End conditions: `time` (sec), `distance` (m), `lap.button`,
`heart.rate`, `iterations`. Sport IDs: 1 running, 2 cycling, 4 swimming, 6
fitness equipment, 7 hiking. (Source: `garminconnect/workout.py` Pydantic models.)

## 5. Garmin Coach plans

Yes, readable. The `trainingPlanScalar` GraphQL query returns the active plan's
metadata (`planName`, `athletePlanId`, `workoutsPerWeek`) and the rolling 7-day
schedule. For richer structure, `/trainingplan-service/trainingplan/fbt-adaptive/{planId}`
returns the full adaptive plan with phases. Coach workouts use UUIDs (not numeric
ids) and resolve via `/workout-service/fbt-adaptive/{uuid}` for step-level detail.
Caveat: Garmin Coach is **read-mostly** — we cannot mutate the plan; we surface it.

## 6. Recommendation for serene v0.1

Sprint reality check: W19 day 2 has a hard 4-hour gate on Garmin. A training-plan
view fits in W20 polish, not the W19 port — but only the cheapest tier.

| Tier | What | Effort | Verdict for v0.1 |
|---|---|---|---|
| **A. Upcoming-workouts list** | `workoutScheduleSummariesScalar` for next 14 days, list view: date · name · sport · duration. No step detail. | **0.5 day** | **Ship in v0.1.** Highest signal-to-effort. |
| B. Calendar grid | 4-week month grid, workouts as chips, click → drawer with steps via `fbt-adaptive`/`workout/{id}`. | 2 days | v0.2. |
| C. Plan progression | `trainingPlanScalar` + `fbt-adaptive` plan endpoint, phase progress, race date countdown, weekly TSS. | 3 days | v0.2 / v0.3. |
| D. Workout × glucose overlay (post-execution) | Already covered by activity sync; not a "plan" feature. | 0 incremental | Already in scope. |

**Decision**: ship Tier A only in v0.1. One server function calling
`workoutScheduleSummariesScalar` once per sync, persist to a `scheduled_workout`
table (fields: `scheduled_date`, `workout_uuid`, `workout_name`, `sport`,
`tp_plan_name`, `estimated_duration_secs`, `is_rest_day`, `is_race_day`,
`completed_activity_id`). Render as an "Upcoming" strip on the dashboard above
the AGP. Defer the calendar grid and plan view to v0.2.

## Sources

- [python-garminconnect (cyberjunky)](https://github.com/cyberjunky/python-garminconnect) — `garminconnect/__init__.py` (lines 472, 477, 498, 2872–3003); `garminconnect/workout.py`.
- [garmin-workouts-mcp (brunosantos)](https://github.com/brunosantos/garmin-workouts-mcp) — `src/garmin_workouts_mcp/workouts.py` (GraphQL queries, fbt-adaptive).
- [garmin-connect npm (Pythe1337N)](https://github.com/Pythe1337N/garmin-connect).
- [garth (matin)](https://github.com/matin/garth) — deprecated but reference for SSO flow; [issue #344](https://github.com/cyberjunky/python-garminconnect/issues/344) on web-widget bypass.
- `serhiitroinin/luff:packages/garmin/src/auth.ts` — working TS implementation of the SSO web-widget + OAuth1 → OAuth2 flow.
