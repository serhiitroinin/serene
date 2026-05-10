---
name: pm-review
description: |
  Periodic product health check. Reviews OKR progress, backlog freshness, roadmap
  accuracy, and competitive landscape. Use this skill monthly or quarterly, or when
  the user asks: "product review", "quarterly review", "roadmap review", "backlog
  review", "check OKRs", "pm health check", "/pm-review". Produces a structured
  report with recommendations for what to change.
metadata:
  version: "1.0"
---

# Product Review Workflow

Periodic health check of the product management system.
Reviews OKRs, backlog, roadmap, and competitive landscape.

## Full Cycle

```
1. OKRs        → Score current quarter objectives
2. BACKLOG     → Check freshness, verify against codebase
3. ROADMAP     → Audit Now/Next/Later accuracy
4. COMPETITIVE → Check for market changes
5. REPORT      → Produce structured summary with recommendations
```

## Step 1: OKRs

Read `product/strategy/okrs.md`.

For each Key Result:
- Check if there's analytics data available (PostHog, Stripe, Convex queries)
- If data is available, update the "Current" column
- If data is not available, note what instrumentation is needed
- Score each KR: 0.0-1.0 based on available evidence

If it's end-of-quarter:
- Calculate final scores
- Move current OKRs to "Previous Quarters" section
- Draft next quarter's objectives based on what was learned

## Step 2: BACKLOG

Read `product/features/backlog.md`.

### Freshness Check
For each active backlog item:
- Is the RICE score still accurate? (has reach, impact, or effort changed?)
- Is the feature still relevant to the current quarter's focus?
- Should any items be moved to Deferred or removed?

### Codebase Verification
For each "Proposed" or "Accepted" item, quickly verify it's not already implemented:

```bash
# Quick check for each feature's key functionality
grep -r "<relevant keyword>" apps/web/src/ --include="*.ts" --include="*.tsx" -l
```

If found to be implemented, move to "Already Shipped" section.

### Missing Features
Scan recent git history for features that shipped but aren't tracked:

```bash
git log --oneline --since="3 months ago" | head -30
```

Note any shipped features not reflected in the backlog or roadmap.

## Step 3: ROADMAP

Read `product/roadmap.md`.

### Accuracy Audit
- **Now column:** Are these items actually being worked on? Check for open PRs/issues.
- **Next column:** Is this still the right set for next quarter? Re-rank by current RICE.
- **Later column:** Should any items move forward (new evidence) or be removed (irrelevant)?
- **Completed:** Is this up to date? Check recent merges.

### Roadmap vs OKRs
Cross-reference: does every Now item map to a current OKR? If an item is in Now but doesn't serve any OKR, flag it.

## Step 4: COMPETITIVE

Read `product/research/competitors/landscape.md`.

Quick web check for major competitor moves:
- Have any competitors launched features that affect our positioning?
- Has pricing changed in the market?
- Any new entrants in the recording-for-educators space?

Update the landscape doc if significant changes are found.

## Step 5: REPORT

Produce a structured review report:

```markdown
## Product Review — <date>

### OKR Status
| Objective | Score | Trend | Notes |
|-----------|-------|-------|-------|
| O1: ... | X.X | ↑↓→ | ... |

### Backlog Health
- Active items: X
- Stale items (need re-scoring): X
- Already implemented (removed): X
- New items suggested: X

### Roadmap Accuracy
- Now: X items, Y on track, Z stalled
- Items to move forward: ...
- Items to defer: ...

### Competitive Changes
- Notable moves: ...
- Impact on our positioning: ...

### Recommendations
1. ...
2. ...
3. ...
```

Update all product docs with changes identified during the review.

## Rules

- **Be honest with scores.** Don't inflate OKR scores. 0.3 is a valid score.
- **Remove stale items.** If a backlog item has been "Proposed" for 2+ months with no action, either re-evaluate or defer it.
- **Check the codebase.** Don't just read docs — verify against actual code.
- **Keep it concise.** The report should be actionable, not a novel.
- **Update docs in place.** Don't just report findings — fix the docs during the review.
- **Run monthly at minimum.** Quarterly is not frequent enough for a fast-moving project.
