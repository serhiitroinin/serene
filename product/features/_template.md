---
name: "Feature: [Feature Name]"
description: "[One-line summary of what this feature does]"
type: feature
updated: YYYY-MM-DD
status: Draft
author: ""
---

# Feature: [Feature Name]

## 1. Problem

_What is the raw user problem or request? Include evidence: support tickets, user quotes, competitor screenshots, analytics._

### Evidence

- [ ] User request / support ticket: _link or quote_
- [ ] Analytics signal: _what data suggests this matters?_
- [ ] Competitive pressure: _do competitors have this?_
- [ ] Strategic alignment: _which OKR does this support?_

---

## 2. Persona Impact Matrix

> Reference: [Personas](../research/personas/)

| Persona                                   | Cares?          | Impact          | How it helps them | Would they pay for it? |
| ----------------------------------------- | --------------- | --------------- | ----------------- | ---------------------- |
| **Anya** (Solo Creator) — PRIMARY         | Yes/No/Somewhat | High/Medium/Low |                   | Yes/No/Included        |
| **Marcus** (Corporate Trainer) — DEFERRED | Yes/No/Somewhat | High/Medium/Low |                   | Yes/No/Included        |
| **Priya** (Agency Producer) — DEFERRED    | Yes/No/Somewhat | High/Medium/Low |                   | Yes/No/Included        |

**Persona verdict:** _Does this serve Anya? If not, it doesn't ship this quarter unless there's exceptional strategic justification. Features that only serve Marcus or Priya are deferred._

---

## 3. Jobs to Be Done Alignment

> Reference: [JTBD](../research/jobs-to-be-done.md)

Which jobs does this feature help complete?

- [ ] **J1:** Record a lecture
- [ ] **J2:** Edit out mistakes quickly
- [ ] **J3:** Sell a course
- [ ] **J4:** Look professional
- [ ] **J5:** Maintain brand consistency
- [ ] **J6:** Understand how content performs

**Job alignment verdict:** _Does this serve a critical job or a nice-to-have?_

---

## 4. Constraints Check

> Reference: [Constraints](../constraints.md)

| Constraint                     | Impact                   | Mitigation                        |
| ------------------------------ | ------------------------ | --------------------------------- |
| _e.g., Browser API limitation_ | _Blocks / Limits / None_ | _e.g., polyfill, fallback, defer_ |
|                                |                          |                                   |

**Constraints verdict:** _Is this feasible within our current technical and business constraints?_

---

## 5. RICE Score

| Factor         | Value                    | Reasoning                                              |
| -------------- | ------------------------ | ------------------------------------------------------ |
| **Reach**      | _users/quarter_          | _How many users will this affect in the next quarter?_ |
| **Impact**     | _0.25 / 0.5 / 1 / 2 / 3_ | _Minimal / Low / Medium / High / Massive_              |
| **Confidence** | _0-100%_                 | _How sure are we about reach and impact estimates?_    |
| **Effort**     | _person-weeks_           | _How many person-weeks to ship a minimum version?_     |

**RICE = (Reach x Impact x Confidence) / Effort = \_\_\_\_**

### RICE Scale Reference

| Score   | Interpretation                                    |
| ------- | ------------------------------------------------- |
| > 500   | Strong yes — prioritize immediately               |
| 200-500 | Good candidate — schedule for next cycle          |
| 50-200  | Maybe — needs stronger evidence or lower effort   |
| < 50    | Probably not now — revisit when conditions change |

---

## 6. Shape Up Pitch

### Appetite

_How much time are we willing to spend on this? This is a "circuit breaker" — if it takes longer than this, we stop and re-evaluate._

- [ ] **Small batch:** 1-2 days
- [ ] **Medium batch:** 1 week
- [ ] **Large batch:** 2-3 weeks
- [ ] **Epic:** 4-6 weeks (requires decomposition into smaller batches)

### Solution Sketch

_Describe the solution at a high level. "Fat marker sketch" — broad strokes, not pixel-perfect. Include rough wireframes as ASCII art if helpful._

### Rabbit Holes

_What complexities should we call out? Where might we get stuck?_

1.
2.

### No-Gos

_What is explicitly out of scope for this iteration?_

1.
2.

---

## 7. Decision

_Fill this in when committing to build (or deciding not to)._

**Decision:** Accepted / Rejected / Deferred

**Rationale:**

**Decision record:** [Link to decisions/NNNN-*.md if created]

**Assigned to:**

**Target release:**

---

## 8. Outcome (Post-Ship)

_Fill this in after the feature ships._

**Shipped date:**

**Actual effort:**

**Metrics observed:**

| Metric | Expected | Actual |
| ------ | -------- | ------ |
|        |          |        |

**Retrospective notes:** _What did we learn? Was the RICE score accurate? Would we do it differently?_
