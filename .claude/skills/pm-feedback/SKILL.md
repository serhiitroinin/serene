---
name: pm-feedback
description: |
  Capture and process user feedback into the product management system.
  Use this skill when the user shares feedback from a user interview, usability
  test, support ticket, survey response, or organic feedback (social media,
  reviews, comments). Triggers on: "user feedback", "user said", "interview
  notes", "usability test results", "support ticket from", "user reported",
  "/pm-feedback", or any sharing of user/customer feedback. Structures the
  feedback, maps it to personas/JTBD/backlog, and updates insights.
metadata:
  version: "1.0"
  argument-hint: "<paste feedback, notes, or describe the session>"
---

# User Feedback Capture Workflow

Capture user feedback, structure it, and connect it to the product system.
Feedback is the evidence layer that validates personas, scores features, and generates ideas.

## Full Cycle

```
1. CAPTURE     → Structure the raw feedback
2. MAP         → Connect to personas, JTBD, backlog
3. ASSESS      → Determine impact on product decisions
4. STORE       → Save session and update insights
5. ACT         → Recommend follow-up actions
```

## Step 1: CAPTURE

The user will share feedback in one of these forms:

- **Raw notes** from an interview or usability test
- **A support ticket** or email from a user
- **A quote or comment** from social media, review site, or community
- **Survey responses** (individual or aggregated)
- **Their own observations** from watching a user

Structure the feedback using the template at `product/research/feedback/_template.md`.

### Extract from the raw input:

- **Key quotes** — exact user words (the most valuable artifact)
- **Pain points** — where did they struggle or express frustration?
- **Feature requests** — what did they ask for (explicitly or implicitly)?
- **Surprises** — anything unexpected about their behavior or mental model?
- **What worked** — what did they find easy or delightful?

### Classify the session:

- **Session type:** Interview / Usability test / Support ticket / Survey / Organic
- **User type:** Prospect / Free user / Pro user / Churned user
- **Persona match:** Which persona does this user most resemble? (Sasha / Riley / Coach / New)

If the user provides minimal context, ask focused questions:

- "Was this a paying user or free tier?"
- "Were they trying to record, edit, publish, or something else?"
- "Did they say anything in their own words that stood out?"

## Step 2: MAP

Read the product system docs to connect the feedback:

```
product/research/personas/sasha-t1d-endurance-athlete.md  → Does this match Sasha?
product/research/jobs-to-be-done.md               → Which jobs are relevant?
product/features/backlog.md                        → Do any features address this?
product/constraints.md                             → Are constraints causing the pain?
```

For each pain point and feature request:

- Map to a specific JTBD (see jobs-to-be-done.md) or identify a new job
- Match to an existing backlog feature (see backlog) or flag as new
- Note the stage where it occurred (Setup / Daily glance / Workout / Post-workout / Weekly review / Sharing)

## Step 3: ASSESS

Determine how this feedback should affect product decisions:

### Persona Validation

- Does this session confirm Sasha's goals, frustrations, and priorities?
- Does it reveal anything that contradicts our persona assumptions?
- If the user doesn't match any persona, should we track this as a new segment?

### RICE Impact

For each backlog feature this feedback touches:

- **Confidence adjustment** — User confirmed the problem → increase confidence by 5-10%
- **Reach adjustment** — New user segment cares → increase reach estimate
- **Impact adjustment** — User described severe pain → reconsider impact score

### New Feature Signals

If the feedback suggests a feature not in the backlog:

- Is this a one-off request or a pattern? (Check previous sessions in `insights.md`)
- Does it serve Sasha? (If not, note it but don't act)
- If it's the 3rd+ mention of the same need, recommend running `/pm-evaluate`

## Step 4: STORE

### Save the session

Write the structured feedback to:

```
product/research/feedback/sessions/YYYY-MM-DD-<type>-<slug>.md
```

Example filenames:

- `2026-04-02-interview-yoga-instructor.md`
- `2026-04-02-support-export-failure.md`
- `2026-04-02-organic-twitter-praise.md`

### Update the insights aggregation

Read `product/research/feedback/insights.md` and update:

1. **Summary stats** — increment session count
2. **Top pain points** — add or increment frequency
3. **Top feature requests** — add or increment frequency
4. **Persona validation** — update confirmation status
5. **Quotes library** — add the best 1-2 quotes to the relevant category
6. **JTBD validation** — increment confirmation counts
7. **Signals for new features** — add if this is a new untracked request

## Step 5: ACT

Recommend follow-up actions based on the feedback:

**If the feedback confirms a backlog feature:**

```
→ F<N> confidence increased. Consider running `/pm-accept F<N>` if RICE > 200.
```

**If the feedback suggests a new feature (3+ mentions):**

```
→ New pattern detected: "<description>". Recommend: /pm-evaluate <feature idea>
```

**If the feedback challenges a persona assumption:**

```
→ Persona update needed: Sasha's "<assumption>" may be wrong. Evidence: "<quote>"
  Update: product/research/personas/sasha-t1d-endurance-athlete.md
```

**If the feedback is a support issue (not a feature):**

```
→ Bug/UX issue: "<description>". Create GitHub Issue: gh issue create ...
```

Print a summary:

```
Feedback captured: <session type> — <user type>
Persona match: <Sasha/Riley/Coach/New>
Key finding: <one sentence>
Backlog impact: <features affected>
Actions: <list>
File: product/research/feedback/sessions/<filename>.md
```

## Rules

- **Capture exact quotes.** User's own words are 10x more valuable than your summary.
- **Don't over-interpret.** One user's opinion is a data point, not a trend. Note it, don't act on it alone.
- **3+ mentions = pattern.** Only recommend `/pm-evaluate` for new features after 3+ independent mentions.
- **Always map to JTBD.** If feedback doesn't connect to a job, it might not be actionable.
- **Update insights after every session.** Don't let sessions pile up without aggregation.
- **Protect user privacy.** Use first names or IDs, never full names or contact info in stored files.
- **Positive feedback matters too.** "What worked" is as important as "what didn't." It tells us what to protect.
