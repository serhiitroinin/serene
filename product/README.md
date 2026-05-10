---
name: serene Product Management System
description: Markdown-based PM system for serene — lives in the repo, evolves with the code
type: index
updated: 2026-05-10
---

# serene Product Management System

A Markdown-based product management system that lives alongside the code.
Latest commit = current reality. No external tools needed.

> **Current focus:** T1D endurance athlete (Sasha persona).
> **North star:** A T1D athlete sees how their glucose interacts with training, recovery, and the plan ahead — in one place, in seconds, beautifully.
> **Sprint:** W18–W21 2026 — ship v0.1 by 2026-05-31, public from day 1.

---

## How This System Works

Every feature idea flows through a structured evaluation before it reaches the roadmap:

```
 Idea / Request
       │
       ▼
 ┌─────────────┐    Who benefits? Who doesn't?
 │  Personas   │───────────────────────────────┐
 └─────────────┘                                │
       │                                        │
       ▼                                        ▼
 ┌─────────────┐    What can/can't we do?   ┌────────────┐
 │ Constraints │──────────────────────────▶│ Evaluation │
 └─────────────┘                            │ (RICE +    │
       │                                    │  Persona   │
       ▼                                    │  Matrix)   │
 ┌─────────────┐    Is this worth the       └────────────┘
 │    JTBD     │    appetite?                    │
 └─────────────┘                                 │
       │                                         ▼
       ▼                                   ┌────────────┐
 ┌─────────────┐                           │  Backlog   │
 │   Pitch     │◀──────────────────────────│  (ranked)  │
 │ (Shape Up)  │                           └────────────┘
 └─────────────┘                                 │
       │                                         ▼
       ▼                                   ┌────────────┐
 ┌─────────────┐                           │  Roadmap   │
 │  Decision   │──────────────────────────▶│ Now/Next/  │
 │  Record     │                           │   Later    │
 └─────────────┘                           └────────────┘
```

### Quick Start

1. **Got user feedback?** → `/pm-feedback` — captures, maps to personas/JTBD, updates insights
2. **New feature idea?** → `/pm-evaluate <idea>` — full evaluation with RICE score
3. **Ready to build?** → `/pm-accept F<N>` — creates GitHub Issues, updates roadmap
4. **Time to implement?** → `/feature` / `/fix` (see `CLAUDE.md` for serene's dev workflow)
5. **Non-obvious choice?** → `/pm-decide <topic>` — creates a decision record (ADR)
6. **Monthly check-in?** → `/pm-review` — OKR scoring, backlog health, roadmap audit

---

## Folder Structure

```
product/
├── README.md                          ← You are here
├── strategy/
│   ├── vision.md                      # North star, mission, principles
│   ├── positioning.md                 # Market positioning + value prop
│   └── okrs.md                        # Current sprint/quarter OKRs
├── research/
│   ├── personas/
│   │   ├── _template.md
│   │   ├── sasha-t1d-endurance-athlete.md     # Primary — Sasha
│   │   ├── riley-t1d-recreational-athlete.md  # Secondary — Riley
│   │   └── coach.md                            # Tertiary — Coach (deferred)
│   ├── competitors/
│   │   └── landscape.md
│   ├── feedback/
│   │   ├── insights.md
│   │   └── sessions/
│   ├── jobs-to-be-done.md             # Core user jobs
│   ├── t1d-endurance-domain-research.md
│   └── garmin-training-plan-api.md
├── features/
│   ├── _template.md
│   └── backlog.md                     # Prioritized feature backlog (RICE)
├── decisions/
│   ├── _template.md
│   └── 0001-*.md
├── constraints.md                     # Technical + business constraints
└── roadmap.md                         # Now / Next / Later
```

---

## Frameworks

| Framework | Where | Purpose |
|-----------|-------|---------|
| **RICE Scoring** | `features/_template.md` | Quantified prioritization |
| **Shape Up Pitch** | `features/<name>/pitch.md` | Problem/appetite/solution framing |
| **Jobs to Be Done** | `research/jobs-to-be-done.md` | Understanding user motivations |
| **User Personas** | `research/personas/*.md` | Evaluating against user archetypes |
| **MADR** | `decisions/_template.md` | Lightweight decision records |
| **Now/Next/Later** | `roadmap.md` | Roadmap without false precision |

---

## Conventions

- Templates are prefixed with `_` (e.g., `_template.md`) — never edit; copy them.
- Decisions are numbered: `0001-`, `0002-`, etc.
- Features get their own folder for non-trivial ones: `features/<feature-slug>/pitch.md`.
- Dates use ISO format: `YYYY-MM-DD`.
- Status values: `Draft`, `Proposed`, `Accepted`, `In Progress`, `Shipped`, `Rejected`, `Deprecated`.
- YAML frontmatter on every document.

---

## Relationship to Other Docs

| Need | Where to look |
|------|--------------|
| *What* to build and *why* | `/product/` |
| *How* to build it | `/docs/` and `/ARCHITECTURE.md` |
| *What happened* | `git log` and `/product/decisions/` |
| *How we work* | `/CLAUDE.md` |
