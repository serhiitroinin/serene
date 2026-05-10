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

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| F1 | LibreLinkUp source (luff port) | In progress | (existing PRs) |
| F2 | WHOOP OAuth + sync | Shipped | — |
| F3 | Garmin SSO web-widget auth (luff port) | Proposed | TBD |
| F4 | Garmin activities + track-points sync | Proposed | TBD |
| F5 | Garmin scheduled workouts via GraphQL | Proposed | TBD |
| F6 | Encryption at rest | Shipped | — |
| F7 | Setup wizard end-to-end | Proposed | TBD |
| F8 | Docker compose + README + ENV docs | Proposed | TBD |
| F9 | Today card | Proposed | TBD |
| F10 | Tomorrow card with planned workout | Proposed | TBD |
| F11 | AGP-style 14-day percentile chart | Proposed | TBD |
| F12 | Glucose × workout overlay | Proposed | TBD |
| F13 | Activity map with glucose-on-route coloring | Proposed | TBD |
| F14 | Weekly review (TSS + CTL/ATL/TSB + TIR) | Proposed | TBD |
| F15 | Late-hypo descriptive risk badge | Proposed | TBD |
| F16 | Last-sync timestamps on every page | Proposed | TBD |
| F17 | Per-activity share token | Proposed | TBD |
| F18 | Anti-scope footer + disclaimer | Proposed | TBD |
| F19 | Public README + ARCHITECTURE.md + screenshots + Loom | Proposed | TBD |
| F20 | Launch posts | Proposed | TBD |

---

## Next (v0.2)

| # | Feature | RICE breakdown | RICE | Notes |
|---|---------|----------------|------|-------|
| F21 | Multi-tenant + Better Auth | R 100, I 2, C 70%, E 5d | 28 | Required to grow audience past hand-curated betas |
| F22 | Apple Health source | R 50, I 1.5, C 60%, E 3d | 15 | Many T1D users use Apple Health as aggregator |
| F23 | Dexcom source | R 80, I 2, C 60%, E 3d | 32 | The other major CGM; doubles addressable users |
| F24 | Manual treatment logging (annotations) | R 60, I 1, C 70%, E 2d | 21 | Annotation only — no IOB/COB; J6 |
| F25 | Glucose-at-zone heatmap | R 80, I 2, C 70%, E 2d | 56 | High-signal cross-source insight |
| F26 | Fueling-effectiveness curve | R 80, I 1.5, C 60%, E 2d | 36 | Differentiating insight |
| F27 | Coach share-link polish | R 40, I 1, C 70%, E 1d | 28 | Tertiary persona; small effort if F17 ships clean |
| F28 | Garmin calendar grid view | R 80, I 1, C 80%, E 2d | 32 | Familiar UX for Garmin users |
| F29 | Recovery-adjusted glycemic-variability | R 60, I 1.5, C 60%, E 1d | 54 | High-signal, low-effort |
| F30 | Light-theme parity polish | R 80, I 1, C 80%, E 2d | 32 | Half of users ship light; v0.1 is dark-first |

---

## Later (v0.3+)

| # | Feature | RICE | Why later |
|---|---------|------|-----------|
| Sleep × glucose × HRV overlay | TBD | After core stable |
| Coach multi-athlete dashboard | TBD | Tertiary persona; share-link is sufficient first |
| MCP server | TBD | Premature for v0.1 audience |
| Race-day rehearsal replay | TBD | Niche but loved |
| Menstrual-cycle phase response | TBD | Sensitive opt-in; needs more research |
| Strava sync | TBD | Garmin already covers most data |
| Hosted SaaS tier | TBD | Validate self-host audience first |
| iOS native | TBD | Mobile-responsive web is enough |
| Plugin marketplace | — | Probably never (anti-scope) |

---

## RICE scale reference

| Score | Interpretation |
|-------|---------------|
| > 100 (pre-launch scale) | Strong yes |
| 30–100 | Good candidate |
| 10–30 | Maybe |
| < 10 | Not now |

> *RICE absolute numbers are smaller than typical (Reach is constrained by tiny pre-launch user base). Use ordering, not magnitudes.*

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
