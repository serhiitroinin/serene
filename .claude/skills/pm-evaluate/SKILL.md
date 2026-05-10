---
name: pm-evaluate
description: |
  Evaluate a feature idea through the product management system. Use this skill when
  the user has a feature idea and wants to assess it against personas, JTBD, constraints,
  and RICE scoring. Triggers on: "evaluate [feature]", "score [feature]", "RICE [feature]",
  "should we build [feature]", "assess [feature]", "analyze [feature idea]", or any request
  to evaluate a product feature. Reads the product system docs, verifies the feature isn't
  already implemented, produces a full evaluation, and adds it to the backlog.
metadata:
  version: "1.0"
  argument-hint: "<feature idea or description>"
---

# Feature Evaluation Workflow

Evaluate a feature idea through the full product management pipeline.
Produces a scored evaluation and adds to the prioritized backlog.

## Full Cycle

```
1. UNDERSTAND   → Parse the feature idea, clarify scope
2. VERIFY       → Check if already implemented in codebase
3. READ CONTEXT → Load personas, JTBD, constraints
4. EVALUATE     → Fill the evaluation template
5. SCORE        → Calculate RICE score
6. BACKLOG      → Add to backlog in rank order
7. RECOMMEND    → Accept, defer, or needs-more-info
```

## Step 1: UNDERSTAND

Parse the user's feature idea. Identify:

- What the feature does (functional description)
- Who it's for (which persona)
- What problem it solves

If the idea is too vague to evaluate, ask one focused clarifying question before proceeding.
Generate a kebab-case slug for the feature: `<feature-slug>`.

## Step 2: VERIFY

**Critical step — prevents proposing features that already exist.**

Search the codebase for evidence of implementation:

- Grep for related keywords in `apps/web/src/`
- Check Convex schema for related tables/fields
- Look for related components, hooks, or pages

If the feature is **already implemented**, report this with file paths and stop.
If **partially implemented**, note what exists and scope the evaluation to the remaining gap.

## Step 3: READ CONTEXT

Read the product system docs (do NOT skip any):

```
product/strategy/vision.md           → Decision filter, current focus
product/research/personas/sasha-t1d-endurance-athlete.md  → PRIMARY persona (Sasha)
product/research/jobs-to-be-done.md  → Core user jobs (see jobs-to-be-done.md)
product/constraints.md               → Technical and business constraints
product/strategy/okrs.md             → Current quarter objectives
product/features/backlog.md          → Existing backlog (check for duplicates)
```

Check for duplicates in the backlog. If a similar feature exists, recommend updating it instead.

## Step 4: EVALUATE

Create the evaluation file:

```bash
mkdir -p product/features/<feature-slug>
```

Write `product/features/<feature-slug>/pitch.md` using the template at `product/features/_template.md`.

Fill in ALL sections:

### Section 1: Problem

- State the problem with evidence
- Include user quotes if available

### Section 2: Persona Impact Matrix

- Evaluate against Sasha (PRIMARY) — this is the gating check
- Note Riley and Coach impact (DEFERRED personas) for context only
- **If Sasha doesn't care, the feature needs exceptional justification**

### Section 3: JTBD Alignment

- Check boxes for which jobs (see jobs-to-be-done.md) this serves
- If it doesn't serve J1, J2, or J3, flag this

### Section 4: Constraints Check

- List each relevant constraint from `product/constraints.md`
- Note: Blocks / Limits / No impact
- If anything blocks, propose a mitigation

### Section 5: RICE Score

Calculate using these definitions:

- **Reach**: Users affected per quarter. Assume ~200 active users. Be specific.
- **Impact**: 0.25 (Minimal), 0.5 (Low), 1 (Medium), 2 (High), 3 (Massive)
- **Confidence**: 0-100%. Deduct for: no user evidence (-20%), technical unknowns (-15%), only serves deferred personas (-20%)
- **Effort**: Person-weeks. Include: implementation + testing + documentation. Be honest.
- **Formula**: (Reach × Impact × Confidence%) / Effort

### Section 6: Shape Up Pitch

- Set appetite (Small: 1-2 days, Medium: 1 week, Large: 2-3 weeks, Epic: 4-6 weeks)
- Solution sketch in broad strokes
- List rabbit holes (where we might get stuck)
- List no-gos (explicitly out of scope)

Leave sections 7 (Decision) and 8 (Outcome) empty — those are filled later.

## Step 5: SCORE

Present the RICE score with interpretation:

| Score   | Interpretation                                    |
| ------- | ------------------------------------------------- |
| > 500   | Strong yes — prioritize immediately               |
| 200-500 | Good candidate — schedule for next cycle          |
| 50-200  | Maybe — needs stronger evidence or lower effort   |
| < 50    | Probably not now — revisit when conditions change |

## Step 6: BACKLOG

Update `product/features/backlog.md`:

1. Add the feature to the Active Backlog table in the correct rank position (sorted by RICE)
2. Add a corresponding Feature Details section with the RICE breakdown
3. Link to the full evaluation: `product/features/<feature-slug>/pitch.md`

## Step 7: RECOMMEND

Based on the evaluation, recommend one of:

- **Accept** (RICE > 200, serves Sasha, no blocking constraints) → suggest running `/pm-accept` next
- **Defer** (good idea, wrong time — state revisit conditions)
- **Reject** (doesn't serve Sasha, low RICE, blocking constraints)
- **Needs more info** (can't score confidently — state what's missing)

Print a summary:

```
Feature: <name>
RICE: <score> → <interpretation>
Persona: <Sasha impact>
Jobs: <J1-J6 alignment>
Recommendation: <Accept/Defer/Reject/Needs more info>
Evaluation: product/features/<feature-slug>/pitch.md
```

## Rules

- **Always verify against codebase first.** Never propose a feature that's already built.
- **Sasha is the gating check.** If the primary persona doesn't benefit, flag it prominently.
- **Be honest with RICE scores.** Don't inflate to make features look good. Uncertainty = lower confidence.
- **Check for duplicates.** Read the existing backlog before adding.
- **One feature per evaluation.** If the idea is really multiple features, split and evaluate separately.
- **Link to evidence.** If the user provides user quotes, support tickets, or analytics, reference them.
