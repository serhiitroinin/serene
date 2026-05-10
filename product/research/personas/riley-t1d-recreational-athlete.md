---
name: "Persona: Riley (T1D Recreational Athlete)"
description: "SECONDARY persona — T1D adult who trains 3-4×/week without a formal plan; uses fewer wearables; cares about glucose-aware workouts but not racing."
type: persona
updated: 2026-05-10
status: Accepted
priority: SECONDARY
---

# Persona: Riley (T1D Recreational Athlete)

> **Secondary persona.** Optimized for once Sasha's experience is excellent. Useful for v0.2+ scoping decisions.

> "I'm not training for anything. I just want to keep moving and not bonk on Saturdays."

---

## Demographics

| Attribute | Value |
|-----------|-------|
| **Role** | Anyone — T1D adult who exercises regularly |
| **Age range** | 30–55 |
| **CGM** | Libre 3 or Dexcom G7 |
| **Recovery wearable** | Maybe Apple Watch / Garmin entry-level / nothing |
| **Training volume** | 3–4 sessions/week, 30–90 min each, no plan |
| **Discipline** | Mixed — running, gym, yoga, hiking |
| **Technical proficiency** | Medium — installs apps; might or might not self-host |
| **Budget sensitivity** | Medium |

## Context

Riley exercises for health, not for a goal. They wear a Libre and one fitness device (Apple Watch or basic Garmin). They don't have a coach, don't follow a plan, and don't care about TSS or CTL. They want to know: "did today's workout do something to my glucose?" and "what's a good Saturday session that won't ruin my weekend?"

## Goals

1. **Primary:** Stay active without glucose surprises ruining a weekend.
2. **Secondary:** Notice patterns over time — "what types of workouts feel best?"

## Frustrations

1. Same single-source-tool fragmentation as Sasha, but less tolerance for complexity.
2. Most "diabetes apps" feel medical; most "fitness apps" don't know about diabetes.

## Frustration vs Sasha differences

- Riley does **not** care about TSS / CTL / ATL / TSB — would prefer simpler "weekly volume" + "weekly TIR."
- Riley **may not** self-host — might prefer a hosted version. (v1.x decision.)
- Riley **does not** care about coach sharing.
- Riley **does** care about late-hypo descriptive risk after long sessions.

## Feature sensitivity

| Capability | Priority |
|-----------|----------|
| Today's glucose + recent workout overlay | High |
| Late-hypo descriptive risk badge | High |
| Weekly TIR | Medium |
| TSS / CTL / planned workouts | Low |
| Self-host vs hosted | Hosted preferred |
| Designer-grade UX | Medium-High |

## Jobs to be done

- **J1** Daily glance — **Critical**
- **J3** Replay workout with glucose — High
- **J4** Late-hypo risk — Medium
- **J5** Sunday review — Medium (simpler form)
- Others — Low

## Representative quotes

> "I went for a 90-minute walk Saturday and was 3.1 mmol/L at 2am. Why didn't anything tell me that was likely?"

> "I don't need a training plan, I just want to know if my workouts are helping or hurting my glucose."

## v0.2 implication

Riley's needs are mostly a *subset* of Sasha's — except they don't want training-plan UI cluttering the screen. v0.2 might introduce a simpler mode that hides plan/load metrics for users who don't have a Garmin Coach plan or who explicitly opt for "recreational mode."
