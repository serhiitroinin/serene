---
name: "Persona: Coach (Endurance Coach with T1D Athletes)"
description: "TERTIARY persona — endurance coach who has 1–3 T1D athletes on roster and wants to see glucose × workout to give better feedback."
type: persona
updated: 2026-05-10
status: Deferred
priority: TERTIARY
---

# Persona: Coach (Endurance Coach with T1D Athletes)

> **Tertiary persona.** v0.2+ — relevant only after Sasha's experience is excellent and the share-link primitive (J7) is shipped.

> "When my T1D athlete tells me they bonked, I want to know if it was glucose or pacing — without asking them to write a paragraph."

---

## Demographics

| Attribute                  | Value                                                          |
| -------------------------- | -------------------------------------------------------------- |
| **Role**                   | Endurance coach (running / cycling / triathlon)                |
| **Athletes on roster**     | 5–30                                                           |
| **T1D athletes on roster** | 1–3                                                            |
| **Tools**                  | TrainingPeaks (default), Final Surge, sometimes Strava Premium |
| **Technical proficiency**  | Medium — comfortable with web tools, not self-hosting          |

## Context

Coach already has a workflow built around TrainingPeaks: athletes upload activities, coach reviews, posts comments, drafts next week's plan. T1D athletes are an exception — coach has no view into glucose, so feedback is pace/HR/perceived-effort only. This means a third of the post-session conversation with T1D athletes is "what was your glucose doing at minute 70?" by Slack/text.

## Goals

1. **Primary:** Understand why a T1D athlete's session went sideways without a multi-message Q&A.
2. **Secondary:** Adapt training plan when glucose patterns suggest the athlete is over-reaching despite normal recovery.

## Frustrations

1. **No glucose visibility in TrainingPeaks.**
2. **Athletes share screenshots that lose context.** Glucose chart, then HR chart separately, no overlay.
3. **Time cost.** Reviewing a T1D athlete takes 2–3× longer than a non-T1D one.

## Feature sensitivity

| Capability                                                       | Priority                                |
| ---------------------------------------------------------------- | --------------------------------------- |
| Receive a share link from athlete with workout × glucose overlay | **Critical**                            |
| Comment back inside serene                                       | Medium (TrainingPeaks already has this) |
| Coach-side dashboard with multiple athletes                      | Low (v0.3+)                             |
| Self-host their own coach instance                               | Low                                     |

## Jobs to be done

- **J7** Receive share link — **Critical**
- **J3** (read-only side) Replay workout with glucose — **Critical**
- **J5** (read-only side) Athlete weekly review — **Critical**

## Representative quotes

> "Just send me the link, I'll look. I don't need access to all your data, just this session."

> "I have one T1D athlete and I always feel I'm coaching with one eye closed."

## v0.2 implication

Coach is served first by the share-link primitive (J7) on a per-activity basis. A multi-athlete coach dashboard is v0.3+. The first interaction with serene from Coach's side will be **a public read-only URL** they open from a Slack message — they may never even create an account.
