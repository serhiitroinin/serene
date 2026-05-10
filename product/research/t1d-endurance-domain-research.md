# T1D + Endurance: Domain Research for serene

> Scope-shaping research for a designer-grade, self-hosted dashboard combining
> FreeStyle Libre (LibreLinkUp), WHOOP recovery, and Garmin training data
> for endurance athletes with Type 1 Diabetes. Date: May 2026.

---

## 1. Existing tools T1D athletes use today

### Diabetes-native tools

| Tool                   | Does well                                                                                                                                                                           | Lacks for T1D athletes                                                                                                                                    | Gap                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Tidepool**           | Open-source ethos, multi-device data unification (CGM + pump + BGM), partner/clinician sharing, FDA-cleared Loop. Has run a marathon CGM study with T1D Exchange and Beyond Type 1. | Activity is a manual annotation, not a structured workout object. No power, pace, HR-zone, or training-load context. iOS-only Loop. Steep learning curve. | No notion of _training stress_ alongside glucose. |
| **Sugarmate**          | Only authorized Dexcom Data Partner; phone calls on extreme highs/lows; clean reports; deep iOS widget/glance UX.                                                                   | Dexcom-only (no Libre), no recovery or training-load data, and the alarm/call mechanic is exactly the regulated-device territory we want to avoid.        | No multi-source recovery/load fusion.             |
| **Stelo (Dexcom OTC)** | Friction-free non-prescription CGM aimed at non-insulin-using adults; great onboarding.                                                                                             | Explicitly _not_ for people on insulin, no exercise integration beyond "glucose during walk."                                                             | Wrong audience for endurance T1D.                 |
| **Glucose Buddy**      | Manual logbook, PDF reports for clinic visits, Apple Health sync.                                                                                                                   | Manual entry-heavy; no first-class workout/recovery model; analytics shallow.                                                                             | Aging UX, no athlete persona.                     |
| **Levels**             | Beautiful UX, food-zone scoring, metabolic-fitness narrative.                                                                                                                       | Aimed at metabolically-healthy biohackers; ignores insulin dynamics; T1D-hostile defaults.                                                                | Wrong audience.                                   |
| **One Drop**           | Logs glucose/meds/diet/activity, broad device sync, AI coaching.                                                                                                                    | Generalist; weak for endurance specifics (zones, TSS, AGP).                                                                                               | Not athlete-grade.                                |
| **Tidepool+**          | Subscription tier with Loop, partner view, deeper insights.                                                                                                                         | Same architectural gap: no training-load math.                                                                                                            | No CTL/ATL/TSB.                                   |

### Athlete-native tools (T1D-blind)

| Tool               | Does well                                                                                             | Lacks for T1D athletes                                                               | Gap                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------- |
| **TrainingPeaks**  | Industry-default PMC (CTL/ATL/TSB), coach marketplace, planned-vs-actual, structured workout builder. | No glucose layer; no insulin-aware fueling; coach can't see why an interval crashed. | No CGM overlay.               |
| **Intervals.icu**  | Free, hackable, custom dashboards, Strava/Garmin sync, surprisingly deep PMC.                         | Same: no glucose, no insulin, no recovery score beyond HRV.                          | No CGM overlay.               |
| **Final Surge**    | Free for athletes, calendar-first, run-coach friendly.                                                | No glucose; thinner analytics.                                                       | No CGM overlay.               |
| **Strava**         | Social graph, segment competition, route discovery.                                                   | Not an analytics tool; no glucose; no recovery.                                      | Wrong job.                    |
| **Garmin Connect** | Native device sync, sleep/HRV, training readiness, race calendar.                                     | Garmin-walled; no glucose unless you buy a Garmin-Dexcom IQ app patchwork.           | No Libre, no insulin context. |
| **WHOOP app**      | Best-in-class recovery/strain/sleep model.                                                            | No training plan, no glucose.                                                        | Single signal in isolation.   |

**The gap**: nobody fuses _glucose + recovery + training_ in a designer-grade,
self-hosted, athlete-first surface. Closest is hand-rolled Garmin IQ + Dexcom +
Sugarmate stacks that break on every iOS update.

---

## 2. The "T1D + endurance training" Jobs To Be Done

Concrete decision moments framed as JTBD ("when X, I want Y, so I can Z"):

