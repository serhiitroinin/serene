---
name: Feature Backlog
description: Prioritized feature backlog with RICE scores
type: backlog
updated: 2026-05-10
status: Active
---

# Feature Backlog

> Sorted by priority (Now-then-Next-then-Later, then by RICE within each band).
> Features in **Now** are committed for v0.1.
> Features in **Next/Later** carry RICE scores so re-prioritization is data-driven.

---

## Now (v0.1)

See [roadmap](../roadmap.md) — F1–F20 are committed for the launch sprint and tracked as GitHub issues.

| #   | Feature                                              | Status   | Issue | Epic |
| --- | ---------------------------------------------------- | -------- | ----- | ---- |
| F1  | LibreLinkUp source (luff port — validate + errors)   | Accepted | #11   | #10  |
| F2  | WHOOP OAuth + sync                                   | Shipped  | —     | #10  |
| F3  | Garmin SSO web-widget auth (luff port)               | Accepted | #12   | #10  |
| F4  | Garmin activities + track-points sync                | Accepted | #13   | #10  |
| F5  | Garmin scheduled workouts via GraphQL                | Accepted | #14   | #10  |
| F6  | Encryption at rest (verify + document)               | Accepted | #15   | #10  |
| F7  | Setup wizard end-to-end                              | Accepted | #25   | #24  |
| F8  | Docker compose + README + ENV docs                   | Accepted | #26   | #24  |
| F9  | Today card                                           | Accepted | #17   | #16  |
| F10 | Tomorrow card with planned workout                   | Accepted | #18   | #16  |
| F11 | AGP-style 14-day percentile chart                    | Accepted | #19   | #16  |
| F12 | Glucose × workout overlay                            | Accepted | #20   | #16  |
| F13 | Activity map with glucose-on-route coloring          | Accepted | #21   | #16  |
| F14 | Weekly review (TSS + CTL/ATL/TSB + TIR)              | Accepted | #22   | #16  |
| F15 | Late-hypo descriptive risk badge                     | Accepted | #23   | #16  |
| F16 | Last-sync timestamps on every page                   | Accepted | #28   | #27  |
| F17 | Per-activity share token                             | Accepted | #29   | #27  |
| F18 | Anti-scope footer + disclaimer                       | Accepted | #30   | #27  |
| F19 | Public README + ARCHITECTURE.md + screenshots + Loom | Accepted | #31   | #27  |
| F20 | Launch posts                                         | Accepted | #32   | #27  |

**Epics:**

- #10 — sources epic (Libre + WHOOP + Garmin)
- #16 — signature surfaces (Today, Tomorrow, AGP, overlay, map, weekly, late-hypo)
- #24 — setup epic (wizard + Docker compose)
- #27 — trust + launch (sync timestamps, share-link, disclaimers, README, Loom, posts)

---

## Next (v0.2)

| #   | Feature                                | RICE breakdown           | RICE | Notes                                             |
| --- | -------------------------------------- | ------------------------ | ---- | ------------------------------------------------- |
| F21 | Multi-tenant + Better Auth             | R 100, I 2, C 70%, E 5d  | 28   | Required to grow audience past hand-curated betas |
| F22 | Apple Health source                    | R 50, I 1.5, C 60%, E 3d | 15   | Many T1D users use Apple Health as aggregator     |
| F23 | Dexcom source                          | R 80, I 2, C 60%, E 3d   | 32   | The other major CGM; doubles addressable users    |
| F24 | Manual treatment logging (annotations) | R 60, I 1, C 70%, E 2d   | 21   | Annotation only — no IOB/COB; J6                  |
| F25 | Glucose-at-zone heatmap                | R 80, I 2, C 70%, E 2d   | 56   | High-signal cross-source insight                  |
| F26 | Fueling-effectiveness curve            | R 80, I 1.5, C 60%, E 2d | 36   | Differentiating insight                           |
| F27 | Coach share-link polish                | R 40, I 1, C 70%, E 1d   | 28   | Tertiary persona; small effort if F17 ships clean |
| F28 | Garmin calendar grid view              | R 80, I 1, C 80%, E 2d   | 32   | Familiar UX for Garmin users                      |
| F29 | Recovery-adjusted glycemic-variability | R 60, I 1.5, C 60%, E 1d | 54   | High-signal, low-effort                           |
| F30 | Light-theme parity polish              | R 80, I 1, C 80%, E 2d   | 32   | Half of users ship light; v0.1 is dark-first      |

---

## Later (v0.3+)

| #                              | Feature | RICE                                             | Why later |
| ------------------------------ | ------- | ------------------------------------------------ | --------- |
| Sleep × glucose × HRV overlay  | TBD     | After core stable                                |
| Coach multi-athlete dashboard  | TBD     | Tertiary persona; share-link is sufficient first |
| MCP server                     | TBD     | Premature for v0.1 audience                      |
| Race-day rehearsal replay      | TBD     | Niche but loved                                  |
| Menstrual-cycle phase response | TBD     | Sensitive opt-in; needs more research            |
| Strava sync                    | TBD     | Garmin already covers most data                  |
| Hosted SaaS tier               | TBD     | Validate self-host audience first                |
| iOS native                     | TBD     | Mobile-responsive web is enough                  |
| Plugin marketplace             | —       | Probably never (anti-scope)                      |

---

## RICE scale reference

| Score                    | Interpretation |
| ------------------------ | -------------- |
| > 100 (pre-launch scale) | Strong yes     |
| 30–100                   | Good candidate |
| 10–30                    | Maybe          |
| < 10                     | Not now        |

> _RICE absolute numbers are smaller than typical (Reach is constrained by tiny pre-launch user base). Use ordering, not magnitudes._

---

## How items move

```
Idea → Proposed → Accepted → In Progress → Shipped
                            ↓
                         Deferred (if blocked)
```

- **Proposed:** Lives here with RICE score.
- **Accepted:** Has GitHub issue + assigned to a milestone (v0.1, v0.2). Move to roadmap "Now."
- **In Progress:** PR open.
- **Shipped:** Merged + visible in `git log`. Update outcome section in `pitch.md`.
- **Deferred:** Score it again later or kill it.
