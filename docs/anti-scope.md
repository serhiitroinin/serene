# Anti-scope — what serene will never do

> serene is a designer-grade dashboard for endurance athletes with Type 1 Diabetes. It displays your data. **It is not a medical device.** This page exists so contributors don't accidentally cross the line.

## Hard bans (these will never ship in serene)

| Banned                                                                  | Why                                                                                                        |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Insulin dose calculations or recommendations (basal, bolus, correction) | FDA-regulated dosing decision software.                                                                    |
| IOB / COB tracking or computation                                       | Bolus calculator primitives → iCGM / iAGC territory.                                                       |
| Glucose value predictions ("you'll be 4.2 in 30 min")                   | Predictive alerts are device-software-function regulated.                                                  |
| Alarms / push notifications on glucose values                           | Active-monitoring CGM display function — FDA-cleared in apps that ship it (Sugarmate); we are not cleared. |
| Carb-amount recommendations for hypo treatment ("eat 16g now")          | Treatment guidance.                                                                                        |
| Closed-loop pump integration                                            | Tidepool Loop is FDA-cleared; we are not.                                                                  |
| Marketing copy that implies treatment guidance ("manage your diabetes") | Positioning matters; we say "displays your data".                                                          |

## What serene WILL do

| Feature class                                                                        | Why it's safe                                                                      |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Display historical / current glucose from a regulated CGM upstream (LibreLinkUp)     | Pass-through display                                                               |
| Descriptive stats (TIR, CV, GMI, AGP percentiles)                                    | Standard analytics, not predictions                                                |
| Observed pattern surfacing ("your glucose fell 3.2 mmol/L during last Tuesday's Z2") | Backward-looking; no forward claims                                                |
| Canonical guideline reference bands (Riddell 2017, Moser 2020) with citations        | Educational; quoting public guidelines                                             |
| User annotations for their own learning loop                                         | User-authored content                                                              |
| Late-hypo descriptive risk based on **the athlete's own historical pattern**         | "After sessions like this, your overnight nadir was X" — descriptive, never "do Y" |

## How to phrase descriptive insights

### Good (descriptive)

- "After sessions like this in the past, your overnight low has been ≤ 4.0 mmol/L 64% of the time."
- "Your time in range during weeks where CTL > 80 is 4 percentage points lower than baseline."
- "On VO2max sessions, your glucose has spiked > 13 mmol/L within 30 min in 78% of cases."

### Bad (prescriptive — kill in PR review)

- "Eat 16g of carbs before bed."
- "Your glucose will likely be 3.8 mmol/L at 02:00."
- "Reduce basal by 30%."
- "Alarm me when I drop below 4.0."

## PR checklist (every PR touching glucose or insulin context)

- [ ] No dose math
- [ ] No IOB / COB
- [ ] No alarms / push notifications
- [ ] No predictive numbers about future glucose values
- [ ] No carb-amount recommendations
- [ ] No copy that reads as treatment guidance

If a feature requires any of the banned items to be valuable, it's the wrong feature for serene — propose an alternative descriptive framing or close the issue.

## References

- ADR-0002: [No treatment decision support — descriptive only](../product/decisions/0002-no-treatment-decision-support.md)
- Constraints — R1: [Regulatory](../product/constraints.md#regulatory-constraints-most-important--read-first)
- FDA: [Device Software Functions Including Mobile Medical Applications](https://www.fda.gov/medical-devices/digital-health-center-excellence/device-software-functions-including-mobile-medical-applications)
- Riddell MC et al. _Exercise management in type 1 diabetes: a consensus statement._ Lancet Diabetes Endocrinol 2017
- Moser O et al. _Glucose management for exercise using CGM/isCGM in T1D._ EASD/ISPAD position statement, 2020
