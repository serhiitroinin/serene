---
name: pm-decide
description: |
  Create a product decision record (ADR). Use this skill when a non-obvious
  product or technical choice is made and should be documented for future
  reference. Triggers on: "decision record for [topic]", "record decision about
  [topic]", "ADR for [topic]", "why did we choose [thing]", "/pm-decide",
  or any request to document a product/technical decision.
metadata:
  version: "1.0"
  argument-hint: "<decision topic>"
---

# Decision Record Workflow

Create a structured decision record (ADR) for non-obvious product or technical choices.

## Full Cycle

```
1. NUMBER   → Get next sequential decision number
2. CONTEXT  → Gather context from user and codebase
3. WRITE    → Create the decision record from template
4. INDEX    → Add to decision log
```

## Step 1: NUMBER

Find the next decision number:

```bash
ls product/decisions/ | grep -E '^[0-9]{4}-' | sort -r | head -1
```

Increment the highest number. If no decisions exist, start at 0001.

## Step 2: CONTEXT

Gather information about the decision:

1. **From the user:** What was decided? What were the alternatives?
2. **From the codebase:** If the decision is about a technology or architecture choice, read relevant code to understand the current state.
3. **From product docs:** Check if this relates to any evaluated feature, constraint, or strategy doc.

If the user doesn't provide alternatives, suggest 2-3 plausible options based on the domain.

## Step 3: WRITE

Create the decision record at `product/decisions/<NNNN>-<slug>.md`.

Use the template at `product/decisions/_template.md` and fill in ALL sections:

- **Status:** Usually "Accepted" (if the decision is already made) or "Proposed" (if still under discussion)
- **Date:** Today's date
- **Context:** The situation, constraints, and forces driving the decision
- **Options Considered:** At least 2 options with pros and cons for each
- **Decision:** Which option was chosen and the reasoning
- **Consequences:** What becomes easier, what becomes harder, what risks remain
- **References:** Links to related features, docs, or external resources

Write from the perspective of someone reading this 6 months from now who needs to understand _why_ this choice was made, not just _what_ was chosen.

## Step 4: INDEX

No separate index to maintain — decisions are discovered via the `product/decisions/` directory listing and git history.

Print a summary:

```
Decision recorded: ADR-<NNNN> — <title>
Status: <Accepted/Proposed>
File: product/decisions/<NNNN>-<slug>.md
```

## When to Create Decision Records

Create a decision record when:

- Choosing between competing technical approaches
- Deciding to use (or not use) a specific third-party service
- Making pricing or business model changes
- Deferring or rejecting a high-RICE feature
- Changing the target persona or strategy focus
- Deprecating a feature or removing functionality

Do NOT create decision records for:

- Routine implementation choices (which component library to use for a button)
- Bug fixes
- Performance optimizations with obvious approaches

## Rules

- **Capture the "why."** The decision itself is less valuable than the reasoning.
- **Include rejected options.** Future readers need to know what was considered.
- **Be honest about tradeoffs.** Every decision has consequences — document them.
- **Keep it concise.** 50-100 lines is ideal. Not a thesis, not a tweet.
- **Date everything.** Decisions age. The date helps future readers judge relevance.