1. **Pre-dawn long ride.** _When I'm waking up at 5am for a 3hr Z2 ride, I want to see last-night glucose trace + this-morning fasting trend + WHOOP recovery + planned TSS, so I can pick the right pre-ride carb load and basal reduction._
2. **Tomorrow's planned workout.** _When I open the app the night before, I want tomorrow's session next to my projected overnight glucose, so I can decide whether to set a temp basal at bedtime._
3. **Mid-workout fueling.** _When I'm 90min into a long run and glucose is 6.2 mmol/L falling at -0.05/min, I want a clear "carb headroom" indicator (NOT a dose recommendation), so I can grab a gel before going hypo._
4. **Hard interval-day glucose spike.** _When I just finished 6×3min VO2max intervals and glucose jumped to 13 mmol/L, I want to know if this is the expected anaerobic response or a real correction case, so I don't over-treat._
5. **Post-workout late-onset hypo risk.** _When I finished a 90min Z2 session at 4pm, I want a "tonight's hypo risk" badge (low/med/high) based on session TSS, duration, glucose trajectory and historical patterns, so I can adjust dinner carbs and overnight basal expectations._
6. **Weekly load vs glycemic-variability review.** _When I do my Sunday review, I want CTL/TIR/CV side by side so I can see whether ramping volume is degrading control or improving it._
7. **Race-day rehearsal.** _When I do a key brick session, I want to replay the glucose trace next to power/HR zones, so I can refine fueling for race day._
8. **Travel/heat/altitude.** _When I'm training in different conditions, I want to see how my glucose response shifts vs baseline, so I can pre-empt insulin sensitivity changes._
9. **Recovery-day decision.** _When WHOOP recovery is red and glucose was volatile overnight, I want one screen confirming both, so I can confidently downgrade today's planned session._
10. **Coach/partner sharing.** _When my coach asks "why was Tuesday's threshold short?", I want a single shareable link showing the workout + glucose overlay, so they understand without me writing a paragraph._

---

## 3. Authoritative guidance on T1D + exercise

Canonical references:

- **Riddell et al. (2017)** — Lancet Diabetes & Endocrinology, _Exercise management in type 1 diabetes: a consensus statement_. Establishes glucose targets at exercise initiation and pre/intra/post fueling rules.
- **Moser et al. (2020)** — EASD/ISPAD position statement on **CGM use during exercise in T1D** (endorsed by JDRF, supported by ADA). The most current sensor-glucose-specific guidance.
- **ADA Standards of Care 2024-2026** — TIR ≥70%, time <70 mg/dL <4%, time <54 mg/dL <1%, CV ≤36%.
- **Diabetes Canada / ISPAD** — pediatric and adolescent variants of the same targets.
- **Brar et al. (2024)** — _Practical considerations for CGM in elite athletes with T1D_, J Physiology.

Canonical numbers (lock these into `@serene/core/ranges`):

- **Pre-exercise target**: 7.0–10.0 mmol/L (126–180 mg/dL).
- **Pre-exercise <5.0 mmol/L (90 mg/dL)**: ingest 10–20 g rapid carbs, delay start.
- **First 90 min post-exercise** target band: 4.4–10.0 mmol/L (80–180 mg/dL).
- **Intra-exercise carb intake** for endurance: 30–80 g/h, same as non-T1D peers.
- **Hypo threshold (level 1 / level 2)**: <3.9 mmol/L (70 mg/dL) / <3.0 mmol/L (54 mg/dL).
- **Hyper for exercise hold**: >15 mmol/L (270 mg/dL) with ketones — pause exercise.

Well-documented patterns to surface (not predict):

- **Aerobic Z1–Z2** → glucose typically falls; greatest hypo risk during and after.
- **Anaerobic / HIIT / heavy resistance** → counter-regulatory hormones (adrenaline, growth hormone, cortisol) push glucose up acutely; hypo risk shifts later.
- **Resistance-then-aerobic ordering** stabilises glucose better than aerobic-first.
- **Late-onset / nocturnal hypoglycemia** at 6–12h post-exercise; ~30% incidence after 45min moderate aerobic in late afternoon. Driven by replenishing muscle glycogen and elevated insulin sensitivity.
- **Dawn phenomenon** can compound morning-session insulin needs.

---

## 4. Cross-source insights with high signal

Ranked candidate insights only available when glucose × HR × workout-type × recovery are joined. Ranked by perceived value to a T1D endurance athlete.

