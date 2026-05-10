---
name: Jobs to Be Done
description: The decisions a T1D endurance athlete actually makes, and how serene serves them
type: research
updated: 2026-05-10
status: Accepted
---

# Jobs to Be Done

> Framework: [Clayton Christensen's Jobs to Be Done](https://hbr.org/2016/09/know-your-customers-jobs-to-be-done)
> Format: **When** [situation] **I want to** [motivation] **so I can** [outcome]
> Source: [T1D + Endurance Domain Research](t1d-endurance-domain-research.md)

The unifying observation: a T1D endurance athlete makes a small set of repeating decisions, and each one needs **two or more of {glucose, recovery, training-load, planned-workout}** to answer well. Single-source apps make every decision worse. serene makes them faster.

---

## J1: See today at a glance (daily glance)

> The most-opened screen. The 30-second check-in.

**When** I open serene in the morning,
**I want to** see latest glucose, today's planned workout, recovery score, and overnight time-in-range on one card,
**so I can** decide if I need to swap today's session, fuel differently, or adjust expectations — without opening 4 apps.

### Functional requirements
- Latest glucose + trend + range badge
- Today's scheduled workout (from Garmin Coach / Garmin calendar)
- WHOOP recovery score
- Overnight TIR (8h block)
- One CTA per anomaly (e.g., "Recovery red — see why")

### Personas
- **Sasha:** Critical. Opens this 1–3×/day.
- **Riley:** Critical. Opens 1×/day.
- **Coach:** Read-only weekly view, less critical.

---

## J2: Plan the day around tomorrow's workout (the night-before decision)

**When** I look at serene the night before a planned session,
**I want to** see tomorrow's workout next to my projected sleep window, recent glucose patterns, and recovery trajectory,
**so I can** decide whether to set a temp basal at bedtime, change dinner carbs, or move the session.

### Functional requirements
- Tomorrow's planned workout — pulled from Garmin Coach / Garmin calendar / manual
- Last 7d overnight glucose mini-trace
- Recovery 7d trend strip
- "Workouts like this in the past" — historical median glucose response

### Personas
- **Sasha:** Critical (this is the differentiator vs Garmin Connect).
- **Riley:** Medium (no formal plan).

---

## J3: Replay a workout with glucose × HR/pace overlay (post-session review)

**When** I just finished a session,
**I want to** see HR, pace, and glucose on a synced timeline,
**so I can** understand what fueling worked, where I dropped, and whether next time I should change anything.

### Functional requirements
- Per-activity detail page with synced lines (HR, glucose, pace/power)
- Aerobic-vs-anaerobic glucose response signature visible
- Map with route, glucose-on-route coloring
- Annotated zones (Z1-Z5) with median glucose per zone

### Personas
- **Sasha:** Critical — this is *the* signature feature.
- **Riley:** High — opens this for any session > 45 min.
- **Coach:** Critical — what they share with Sasha.

---

## J4: Anticipate tonight's late-onset hypo risk (post-workout, pre-sleep)

> Late-onset (6–12h post-exercise) hypoglycemia has ~30% incidence after moderate aerobic in late afternoon.
> serene **describes the risk based on observed history; it never alarms or predicts a number**.

**When** I finished a session and it's bedtime,
**I want to** see how my overnight glucose has historically behaved after sessions like this one,
**so I can** decide on dinner carbs, basal adjustment expectations, and bed-snack choices myself.

### Functional requirements
- "Sessions like this" historical lookup (similar duration / TSS / glucose-end-point)
- Historical overnight nadir distribution (median, p25, p75)
- A descriptive risk badge (low/medium/high) with the underlying signals visible
- **No alarms, no numeric predictions, no carb amount recommendations.**

### Personas
- **Sasha:** Critical — single most-asked question post-session.
- **Riley:** Medium — only after long sessions.

---

## J5: Review the week (Sunday review)

**When** I sit down on Sunday to plan next week,
**I want to** see CTL/ATL/TSB next to weekly TIR, CV, and overnight nadir frequency,
**so I can** decide whether to ramp volume, hold flat, or pull back.

### Functional requirements
- 7-day strip: TSS by day, planned vs actual
- CTL/ATL/TSB chart
- Weekly TIR + CV + GMI
- Glucose-adjusted readiness signature (CTL × recovery × TIR)

### Personas
- **Sasha:** Critical (Sunday ritual).
- **Riley:** Medium.
- **Coach:** Critical.

---

## J6: Verify a hypothesis from a friend / coach / forum (the "is this normal?" job)

**When** I see a pattern (e.g., glucose spikes on intervals) and someone says "yeah that's normal,"
**I want to** quickly query my own history,
**so I can** confirm with my data — and adjust if it's not.

### Functional requirements
- Filter activities by tag/zone/intensity
- Stats panel showing % of intervals with hyper response, etc.
- Easy export of one chart for sharing

### Personas
- **Sasha:** High — happens 1–2×/week.

---

## J7: Share a moment with coach or partner

**When** my coach asks "why was Tuesday's threshold session short?",
**I want to** send a single read-only link with the workout + glucose overlay,
**so I can** explain in 10 seconds without writing a paragraph.

### Functional requirements
- Per-activity share token (signed, expiring)
- Read-only view, no auth required
- Hidden private fields (no medical history, no email)

### Personas
- **Sasha:** Critical for the coach relationship.
- **Coach:** Receives these.

---

## J8: Trust the data (sensor sanity)

**When** my glucose value looks off vs how I feel,
**I want to** see whether the sensor was active, lagging, or compressed,
**so I can** decide whether to trust the chart.

### Functional requirements
- Sensor session boundaries visible on chart
- "Compression low" candidate flagging (overnight rapid drop with stable HR)
- Last-sync timestamp per source, visible on every page

### Personas
- **Sasha:** Critical when anomalies appear.

---

## Job Priority Matrix

| Job | Sasha | Riley | Coach | Overall |
|-----|-------|-------|-------|---------|
| J1 — Daily glance | **Critical** | **Critical** | Medium | **Critical** |
| J2 — Plan around tomorrow | **Critical** | Medium | Medium | **Critical** |
| J3 — Replay workout w/ glucose | **Critical** | High | **Critical** | **Critical** |
| J4 — Late-hypo risk descriptive | **Critical** | Medium | Medium | High |
| J5 — Sunday review | **Critical** | Medium | **Critical** | High |
| J6 — Pattern verification | High | Low | Medium | Medium |
| J7 — Share with coach/partner | **Critical** | Low | **Critical** | High |
| J8 — Sensor sanity | High | Medium | Low | Medium |

**Insight:** J1, J2, J3 are the make-or-break jobs for Sasha. Together they cover the daily/nightly/post-session loop. J5 + J7 round out the weekly cadence. J4 is the highest-value differentiator that requires the cross-source join. J8 is the trust foundation that everything else rests on.

---

## Anti-jobs (we explicitly do NOT serve)

- **"Tell me what insulin to take."** Treatment decision support is a regulatory landmine. Out of scope, forever.
- **"Alarm me when I'm dropping."** Active monitoring with notifications is FDA-regulated CGM display. Use the LibreLinkUp app for that — it is cleared.
- **"Predict my glucose in 30 minutes."** Predictive alerts are device-software-function regulated. Out of scope.
- **"Tell me how many carbs to eat now."** Treatment guidance. Out of scope.
- **"Generate me a training plan."** We display plans from Garmin Coach / external sources; we don't author them.
