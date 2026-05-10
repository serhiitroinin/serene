---
name: serene Roadmap
description: Now / Next / Later for serene
type: roadmap
updated: 2026-05-10
status: Active
---

# serene Roadmap

> **Focus:** T1D endurance athlete (Sasha persona).
> **North star:** A T1D endurance athlete sees how their glucose interacts with training, recovery, and the plan ahead — in one place, in seconds, beautifully.
> **Format:** Now / Next / Later — avoids false precision of date-based roadmaps.
> **Last verified against codebase:** 2026-05-10

---

## Now (v0.1 — W18–W21 2026, ship by 2026-05-31)

_Theme: **"Make the join real."** Three sources, the four signature surfaces, public launch._

### Foundations (must ship for v0.1 to function)

| #   | Initiative                                         | Appetite | Jobs       | Status                     |
| --- | -------------------------------------------------- | -------- | ---------- | -------------------------- |
| F1  | LibreLinkUp source ported from luff (auth + sync)  | 2d       | J1, J3     | In progress (PR #8 merged) |
| F2  | WHOOP OAuth + sync                                 | 2d       | J1, J5     | Done                       |
| F3  | Garmin auth ported from luff (SSO web-widget flow) | 2d       | J2, J3     | Stubbed                    |
| F4  | Garmin activities + track-points sync              | 2d       | J3         | Stubbed                    |
| F5  | Garmin scheduled workouts via GraphQL              | 0.5d     | J2         | Not started                |
| F6  | Encryption-at-rest for credentials                 | 0.5d     | R2         | Done                       |
| F7  | Setup wizard (3 sources, end-to-end)               | 2d       | onboarding | Partial                    |
| F8  | Docker compose + README + ENV docs                 | 1d       | install    | Not started                |

### Signature surfaces (the differentiator)

| #   | Initiative                                                                | Appetite | Jobs | Status                       |
| --- | ------------------------------------------------------------------------- | -------- | ---- | ---------------------------- |
| F9  | Today card: latest glucose, today's workout, recovery, overnight TIR      | 1d       | J1   | Partial                      |
| F10 | Tomorrow card: upcoming planned workout + 7d overnight glucose mini-trace | 1d       | J2   | Not started                  |
| F11 | AGP-style 14-day percentile chart                                         | 1.5d     | J5   | Not started                  |
| F12 | Glucose × workout overlay (HR / pace / glucose synced lines)              | 2d       | J3   | UI scaffold; needs real data |
| F13 | Activity map with glucose-on-route coloring                               | 1d       | J3   | UI scaffold                  |
| F14 | Weekly review: TSS strip + CTL/ATL/TSB + weekly TIR                       | 1.5d     | J5   | Not started                  |
| F15 | Late-hypo descriptive risk badge (post-session)                           | 1.5d     | J4   | Not started                  |

### Trust + launch

| #   | Initiative                                           | Appetite | Jobs   | Status                                |
| --- | ---------------------------------------------------- | -------- | ------ | ------------------------------------- |
| F16 | Last-sync timestamps on every page                   | 0.5d     | J8     | Partial                               |
| F17 | Per-activity share token (signed, expiring)          | 1d       | J7     | Disabled placeholder; needs real impl |
| F18 | Anti-scope footer + medical-device disclaimer        | 0.25d    | R1     | Not started                           |
| F19 | Public README, ARCHITECTURE.md, screenshots, Loom    | 1.5d     | launch | Not started                           |
| F20 | r/T1D + r/Type1Diabetes + r/diabetes_t1 launch posts | 0.25d    | launch | Not started                           |

**Total appetite (Now):** ~22 days (assuming solo dev, full sprint)
**Buffer:** Significant — overruns will defer F11 / F14 to v0.2.

**Anti-goals for v0.1:** No alarms. No IOB/COB. No predictions. No clinician export. No mobile native. No multi-tenant.

---

## Next (v0.2 — Q3 2026)

_Theme: **"Multi-user + insights depth."** From single-user-self-host to small communities + deeper cross-source insights._

| #   | Initiative                                          | Appetite | Jobs                 | Why next                                                 |
| --- | --------------------------------------------------- | -------- | -------------------- | -------------------------------------------------------- |
| F21 | Multi-tenant + Better Auth + GitHub OAuth           | 1w       | scaling              | Schema is multi-tenant-ready; runtime is not             |
| F22 | Apple Health source (HealthKit export ingest)       | 3d       | broader CGM coverage | Many T1D athletes use Apple Health as an aggregator      |
| F23 | Dexcom source                                       | 3d       | broader CGM coverage | Dexcom G7 is the other major CGM                         |
| F24 | Manual treatment logging (annotations only, no IOB) | 2d       | J6                   | Athlete-side annotation for "what worked" — no dose math |
| F25 | Glucose-at-zone heatmap                             | 2d       | J3, J5               | Cross-source insight #2 from research                    |
| F26 | Fueling-effectiveness curve                         | 2d       | J3                   | Cross-source insight #3                                  |
| F27 | Coach-side share-link experience polish             | 1d       | J7                   | Optimized read-only view for coach                       |
| F28 | Garmin calendar grid view                           | 2d       | J2                   | Beyond the simple "tomorrow" card                        |
| F29 | Recovery-adjusted glycemic-variability stats        | 1d       | J5                   | Cross-source insight #5                                  |
| F30 | Light-theme parity polish                           | 2d       | UX                   | v0.1 ships dark-first                                    |

---

## Later (v0.3+ / candidates)

| #                                                                   | Initiative                                  | Why later                    | Revisit when |
| ------------------------------------------------------------------- | ------------------------------------------- | ---------------------------- | ------------ |
| Coach multi-athlete dashboard                                       | Tertiary persona; v0.1 share-link is enough | First real coach asks        |
| MCP server (talk to your data via Claude / Cursor)                  | Premature for v0.1 audience                 | After 1.0                    |
| Sleep × glucose triple overlay (WHOOP sleep stages + glucose + HRV) | Cross-source insight #9                     | After core stable            |
| Hosted SaaS tier                                                    | Validate self-host audience first           | Post-launch demand           |
| Garmin Coach plan progression view                                  | Garmin Coach API depth                      | After F5 ships               |
| Race-day rehearsal replay                                           | Niche but loved                             | After F12 + F13 land         |
| Menstrual-cycle-phase glucose response                              | Sensitive opt-in feature                    | After feedback               |
| Strava sync                                                         | Most data is in Garmin already              | If Strava-only users surface |
| Plugin marketplace                                                  | Premature abstraction                       | Probably never               |
| iOS native app                                                      | Mobile-responsive web is enough for v1.x    | After 2.0                    |

---

## Roadmap principles

1. **Sasha first.** Every Now item maps directly to one of J1–J8.
2. **Cross-source over single-source.** A single-source feature must be table stakes; the differentiation is in the join.
3. **Anti-scope is sacred.** No regulated-medical-device features ever.
4. **Appetite over estimates.** Hard time budgets, not predictions.
5. **Public + verifiable.** Every initiative ships in a PR with a Loom or screenshot.
