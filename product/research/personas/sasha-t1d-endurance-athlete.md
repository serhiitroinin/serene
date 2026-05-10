---
name: "Persona: Sasha (T1D Endurance Athlete)"
description: "PRIMARY PERSONA — adult endurance athlete with Type 1 Diabetes; trains seriously; self-hosts; design-sensitive."
type: persona
updated: 2026-05-10
status: Accepted
priority: PRIMARY
---

# Persona: Sasha (T1D Endurance Athlete)

> **This is the PRIMARY persona. All product decisions optimize for Sasha first.**
> If a feature doesn't help Sasha, it needs strong justification to ship.

> "I have to manage glucose every minute of every workout. The least the software could do is show me what's actually going on — and not look like it was designed in 2010."

---

## Demographics

| Attribute | Value |
|-----------|-------|
| **Role** | Knowledge worker (engineer/designer/PM/founder), serious amateur endurance athlete |
| **Age range** | 28–45 |
| **T1D duration** | 5+ years; comfortable on basal-bolus or pump |
| **CGM** | FreeStyle Libre 3 (or Dexcom G7) |
| **Recovery wearable** | WHOOP 4.0 / WHOOP MG |
| **GPS device** | Garmin (Forerunner 9xx, Fenix, Edge) |
| **Technical proficiency** | High — runs Docker, knows what self-hosting means |
| **Training volume** | 6–12 h/week, follows a structured plan |
| **Discipline** | Running primary; some cyclists, triathletes, mountain athletes |
| **Budget sensitivity** | Medium — pays for WHOOP+Garmin+Libre already; OSS is a values choice, not a cost choice |

## Context

Sasha lives in a city with good running infrastructure (Amsterdam, Berlin, NYC, Boulder, London). They're targeting a half-marathon, marathon, or triathlon ~6 months out. They wake up, check glucose on phone, decide breakfast, work, train at lunch or evening, and review the day before bed.

Diabetes management isn't a crisis — it's *constant low-grade tax* on attention. Their endo trusts them to self-manage; they don't need a clinician portal, they need a tool that respects their time.

They've stitched together what they currently use: LibreLinkUp on phone for current glucose, Garmin Connect for workout, WHOOP app for recovery, a notes app for "what worked this morning." On their laptop, when they want to actually *think* about patterns, they have nothing satisfying to open. They've tried Tidepool (clinician-y), Nightscout (caregiver-shaped, ugly), and nothing fits.

## Goals

1. **Primary:** Train consistently for a goal race without diabetes management costing them a session per month or a poor-recovery week per quarter.
2. **Secondary:** See the patterns that single-source apps hide — what fueling actually worked, what intensity actually spikes, what nights actually go low.
3. **Tertiary:** Own their data. Share it on their terms. Eventually contribute back to the project.

## Frustrations

1. **"I have four apps and none of them tell me the truth together."** No single tool shows glucose × workout × recovery in one view.
2. **"Garmin Connect's design hasn't been touched since 2014."** They're design-sensitive enough to hate this every day.
3. **"My coach can't see why a session went sideways."** Sharing means screenshots and Slack paragraphs.
4. **"Every CGM tool is built for a 65-year-old type 2."** Onboarding flows assume sedentary lifestyle.
5. **"Nightscout is ideologically right but visually wrong."** They'd contribute to OSS if there was something they'd want to use.
6. **"Late-night lows after long sessions still surprise me."** The pattern is statistically obvious but nothing surfaces it.
7. **"Sunday review takes 45 minutes of switching tabs."**

## Current workflow

**Morning (5–7 min):**
1. Wake, glance at LibreLinkUp on phone for overnight trace
2. Open WHOOP app, check recovery
3. Open Garmin Connect, check today's planned workout
4. Decide breakfast, decide whether to swap session

**Pre-workout (2–5 min):**
1. Glance at Libre, decide pre-fuel
2. Set temp basal if pump, or skip a unit if MDI
3. Start Garmin

**During workout:** Pure execution; glances at Libre ~3–5×.

**Post-workout (5 min):**
1. Save activity in Garmin
2. Glance at glucose, decide on recovery fueling
3. Mental note: "I felt off at minute 70, was glucose dropping?" — but no easy way to check
4. Forget; move on

**Sunday review (45 min, frustrated):**
1. Open Garmin Connect calendar — looks at week's TSS
2. Open Libre — copies AGP report
3. Open WHOOP — copies recovery trends
4. Manually correlate in head, write notes

**Total tool count:** 4 daily + 1 notes app. **Time spent on integration tax:** ~40 min/week.

## Feature sensitivity

| Capability | Priority | Notes |
|-----------|----------|-------|
| Glucose × workout overlay | **Critical** | The reason they would switch. |
| Today/tomorrow planned workout view | **Critical** | Garmin's view, glucose-aware. |
| Designer-grade visual quality | **Critical** | They notice; they care; they'll evangelize if it's beautiful. |
| AGP-style 14-day chart | High | Standard clinical view; want it but not unique. |
| Late-hypo risk descriptive badge | High | High-signal differentiator if framed correctly. |
| Self-hostable (Docker compose) | **Critical** | Trust + values + control. Cloud SaaS = no. |
| Multi-tenant / family view | Low | Solo athlete; future nice-to-have. |
| Manual treatment logging | Low (v0.2+) | Useful eventually, not v0.1 blocker. |
| Native mobile app | Low | Mobile-responsive web is fine. |
| Coach / partner share link | High | Solves J7 directly. |
| Plugin marketplace | None | Premature; they'd write their own integration. |

## Willingness to pay

- **Self-hosted, MIT licensed** — they expect it to be free.
- **Hosted version (post-v1.0)** — would pay $5–15/month if it worked beautifully and had data export. Comparable to Sugarmate or a TrainingPeaks Premium tier.
- **Sponsorship / GitHub Sponsor** — likely yes if the project is genuinely useful and well-maintained.

## Jobs to be done

- **J1** Daily glance — **Critical**
- **J2** Plan around tomorrow — **Critical**
- **J3** Replay workout with glucose — **Critical** (signature)
- **J4** Late-hypo risk descriptive — **Critical**
- **J5** Sunday review — **Critical**
- **J6** Pattern verification — High
- **J7** Share with coach — **Critical**
- **J8** Sensor sanity — High

## Representative quotes

> "I don't need another app to manage my diabetes. I need one that gets out of my way and shows me my own data, well."

> "I've been doing structured training for 4 years. Nothing in TrainingPeaks knows I have T1D. Nothing in Tidepool knows I just did a 90-minute long run."

> "If you ship something I'd actually use, I'll send PRs."

> "I want to look at this on a Sunday morning with coffee and feel calm, not feel like I'm reading hospital discharge papers."

## What we know vs assume

**Known (this is the project owner's lived experience):**
- The 4-tools-no-overlap workflow
- Late-hypo surprise pattern
- Designer-grade matters
- Self-host is a values requirement

**Assumed (validate post-launch):**
- Reach of this persona — how many T1D athletes globally are tech-savvy enough to self-host?
- Willingness to share PRs vs just using
- Coach segment size
- Whether designer-grade alone is enough vs needing analytics depth
