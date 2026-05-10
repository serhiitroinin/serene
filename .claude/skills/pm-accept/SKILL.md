---
name: pm-accept
description: |
  Accept a feature from the product backlog and prepare it for implementation.
  Creates GitHub Issues, updates the backlog status, and updates the roadmap.
  This is the bridge between product planning and engineering execution.
  Triggers on: "accept [feature]", "let's build [feature]", "start [feature]",
  "implement F[number]", "move F[number] to accepted", or any request to commit
  to building a backlog feature. After completion, suggests running /dev-workflow
  to begin implementation.
metadata:
  version: "1.0"
  argument-hint: "<feature ID (e.g., F1) or feature name>"
---

# Feature Acceptance Workflow

Accept a feature from the product backlog, create GitHub Issues, and prepare for implementation.
Bridges the product system (`product/`) with engineering execution (GitHub Issues + dev-workflow).

## Full Cycle

```
1. IDENTIFY    → Find the feature in the backlog
2. VALIDATE    → Confirm it's been evaluated and scored
3. DECOMPOSE   → Break into implementable sub-tasks
4. ISSUES      → Create GitHub Issue(s)
5. UPDATE      → Mark as Accepted in backlog + roadmap
6. HANDOFF     → Output issue URLs, suggest /dev-workflow
```

## Step 1: IDENTIFY

Find the feature in the backlog:

```
Read: product/features/backlog.md
```

Match by feature ID (F1, F2, etc.) or by name. If the feature is not in the backlog, tell the user to run `/pm-evaluate` first.

Also read the full evaluation if it exists:

```
Read: product/features/<feature-slug>/pitch.md
```

## Step 2: VALIDATE

Confirm the feature is ready for acceptance:

- [ ] Has a RICE score
- [ ] Persona impact matrix is filled (Sasha must care)
- [ ] Constraints have been checked (no blockers)
- [ ] Appetite is set

If any of these are missing, report what's incomplete and suggest running `/pm-evaluate` to fill gaps.

Also re-verify the feature isn't already implemented (codebase may have changed since evaluation):

```bash
# Quick grep for feature-related code
grep -r "<relevant keywords>" apps/web/src/ --include="*.ts" --include="*.tsx" -l
```

If found to be implemented, update backlog status to "Shipped" and stop.

## Step 3: DECOMPOSE

Break the feature into implementable sub-tasks. Each sub-task should be:

- **Independently shippable** (can be merged on its own without breaking anything)
- **Testable** (has clear acceptance criteria)
- **Small** (1-3 days of work max)

For small features (appetite: 1-3 days), a single issue is fine.
For medium features (1-2 weeks), create 2-4 sub-issues under an epic.
For large features (3+ weeks), create an epic with 4-8 sub-issues.

Include in each sub-task:
- Clear description of what to build
- Acceptance criteria (checkboxes)
- Affected files (if known from evaluation)
- Dependencies on other sub-tasks

## Step 4: ISSUES

Create GitHub Issue(s):

**For a single-issue feature:**

```bash
gh issue create --title "feat: <feature title>" --body "$(cat <<'EOF'
## Context

<Link to evaluation>: `product/features/<feature-slug>/pitch.md`
RICE Score: <score> | Appetite: <appetite> | Jobs: <J1-J6>

## Problem

<From the evaluation's problem statement>

## Solution

<From the evaluation's solution sketch>

## Acceptance Criteria

- [ ] <specific, testable criterion>
- [ ] <specific, testable criterion>
- [ ] <specific, testable criterion>

## Out of Scope

<From the evaluation's no-gos>

## Technical Notes

<Any constraints or implementation hints from the evaluation>
EOF
)" --label "feature"
```

**For an epic with sub-issues:**

Create the epic issue first, then sub-issues that reference it:

```bash
# Create epic
gh issue create --title "epic: <feature title>" --body "..." --label "epic"

# Create sub-issues
gh issue create --title "feat: <sub-task title>" --body "Part of #<epic-number>
..." --label "feature"
```

## Step 5: UPDATE

Update the product system docs:

1. **Backlog** (`product/features/backlog.md`):
   - Change status from "Proposed" to "Accepted"
   - Add the GitHub Issue number(s) in the Notes column

2. **Roadmap** (`product/roadmap.md`):
   - Ensure the feature is in the "Now" column with status "Accepted"
   - Add the issue number

3. **Feature evaluation** (`product/features/<feature-slug>/pitch.md`):
   - Fill in Section 7 (Decision):
     - Decision: Accepted
     - Rationale: <brief>
     - Assigned to: <issue numbers>
     - Target release: <quarter>

## Step 6: HANDOFF

Print a summary:

```
Feature accepted: <name>
RICE: <score> | Appetite: <appetite>
Issues created:
  - #<number>: <title> (<url>)
  - #<number>: <title> (<url>)

To start implementation:
  "implement #<issue-number>"  (triggers /dev-workflow)
```

## Rules

- **Never accept without evaluation.** If RICE score is missing, redirect to `/pm-evaluate`.
- **Never accept features where Sasha doesn't benefit.** Flag if the primary persona impact is "No" or "Low."
- **Verify before accepting.** Always re-check codebase — features may have been built since evaluation.
- **One feature per acceptance.** Don't batch multiple features.
- **Don't start implementation.** This skill creates issues. `/dev-workflow` handles the build.
- **Sub-tasks must be independently shippable.** Don't create sub-tasks that only work when all others are also complete.
- **Label consistently.** Use `feature` for features, `epic` for epics, `bug` for fixes.
