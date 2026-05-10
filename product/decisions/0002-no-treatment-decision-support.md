---
name: "ADR-0002: No treatment decision support — descriptive only"
description: serene is a dashboard, not a medical device — no dose math, no IOB/COB, no alarms, no predictions.
type: decision
updated: 2026-05-10
status: Accepted
---

# ADR-0002: No treatment decision support — descriptive only

## Status

**Accepted** (2026-05-10)

## Context

serene shows glucose data sourced from a regulated CGM (FreeStyle Libre via LibreLinkUp). The temptation in this domain is enormous: users would value features like:

- "You'll be 3.8 mmol/L in 30 minutes"
- "Tonight's late-hypo risk is high — eat 16 g carbs before bed"
- "Recommended temp basal: -30% × 90 min"
- "IOB: 2.4 U; COB: 18 g"
- "Alarm at 4.0 mmol/L"

All of these cross from descriptive analytics into FDA-regulated **device software function** territory:

- Predictive alerts → 21 CFR 880 (iCGM)
- Dose recommendations → iAGC / dosing decision software
- Active alarms on glucose values → regulated CGM display function
- IOB/COB → bolus calculator primitives

Sugarmate ships phone-call alarms because they're an _authorized_ Dexcom Data Partner. Tidepool Loop is FDA-cleared via a multi-year process. **serene is a hobby/portfolio open-source project that cannot — and will not — submit for clearance.**

## Options considered

### Option A: Ship it all "for educational purposes" with disclaimers

- **Pros:** Maximum user value
- **Cons:** Disclaimers do not exempt regulated functions; FDA will issue letters regardless of intent; reputational damage; legal exposure

### Option B: Ship descriptive analytics only

- **Pros:** Clean regulatory line; clear positioning; less surface area to maintain
- **Cons:** Some user-loved features unavailable

### Option C: Partner with an authorized provider

- **Pros:** Could ship more
- **Cons:** Massive complexity for a v0.1 hobby project

## Decision

**Ship descriptive analytics only.** Hard-code anti-scope into:

- `product/constraints.md` § R1
- `docs/anti-scope.md` (one-page contributor guide)
- Code review checklist in `.github/pull_request_template.md`
- Visible in-app footer: _"serene displays your data. It is not a medical device. Use the LibreLinkUp app for alarms; consult your endocrinologist for treatment decisions."_

Specifically banned:

- Insulin dose calculations or recommendations (basal, bolus, correction)
- IOB / COB tracking or computation
- Glucose value predictions ("you'll be X in Y minutes")
- Alarms / push notifications on glucose values
- Carb amount recommendations for hypo treatment
- Closed-loop pump integrations
- Any UI copy that could be read as "act now" guidance

Specifically allowed:

- Display historical and current glucose data from a regulated upstream CGM
- Descriptive stats: TIR, CV, GMI, AGP percentiles
- Observed pattern surfacing ("your glucose fell 3.2 mmol/L during last Tuesday's Z2")
- Canonical guideline ranges (Riddell 2017, Moser 2020) as reference bands
- User-authored annotations for their own learning

## Consequences

### What becomes easier

- Clear contributor guide — "if it sounds like medical advice, kill the PR"
- Marketing copy is constrained but honest
- Audience trust improves (clear about what we are not)

### What becomes harder

- Some user-requested features must be refused
- "Late-hypo risk" must be carefully framed as descriptive, not prescriptive

### Risks

- **Risk:** A contributor adds an alarm feature thinking it's "obvious value." Mitigation: PR template + linked ADR.
- **Risk:** Marketing copy drifts toward "manage your diabetes." Mitigation: explicit anti-scope phrases in `docs/anti-scope.md`.

## References

- FDA. [_Device Software Functions Including Mobile Medical Applications_](https://www.fda.gov/medical-devices/digital-health-center-excellence/device-software-functions-including-mobile-medical-applications)
- [T1D + Endurance Domain Research](../research/t1d-endurance-domain-research.md) § 6
- [Constraints — R1](../constraints.md)
