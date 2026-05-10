---
name: Positioning
description: How serene is positioned vs single-source apps, generic athlete platforms, and clinical tools
type: strategy
updated: 2026-05-10
---

# Positioning

## The Sentence

> serene is the **designer-grade self-hosted dashboard** for **endurance athletes with Type 1 Diabetes** who want to see **glucose, recovery, and the training plan ahead** in one beautiful place — without handing their data to another vendor.

## Who serene is for

| Segment | Description | Fit |
|---------|-------------|-----|
| **T1D endurance athletes** | Run/cycle/tri seriously, follow a plan, wear CGM + GPS + recovery | **PRIMARY** |
| **T1D recreational athletes** | Train 3–4×/week without a formal plan, wear CGM + 1 device | Secondary (v0.2) |
| **Coaches with T1D athletes** | Want to see athlete glucose × workout in one screen | Tertiary (v0.2+) |
| **Family/partners of T1D athlete** | Want a calm, read-only view during long sessions | Future |
| **T2D / pre-diabetic biohackers** | Wear Libre 3 + Stelo for metabolic curiosity | Out of scope |
| **Endocrinologists** | Need clinical-grade reports, ICD coding | Out of scope |

## Who serene is NOT for

- People who want a phone-first app — serene is web-first and designed for a laptop session reviewing the week.
- People who want a closed SaaS — serene is self-hosted; we don't run a hosted service for v0.1.
- People who want medical device features — alarms, dosing, predictions are explicitly out of scope.

## Competitive landscape

| Tool | What it does well | Where it leaves a gap for Sasha |
|------|-------------------|--------------------------------|
| **LibreView / LibreLinkUp** | Authoritative CGM data; AGP report | No training plan, no recovery, no overlay with HR |
| **Tidepool** | Multi-device CGM aggregation, share with clinician | Clinician-first UI; no athletic context |
| **Garmin Connect** | Best-in-class workout + plan visibility | No glucose; ugly; "athlete dashboard" trapped behind 2014 design |
| **Stelo / Sugarmate** | Approachable consumer CGM viewing | Single-source; no workout/plan; closed SaaS |
| **TrainingPeaks / Intervals.icu** | TSS/CTL/ATL, planned vs actual workouts | No glucose; not built for T1D context |
| **Strava** | Social, beautiful map+pace | No CGM; no plan; gamification doesn't fit T1D safety |
| **Levels / OneDrop** | Lifestyle metabolic dashboards | T2D-leaning; no athletic plan; closed |
| **Nightscout** | Open-source CGM "remote monitoring" | Caregiver-first; aesthetics from a 2014 hospital; no athletic context |

**The white-space:** *designer-grade* + *T1D-athlete-specific* + *cross-source* + *self-hosted* — each axis has incumbents, but no tool covers all four.

## Why now

- FreeStyle Libre 3 + Dexcom G7 push CGM penetration past clinical contexts into prosumer/athletic.
- WHOOP, Oura, Garmin all expose APIs (or have community libs) — multi-source aggregation is feasible solo.
- Self-hosting + Docker-first deployment is increasingly normal (Plex, Jellyfin, Linkwarden, Karakeep).
- Designer-grade open source is mainstream now (Linear, Raycast, shadcn ecosystem) — users can tell the difference and prefer it.

## Brand voice

- **Calm, precise, athletic.** Not whimsical, not clinical, not "biohacker bro."
- **Geist Variable + restrained color + glucose-tone palette** carries the visual identity.
- **Honest about limits.** We say "this is a dashboard, not a medical device" plainly.
- **Builder energy.** "Made with care" is a real feeling. Public roadmap. PRs welcome.

## Anti-positioning

What we explicitly do *not* claim:
- Not "the Apple Health for diabetics."
- Not "AI insights for athletes."
- Not "an alternative to your doctor."
- Not "the Strava for diabetics" (gamification doesn't fit safety-sensitive T1D context).
