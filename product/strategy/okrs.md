---
name: OKRs — Sprint W18–W21 2026 (v0.1 ship)
description: Quarterly objectives for serene's launch sprint
type: strategy
updated: 2026-05-10
status: Active
---

# OKRs — W18–W21 2026 (Launch Sprint)

> **Theme:** "Ship v0.1 — designer-grade, self-hostable, real-data-from-day-one."
> **Window:** 2026-05-05 → 2026-05-31

---

## O1 — Ship a working v0.1 by 2026-05-31

A real T1D athlete (Sasha) can self-host serene and see glucose + recovery + activities + planned workouts within 30 minutes of `git clone`.

| KR                                                                                             | Target | Current                                                  |
| ---------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------- |
| **KR1.1** Setup wizard ships and completes for one of (LibreLinkUp, WHOOP, Garmin) in <= 5 min | Yes    | Partial — wizard exists, Libre auth blocked (see issues) |
| **KR1.2** Three core sources (Libre, WHOOP, Garmin) sync data to SQLite on schedule            | Yes    | Libre auth blocked, WHOOP OAuth done, Garmin stubbed     |
| **KR1.3** Docker compose `up` from scratch boots a working app                                 | Yes    | Not started                                              |
| **KR1.4** Public README + Loom + screenshots ready by 2026-05-29                               | Yes    | Not started                                              |

## O2 — Cross-source insights are the visible differentiator

A first-time visitor sees within 30 seconds that this isn't another single-source viewer.

| KR                                                                                                  | Target  | Current                                    |
| --------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------ |
| **KR2.1** Glucose × workout overlay chart on activity detail                                        | Shipped | UI scaffold exists; needs real data        |
| **KR2.2** AGP-style 14-day percentile chart on glucose page                                         | Shipped | Not started                                |
| **KR2.3** Today view shows: latest glucose, today's workout, recovery, **upcoming planned workout** | Shipped | Today view exists; planned workout missing |
| **KR2.4** Weekly view: time-in-range correlated with training load                                  | Shipped | Not started                                |

## O3 — Launch reaches the audience

The right people see it; the right people share it.

| KR                                                                           | Target  | Current |
| ---------------------------------------------------------------------------- | ------- | ------- |
| **KR3.1** GitHub stars ≥ 100 in 30d post-launch                              | 100     | 0       |
| **KR3.2** r/T1D + r/Type1Diabetes + r/diabetes_t1 launch posts on 2026-05-31 | 3 posts | 0       |
| **KR3.3** Loom walkthrough ≥ 200 views in 7d                                 | 200     | 0       |
| **KR3.4** First 5 non-author self-hosters with real CGM data                 | 5       | 0       |

## O4 — Foundations don't paint us into a corner

Single-tenant runtime today, but every schema and abstraction supports v0.2 multi-tenant + plugins later.

| KR                                                                                                  | Target | Current        |
| --------------------------------------------------------------------------------------------------- | ------ | -------------- |
| **KR4.1** Every domain table carries `user_id`                                                      | Yes    | Yes (verified) |
| **KR4.2** Source registry pattern — adding a new source is one new file under `src/server/sources/` | Yes    | Yes            |
| **KR4.3** Credentials encrypted at rest (AES-256-GCM)                                               | Yes    | Yes            |
| **KR4.4** Zero PII in logs / error messages                                                         | Yes    | Audit pending  |

---

## Out of scope this sprint (locked)

- Multi-tenant + Better Auth (v0.2)
- Apple Health, Dexcom integrations (v0.2)
- Manual treatment logging, IOB/COB (anti-scope, never)
- Mobile-native app (post-1.0)
- Clinician export / EU-MDR cert (out of scope)
- Plugin marketplace (premature)
