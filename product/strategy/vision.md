---
name: Product Vision
description: serene's north star, mission, and principles — T1D endurance athlete focus
type: strategy
updated: 2026-05-10
---

# Product Vision

## North Star

**A T1D endurance athlete sees how their glucose interacts with training, recovery, and the plan ahead — in one place, in seconds, beautifully.**

serene closes the gap between scattered single-source apps (LibreView, Garmin Connect, WHOOP) and the integrated picture an athlete with diabetes actually needs to make daily decisions.

## Who We Build For

**T1D endurance athletes first. Everyone else later.**

Our primary user is a self-motivated adult who wears a CGM (FreeStyle Libre) and trains seriously — endurance running, cycling, triathlon, mountain sports. They already use 2–4 apps to keep track of their own data. They are technically literate enough to self-host, design-sensitive enough to notice when a tool looks like a 2010 hospital portal, and disciplined enough to want a *training plan* visible alongside their glucose, not just yesterday's readings.

Future personas — recreational T1D athletes, coaches with T1D athletes on roster, family/partners — are valid markets, but we don't split focus until the primary experience is excellent.

## Mission

Build a designer-grade, self-hostable hub that combines glucose, recovery, and training data — including the upcoming training plan — into insights an athlete with diabetes actually uses to plan tomorrow's session and review last week's pattern.

## One-Liner

The dashboard for athletes with Type 1 Diabetes — glucose, recovery, training, and the plan ahead, in one place. Self-host with one Docker compose.

## Core Value Proposition

The current workflow for a T1D endurance athlete: LibreLinkUp + Garmin Connect + WHOOP + Strava + a Notes app for "what worked." Five tools, no cross-source view, no training-plan visibility tied to glucose patterns.

serene replaces the dashboard layer. The phone apps still capture data; serene unifies the picture so an athlete can answer: *"Was last Saturday's long run safe? Should I fuel differently for tomorrow's tempo? Has my time-in-range during big training weeks dropped?"*

## Product Principles

1. **Designer-grade, not utility-grade.** Type 1 has enough hospital-portal UIs. serene looks like a tool an athlete *wants* to open.
2. **Single-tenant runtime, multi-tenant-ready schema.** Self-host first; never block the path to multi-user later.
3. **Cross-source insight is the differentiator.** Anyone can show one source. We show what the *intersection* tells you.
4. **The plan is part of the picture.** Yesterday's glucose only matters if you can map it to tomorrow's planned session.
5. **Boring on purpose where it counts.** Stats, AGP, time-in-range — we use the canonical clinical conventions. Innovation lives in cross-source synthesis and craft.
6. **No treatment decisions.** We are a dashboard, not a medical device. Alarms, IOB/COB, dosing recommendations — out of scope, forever.
7. **Public from day 1.** MIT license, public repo, public roadmap. The audience is technically capable enough that openness is a trust signal.

## Success Metrics (v0.1, pre-launch)

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Setup wizard completion | >= 70% | If onboarding fails, none of the rest matters |
| Time-to-first-chart | <= 5 min from Docker compose up | "One afternoon to self-host" promise |
| GitHub stars (W21+) | >= 100 in first 30 days | Validates the niche cares |
| First 5 self-hosted users (real CGM) | shipped data within 24h of install | Real signal vs vanity stars |
| Cross-source insight engagement | >= 40% of sessions view glucose × workout overlay | Proves the differentiator lands |

## What We Are NOT

- **Not a medical device.** No alarms, no insulin dose recommendations, no IOB/COB, no predictive lows, no clinical certifications.
- **Not a clinician portal.** Endocrinologist views are out of scope.
- **Not a marketplace.** No plugin ecosystem, no third-party content store.
- **Not iOS-native.** Browser-first; mobile-responsive eventually but no native app for v1.x.
- **Not a training-plan generator.** We *display* the plan from Garmin Coach / external sources; we don't *build* training plans.

## Decision Filter

Before any feature ships, answer in order:

1. **Does Sasha (primary persona) actually open this in a real session?** If no → defer.
2. **Does it use cross-source data, or is it a single-source repackage?** Cross-source = higher priority.
3. **Could it be misread as a treatment recommendation?** If yes → re-scope or kill.
4. **Does it raise the design bar for the dashboard, or just add features?** v0.1 is about polish-per-feature, not feature count.