1. **Tonight's late-hypo risk badge** — composite of session duration, average HR zone, total carbs, post-session glucose slope, vs the athlete's own historical post-session overnight nadir. Display as low/med/high with the underlying signals; do not alarm.
2. **Glucose-at-zone heatmap** — for each HR/power zone, the median glucose ± IQR observed across the last N sessions. Reveals "I always start dropping above Z3."
3. **Fueling-effectiveness curve** — carbs ingested per hour vs glucose stability score during the session. Tells the athlete whether 60 g/h is enough on a 3hr ride.
4. **Aerobic-vs-anaerobic glucose response signature** — dual-line chart per session: HR vs glucose. Surfaces the predicted up-spike on intervals and the down-drift on Z2.
5. **Recovery-adjusted glycemic variability** — CV stratified by WHOOP recovery (red/yellow/green). Often shows red-recovery days have 30–40% higher CV.
6. **Training-load vs TIR weekly scatter** — CTL on x, weekly TIR on y; lets the athlete see whether ramping load erodes control.
7. **Pre-session "go/wait" panel** — current glucose, 30-min slope, IOB if user-entered, planned session intensity. Shows the Riddell decision tree as data, not a prescription.
8. **Hyper-on-intervals frequency** — % of high-intensity sessions where glucose exceeds 13 mmol/L; useful for tuning pre-session basal.
9. **Sleep-glucose-recovery triple overlay** — overnight glucose trace + WHOOP sleep stages + HRV. Reveals nocturnal hypo events that wreck next-day recovery.
10. **Race-day rehearsal replay** — synced playback of a past long session: power/HR/cadence/glucose on one timeline.
11. **Sensor-sync sanity check** — flags when Libre and HR data disagree on session boundaries (Libre lag, sensor pressure-low). Quality-of-data trust signal.
12. **Menstrual-cycle-phase glucose response** (where user opts in) — phase-stratified TIR and insulin sensitivity proxy.

---

## 5. Training-plan / training-schedule UX

**Standard mental model in endurance software:**

- **TSS** (Training Stress Score) — single-session load; 100 = 1 hour at threshold.
- **CTL** (Chronic Training Load, "fitness") — 42-day exponentially weighted TSS average.
- **ATL** (Acute Training Load, "fatigue") — 7-day exponentially weighted TSS average.
- **TSB** (Training Stress Balance, "form") — yesterday's CTL − yesterday's ATL.
- **Calendar with planned-vs-actual** — TrainingPeaks, Final Surge, Garmin Connect, Intervals.icu all use a week/month calendar with a planned workout placeholder that "fills in" once the athlete completes it.

**How the leaders surface "today / tomorrow / week":**

- _TrainingPeaks_: today = top card on dashboard; tomorrow = next calendar tile; week = PMC strip + weekly TSS summary.
- _Garmin Connect_: today = "Daily Suggested Workout" + readiness; tomorrow = calendar; week = training-status widget.
- _Intervals.icu_: month calendar is primary; PMC is the secondary insight strip.
- _Final Surge_: calendar-first, simpler PMC.

**Recommendation for serene**: **adopt the standard, don't invent.** Athletes
are bilingual in TSS/CTL/ATL/TSB; reinventing terminology costs trust and
documentation surface. Specifically:

- Pull TSS from Garmin (it computes its own equivalents — TrainingLoad, TE
  scores) and re-derive CTL/ATL/TSB from session TSS using the standard 42d/7d
  exponential decay. Document the formulas openly in `@serene/core/stats`.
