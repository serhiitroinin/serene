---
name: Constraints Registry
description: Technical, business, regulatory, and operational constraints that affect serene feature decisions
type: constraints
updated: 2026-05-10
status: Active
---

# Constraints Registry

> Check this document when evaluating any new feature.
> These are the guardrails for what's feasible and what's safe.

---

## Regulatory Constraints (most important — read first)

### R1: serene is NOT a medical device

| Constraint                                            | Impact                                                          | Details                                                                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **No insulin dose calculations or recommendations**   | **Blocks any feature that suggests doses or basal changes.**    | FDA 21 CFR regulates dosing decision software. Even a "suggested temp basal" crosses the line.                  |
| **No IOB / COB tracking**                             | **Blocks bolus-calculator-adjacent features.**                  | Both are bolus-calculator primitives → iAGC / iCGM territory.                                                   |
| **No alarms on glucose values**                       | **Blocks notification, push, phone-call features for glucose.** | Active monitoring with notifications is regulated CGM display function (Sugarmate is _authorized_; we are not). |
| **No glucose value predictions**                      | **Blocks "you'll be 4.2 in 30min" features.**                   | Predictive alerts are device-software-function regulated.                                                       |
| **No carb amount recommendations for hypo treatment** | **Blocks "eat 16g now" UI.**                                    | Treatment guidance is regulated.                                                                                |
| **No closed-loop integration**                        | **Blocks any integration that writes to a pump.**               | Tidepool Loop is FDA-cleared via multi-year process.                                                            |

**What serene MAY do:**

- Display historical and current glucose data sourced from a regulated CGM upstream (LibreLinkUp).
- Compute descriptive stats: TIR, CV, GMI, AGP percentiles.
- Show observed patterns ("your glucose fell 3.2 mmol/L during last Tuesday's Z2") without forward-looking claims.
- Display canonical guideline ranges (Riddell 2017, Moser 2020) as reference bands with citations.
- Let the user annotate decisions they made — for their own learning loop.

### R2: GDPR / health-data minimization

| Constraint                           | Impact | Details                                                                                |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------------- |
| **Encrypt credentials at rest**      | High   | AES-256-GCM. Done.                                                                     |
| **Single-tenant runtime by default** | Medium | Health data lives only in the user's own SQLite. No telemetry without explicit opt-in. |
| **No PII in logs / error messages**  | High   | Email addresses must not appear in logs.                                               |
| **Self-hostable**                    | High   | Some users will only trust serene if they own the data location.                       |

---

## Technical Constraints

### T1: Stack lock-in

| Constraint                 | Impact | Details                                                                                                 |
| -------------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| **Bun ≥ 1.3.x**            | High   | Native `bun:sqlite` is the SQLite path. Node-only deploys not supported v0.1.                           |
| **TanStack Start v1**      | High   | Server functions and routing are coupled. Migration would be major.                                     |
| **SQLite single-file**     | Medium | Excellent for single-tenant. Would need migration plan for v0.2 multi-tenant if scale demands Postgres. |
| **Drizzle SQLite dialect** | Low    | Migrating dialects is well-trodden.                                                                     |

### T2: Source API fragility

| Constraint                                 | Impact | Details                                                                                                                            |
| ------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **LibreLinkUp is reverse-engineered**      | High   | Header format, account-id hashing, version string can break with Abbott updates. Mitigation: port from luff (canonical reference). |
| **Garmin Connect is reverse-engineered**   | High   | SSO ticket flow + Garth library track. Rate limits exist; respect them.                                                            |
| **WHOOP OAuth is documented but unstable** | Medium | API v2 is in flight; pin to v1.                                                                                                    |
| **Source breakage = degraded UX**          | High   | Show "last sync" timestamp on every page so user can detect failure.                                                               |

### T3: Browser / runtime limits

| Constraint                      | Impact | Details                                                                    |
| ------------------------------- | ------ | -------------------------------------------------------------------------- |
| **In-process croner scheduler** | Medium | OK for single-tenant. v0.2 multi-tenant may need a worker process.         |
| **No background workers**       | Medium | Sync runs in the same Bun process; long-running jobs would block requests. |
| **MapLibre + Protomaps tiles**  | Low    | Self-hosted tiles for full data sovereignty optional path.                 |

---

## Business / Resource Constraints

### B1: Solo developer, 4-week sprint

| Constraint                 | Impact   | Details                                                                        |
| -------------------------- | -------- | ------------------------------------------------------------------------------ |
| **One person, one sprint** | **High** | Every feature competes for the same hours. Anti-scope is sacred.               |
| **Pre-1.0**                | Medium   | No backwards-compat shims. Rename freely.                                      |
| **Public from day 1**      | Medium   | Code is in public; reviewers will notice messy commits. PR discipline matters. |

### B2: No hosted service for v0.1

| Constraint         | Impact | Details                                                                             |
| ------------------ | ------ | ----------------------------------------------------------------------------------- |
| **Self-host only** | High   | Reduces audience but builds trust.                                                  |
| **No paid tier**   | High   | No revenue model in v0.1. Justification: portfolio + community + later hosted SaaS. |

### B3: Brand & trust

| Constraint                      | Impact | Details                                                                             |
| ------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| **Public roadmap & PRs**        | Medium | Builders evaluating us will read commits.                                           |
| **Designer-grade is a promise** | High   | Visual quality is part of the value prop; "looks like Nightscout" = launch failure. |
| **MIT license**                 | Low    | Allows commercial use; compatible with future hosted offering.                      |

---

## Operational Constraints

### O1: Deployment

| Constraint                            | Impact | Details                                                     |
| ------------------------------------- | ------ | ----------------------------------------------------------- |
| **Docker compose target**             | High   | One-line install is the launch promise.                     |
| **No external dependencies for v0.1** | High   | No required Postgres, Redis, S3 — just SQLite + the binary. |

### O2: Monitoring (post-launch)

| Constraint                  | Impact | Details                                         |
| --------------------------- | ------ | ----------------------------------------------- |
| **No telemetry by default** | Medium | Privacy first. Optional crash reporting opt-in. |

---

## Anti-scope (locked, do not implement, even if asked)

These are non-constraints — they're explicit bans:

- Alarms / notifications for glucose values
- IOB / COB / dose math / dose recommendations
- Glucose value predictions
- Treatment decision support of any kind
- Closed-loop pump integration
- Clinician portal / endo report export
- iOS native app (v1.x — mobile-responsive web is enough)
- Plugin marketplace
- EU-MDR / FDA submission
- Backwards-compatibility shims (pre-1.0)

---

## How to use this document

When evaluating a feature:

1. Scan **Regulatory Constraints first.** If a feature touches R1, it's almost certainly anti-scope.
2. Scan technical and business constraints relevant to the feature.
3. In the feature evaluation (Section 4), list each relevant constraint and note: Blocks / Limits / No impact.
4. If anything blocks, propose a mitigation or kill the feature.
