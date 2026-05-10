---
name: Competitive Landscape
description: How serene compares to diabetes-native, athlete-native, and open-source health tools
type: research
updated: 2026-05-10
status: Active
---

# Competitive Landscape

> Source: [T1D + Endurance Domain Research](../t1d-endurance-domain-research.md)

The defensible wedge for serene: **designer-grade × T1D-athlete-specific × cross-source × self-hosted.** Each axis has incumbents; no tool covers all four.

---

## Diabetes-native tools

| Tool | Strengths | Gap for Sasha | Threat level |
|------|-----------|---------------|--------------|
| **LibreView / LibreLinkUp** (Abbott) | Authoritative CGM data, AGP report, free | No training plan, no recovery, no overlay with HR | Low — they own the data, but not the lens |
| **Tidepool** | Open-source, multi-device, FDA-cleared Loop, partner/clinician sharing | Activity is a manual annotation — no structured workout, no power/pace/zone, iOS-only Loop | Medium — closest open-source competitor, but clinician-shaped UX |
| **Sugarmate** | Best Dexcom-data-partner UX, glance widgets, phone-call alarms | Dexcom-only, no Libre, no recovery/training, alarms are FDA-cleared (we can't replicate) | Low (different audience) |
| **Stelo (Dexcom OTC)** | Frictionless non-Rx CGM onboarding | Not for insulin users | Low |
| **Glucose Buddy** | Manual logbook, Apple Health, PDF reports | No workout/recovery model; aging UX | Low |
| **Levels** | Beautiful UX, food-zone scoring | T2D/biohacker-leaning, no insulin awareness | Low |
| **One Drop** | Broad device sync, AI coaching | Generalist; weak for endurance specifics | Low |
| **Nightscout** | OSS, self-hosted, full CGM + treatments + IOB | Caregiver-first UX, looks like a 2014 hospital portal, tries to be everything | Medium — closest *self-hosted* competitor, but visually wrong |

**Key insight:** Diabetes-native tools treat exercise as a manual annotation. None compute training load.

---

## Athlete-native tools (T1D-blind)

| Tool | Strengths | Gap for Sasha | Threat level |
|------|-----------|---------------|--------------|
| **TrainingPeaks** | Industry-default PMC (CTL/ATL/TSB), coach marketplace, planned-vs-actual | Zero glucose layer, no insulin-aware fueling | Medium — coach has it; might add glucose someday |
| **Intervals.icu** | Free, hackable, Strava/Garmin sync, surprisingly deep PMC | No glucose, no insulin | Medium — open-ish, the "everything-engineer-loves" platform |
| **Final Surge** | Calendar-first, run-coach friendly, free for athletes | No glucose, thinner analytics | Low |
| **Strava** | Social graph, segments, route discovery, big map | Not analytics; no glucose | Low (different job) |
| **Garmin Connect** | Native device sync, sleep/HRV, training readiness, race calendar | No glucose, ugly, single-vendor | Medium — owns the watch; could add Dexcom partnership |
| **WHOOP app** | Best-in-class recovery/strain/sleep | Single signal, no plan, no glucose | Low (single-source) |

**Key insight:** Athlete-native tools are entirely glucose-blind.

---

## Cross-pollinators / adjacent

| Tool | Note |
|------|------|
| **Garmin Dexcom IQ apps** | A patchwork on Garmin watches showing glucose during workouts. Brittle, breaks on every iOS or Garmin update. Validates the demand. |
| **Apple Health** | Aggregator. Not a dashboard. Surfaces glucose if Libre app shares it, but no analytics. |
| **Levels** | T2D/biohacker; not really diabetes-software. |

---

## Where serene wins

| Axis | Incumbents | serene's stance |
|------|------------|------------------|
| **Designer-grade** | Linear/Raycast standard set the bar; diabetes-tools don't meet it | Designer-grade is core value prop |
| **T1D-athlete-specific** | Tidepool is closest, but clinician-shaped | T1D-athlete is *the* audience |
| **Cross-source (CGM + recovery + training)** | Nobody | This is the wedge |
| **Self-hosted** | Nightscout, Tidepool (partial) | One-line Docker compose |

---

## Where serene cannot win (and shouldn't try)

| Axis | Why we lose |
|------|-------------|
| **Marketplace traffic** | Strava and Garmin own the social graph |
| **Clinical certification** | TrainingPeaks (no), Tidepool (yes); we are pre-cert and shouldn't try |
| **Hardware integration** | Garmin owns Garmin; Apple owns Apple |
| **Live alarms** | Sugarmate / LibreLinkUp / Dexcom apps are FDA-cleared for this; we are not |

---

## Strategic implications

1. **Don't compete on data freshness for live alarms.** Use the LibreLinkUp app for that.
2. **Don't compete on coach feature breadth.** Coaches will keep TrainingPeaks. Solve only the share-link case for v0.1.
3. **Don't compete on hardware breadth.** Three sources (Libre, WHOOP, Garmin) covers ~80% of the persona's stack. Add Apple Health / Dexcom in v0.2.
4. **Compete on:** the join + the design + the self-host.

---

## Watch list (revisit quarterly)

- Tidepool athlete-mode rumors? They've discussed athlete features publicly.
- TrainingPeaks acquiring or building a CGM ingest? Possible at any point.
- Garmin × Dexcom deeper partnership? Already partial; could deepen.
- Open-source competitors emerging? None known as of 2026-05-10.