- Use a **week-strip + today-card** primary layout (this matches Garmin
  Connect's mental model best). Tomorrow appears as the second card.
- Add ONE serene-original lens on top: a **Glucose-Adjusted Readiness** strip
  that overlays TSB with WHOOP recovery and overnight TIR. That is our
  signature, not a renamed metric.

---

## 6. Anti-scope / regulatory landmines

The FDA explicitly regulates software that _calculates an insulin dose_,
_commands an insulin pump_, or whose failure could cause patient harm
(iAGCs, dosing decision software, alarm-bearing CGM displays). Keep serene
out of that envelope.

**serene MUST NOT:**

- **Calculate or recommend insulin doses**, basal adjustments, or correction
  boluses. Even a "suggested" temp-basal is dosing decision support.
- **Compute or display IOB / COB**. Both are bolus-calculator primitives and
  push the product into 21 CFR 880 (iCGM) / iAGC territory.
- **Issue alarms for hypo/hyper events.** Push notifications, phone calls,
  vibrating alerts, or any "act now" surface for glucose values is exactly
  the FDA-cleared CGM display function. Sugarmate does this _because_ it is
  authorized; we are not.
- **Predict glucose values** ("you will be 4.2 in 30 minutes"). Predictive
  alerts are device-software-function regulated.
- **Recommend carb amounts** for treatment of hypoglycemia. Numeric "eat 16g
  now" is treatment guidance.
- **Position itself as treatment decision support** in marketing copy. No
  language like "tells you what to do" or "manages your diabetes."
- **Ship a closed-loop integration.** Tidepool Loop is FDA-cleared via a
  multi-year process; a self-hosted hobby project is not the place.

**serene MAY (and should):**

- Display historical and current glucose data sourced from a regulated CGM
  upstream (LibreLinkUp).
- Compute **descriptive** statistics: TIR, CV, GMI, AGP percentile bands.
- Show **observed** patterns ("your glucose fell 3.2 mmol/L during last
  Tuesday's Z2") without making forward-looking claims.
- Surface **canonical guideline ranges** (Riddell 2017, Moser 2020) as
  reference bands on charts, with citations.
- Let the user annotate decisions they made, for their own learning loop.

A clear in-app disclaimer + a "this is not a medical device" footer +
the explicit absence of alarms keeps serene firmly in the "general
wellness / data visualization" lane.

---

## Top 5 product implications for serene

1. **Be the join, not another silo.** The defensible wedge is fusing Libre + WHOOP + Garmin into one designer-grade view. Single-source apps already exist and do their one job well; no one ships the join.
2. **Adopt TrainingPeaks vocabulary (TSS / CTL / ATL / TSB), invent one lens.** Standard endurance metrics earn instant trust. The signature serene insight is **Glucose-Adjusted Readiness** — TSB × WHOOP recovery × overnight TIR — surfaced as a single today-card strip.
3. **Ship the AGP and the Glucose × Workout overlay first.** These two charts cover ~80% of the daily and weekly review JTBDs. They are also the highest-design-leverage surfaces (signature SVG/visx territory per the architecture plan).
4. **Lock the hypo-risk surface as descriptive, not prescriptive.** A "tonight's late-hypo likelihood" badge based on observed history is enormous user value AND keeps us out of FDA territory — provided it never alarms, never predicts a number, never recommends action. Phrase as "athletes with similar sessions saw lower overnight glucose 64% of the time."
5. **Hard-code the anti-scope in code review and docs.** No IOB, no COB, no alarms, no dose math, no predictions. Put a `// no-medical-advice` lint/comment convention in `@serene/core` and a one-page `docs/anti-scope.md` so contributors don't drift across the line during W19–W21.

---

### Sources

- Riddell MC et al. _Exercise management in type 1 diabetes: a consensus statement._ Lancet Diabetes Endocrinol 2017;5:377-390. <https://www.thelancet.com/article/S2213-8587(17)30014-1/abstract>
- Moser O et al. _Glucose management for exercise using CGM/isCGM in T1D._ EASD/ISPAD position statement, 2020. <https://pmc.ncbi.nlm.nih.gov/articles/PMC7702152/>
- Brar R et al. _Practical considerations for CGM in elite athletes with T1D._ J Physiol, 2024. <https://physoc.onlinelibrary.wiley.com/doi/full/10.1113/JP285836>
- Yardley JE et al. _Resistance vs aerobic exercise: acute effects on glycemia in T1D._ Diabetes Care 2013. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3579339/>
- Frontiers Endocrinol. _Exercise, T1D and blood glucose: implications of timing._ 2022. <https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2022.1021800/full>
- Tidepool blog. _Redefining diabetes for athletes._ <https://www.tidepool.org/blog/redefining-diabetes-for-athletes>
- TrainingPeaks. _A Coach's Guide to ATL, CTL & TSB._ <https://www.trainingpeaks.com/coach-blog/a-coachs-guide-to-atl-ctl-tsb/>
- TrainingPeaks Help. _Form (TSB)._ <https://help.trainingpeaks.com/hc/en-us/articles/204071764-Form-TSB>
- Dexcom. _Sugarmate Data Partner._ <https://www.dexcom.com/en-us/partnerships/digital-health-apps/sugarmate>
- Stelo by Dexcom. _How it works._ <https://www.stelo.com/en-us/how-it-works>
- FDA. _Device Software Functions Including Mobile Medical Applications._ <https://www.fda.gov/medical-devices/digital-health-center-excellence/device-software-functions-including-mobile-medical-applications>
- FDA. _FDA Clears New Insulin Pump and Algorithm-Based Software (iLet)._ <https://www.fda.gov/news-events/press-announcements/fda-clears-new-insulin-pump-and-algorithm-based-software-support-enhanced-automatic-insulin-delivery>
- Gatorade Sports Science Institute. _CGM and the Athlete with T1D._ <https://www.gssiweb.org/sports-science-exchange/article/continuous-glucose-monitoring-and-the-athlete-with-type-1-diabetes>
