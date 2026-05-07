import {
  formatClock,
  formatDistance,
  formatDuration,
  formatGlucose,
  formatPace,
  mockData,
} from "./shared";

const masthead = { fontFamily: "var(--font-display-luxe)" } as const;
const body = { fontFamily: "var(--font-serif-editorial)" } as const;
const typewriter = { fontFamily: "var(--font-typewriter)" } as const;

const PAPER = "#f1ead6";
const PAPER_DARK = "#e6dec3";
const INK = "#1f1810";
const RULE = "#1f181030";
const ACCENT = "#7a1f1a";
const NAVY = "#1e2c4a";

export function AlmanacVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments, weeklyTIR } =
    mockData;

  return (
    <div className="min-h-dvh" style={{ ...body, backgroundColor: PAPER, color: INK }}>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(122,31,26,0.05) 0px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(31,24,16,0.06) 0px, transparent 1px)",
          backgroundSize: "3px 3px, 5px 5px",
        }}
      />

      <header
        className="relative border-b-4 px-8 pb-2 pt-6"
        style={{ borderColor: INK, borderTop: `1px solid ${INK}` }}
      >
        <div
          className="mx-auto flex max-w-[1200px] items-center justify-between text-xs uppercase tracking-widest"
          style={typewriter}
        >
          <span>Vol. I · No. 4</span>
          <span>
            Edition of{" "}
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
          <span>Price · €0,00</span>
        </div>
        <div className="mx-auto mt-3 max-w-[1200px] text-center">
          <h1
            className="text-[clamp(4rem,11vw,9rem)] leading-[0.85] tracking-tight"
            style={masthead}
          >
            <span className="italic">The</span> Serene <span className="italic">Almanac</span>
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.32em]" style={typewriter}>
            A daily ledger of glucose, motion, and recovery for the athlete with type 1.
          </p>
        </div>
      </header>

      <nav
        className="border-b-2 border-t px-8 py-3"
        style={{ ...typewriter, borderColor: INK, backgroundColor: PAPER_DARK }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between text-xs uppercase tracking-widest">
          <ul className="flex items-center gap-6">
            {[
              "Today",
              "The Trace",
              "Movement",
              "Sleep",
              "Treatments",
              "Field Notes",
              "Letters",
            ].map((n, i) => (
              <li key={n} style={{ color: i === 0 ? ACCENT : INK }}>
                {n}
              </li>
            ))}
          </ul>
          <span>p. 02 of 14</span>
        </div>
      </nav>

      <article className="relative mx-auto grid max-w-[1200px] grid-cols-12 gap-x-8 gap-y-8 px-8 py-10">
        <section className="col-span-12 lg:col-span-8">
          <p
            className="border-b pb-1 text-xs uppercase tracking-[0.3em]"
            style={{ ...typewriter, borderColor: RULE, color: ACCENT }}
          >
            Lead · Glucose Report
          </p>
          <h2 className="mt-3 text-5xl leading-[1] tracking-tight" style={masthead}>
            <span className="italic">A steady morning,</span> with a fourteen-kilometre
            interruption.
          </h2>
          <p
            className="mt-4 columns-2 gap-8 text-base leading-relaxed [column-rule:1px_solid_var(--rule)]"
            style={{ "--rule": RULE } as React.CSSProperties}
          >
            <span className="float-left mr-2 text-7xl leading-[0.8]" style={masthead}>
              G
            </span>
            lucose held a placid line through the night, settling around six and a quarter
            millimoles per litre. A long run at oh-six-fourteen drew the curve southward by
            two-point-one before a half-portion of recovery shake closed the parenthesis. Eight per
            cent of the past day was spent below the target band — well within the week's tolerance
            — and seventy-eight per cent was held inside it. The variance coefficient is
            twenty-four, which is to say: ordinary, by the standard of an ordinary Thursday.
          </p>
          <div className="mt-6 grid grid-cols-4 gap-x-6 border-y py-4" style={{ borderColor: INK }}>
            <Headline label="Average" value={`${formatGlucose(today.avg)}`} unit="mmol/L" />
            <Headline label="GMI" value={today.gmi.toFixed(1)} unit="A1c est." />
            <Headline label="In range" value={`${tir.inRange}`} unit="per cent" />
            <Headline label="Readings" value={today.readings.toString()} unit="entries" />
          </div>

          <div
            className="mt-8 border p-5"
            style={{ borderColor: INK, backgroundColor: PAPER_DARK }}
          >
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ ...typewriter, color: ACCENT }}
            >
              Plate Two — The Trace
            </p>
            <h3 className="mt-2 text-2xl italic" style={masthead}>
              The day in profile
            </h3>
            <div className="mt-4 h-44">
              <svg viewBox="0 0 800 180" preserveAspectRatio="none" className="size-full">
                <g stroke={INK} strokeWidth={0.5} strokeOpacity={0.25}>
                  {[3, 4, 6, 8, 10, 12].map((v) => {
                    const y = 180 - ((v - 2) / 12) * 180;
                    return <line key={v} x1={0} x2={800} y1={y} y2={y} strokeDasharray="2 4" />;
                  })}
                </g>
                <rect
                  x={0}
                  y={180 - ((10 - 2) / 12) * 180}
                  width={800}
                  height={((10 - 3.9) / 12) * 180}
                  fill={NAVY}
                  opacity={0.08}
                />
                <path
                  d={glucose.last24h
                    .map((p, i) => {
                      const x = (i / (glucose.last24h.length - 1)) * 800;
                      const y = 180 - ((p.v - 2) / 12) * 180;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={1.4}
                />
              </svg>
            </div>
            <div
              className="mt-2 flex justify-between text-[10px] uppercase tracking-widest"
              style={typewriter}
            >
              <span>06:38</span>
              <span>10:00</span>
              <span>14:00</span>
              <span>18:00</span>
              <span>22:00</span>
              <span>now</span>
            </div>
            <p className="mt-3 text-sm italic" style={{ color: INK, opacity: 0.75 }}>
              "The mid-morning rise is mostly the oat porridge; the late-afternoon dip is the run.
              The rest is more or less metabolism behaving itself." — Editor
            </p>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4">
          <div className="border-2 p-5" style={{ borderColor: INK, backgroundColor: PAPER_DARK }}>
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ ...typewriter, color: ACCENT }}
            >
              The morning's reading
            </p>
            <p
              className="mt-3 leading-[0.85] tracking-tight"
              style={{ ...masthead, fontSize: "clamp(5rem, 9vw, 8rem)" }}
            >
              <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
            </p>
            <p className="mt-2 text-sm uppercase tracking-widest" style={typewriter}>
              mmol/L · stable · in range
            </p>
            <p className="mt-4 text-sm italic leading-relaxed">
              Last reading at{" "}
              <span className="not-italic">{formatClock(Date.now() - 4 * 60 * 1000)}</span>; the
              trend arrow has held flat for the better part of an hour.
            </p>
          </div>

          <div className="mt-6 border-l-4 pl-4" style={{ borderColor: ACCENT }}>
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ ...typewriter, color: ACCENT }}
            >
              Movement Section
            </p>
            <h4 className="mt-2 text-2xl italic" style={masthead}>
              {workout.sport.toLowerCase()} · long
            </h4>
            <p className="text-sm" style={typewriter}>
              {formatDistance(workout.distance)} · {formatDuration(workout.duration)} ·{" "}
              {formatPace(workout.duration, workout.distance)}
            </p>
            <ul className="mt-4 space-y-2 border-t pt-3 text-sm" style={{ borderColor: INK }}>
              <li className="flex justify-between">
                <span>Avg heart rate</span>
                <span className="tabular-nums">{workout.avgHr} bpm</span>
              </li>
              <li className="flex justify-between">
                <span>Strain score</span>
                <span className="tabular-nums">{workout.strain.toFixed(1)}</span>
              </li>
              <li className="flex justify-between">
                <span>Glucose change</span>
                <span className="tabular-nums" style={{ color: ACCENT }}>
                  {workout.glucoseDelta.toFixed(1)} mmol/L
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 border p-5" style={{ borderColor: INK }}>
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ ...typewriter, color: ACCENT }}
            >
              Recovery panel
            </p>
            <p className="mt-2 text-5xl tabular-nums" style={masthead}>
              {recovery.score}
              <span className="text-lg italic">/100</span>
            </p>
            <p className="text-sm" style={typewriter}>
              HRV {recovery.hrv} ms · RHR {recovery.rhr} · slept {recovery.sleep}h
            </p>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-7">
          <p
            className="border-b pb-1 text-xs uppercase tracking-[0.3em]"
            style={{ ...typewriter, borderColor: RULE, color: ACCENT }}
          >
            The Daybook
          </p>
          <h3 className="mt-3 text-4xl italic" style={masthead}>
            Treatments &amp; entries
          </h3>
          <ol className="mt-4 space-y-2 text-sm" style={typewriter}>
            {treatments.slice(0, 9).map((t, i) => (
              <li
                key={t.t}
                className="grid items-baseline gap-3 border-b pb-2"
                style={{ gridTemplateColumns: "30px 60px 80px 1fr auto", borderColor: RULE }}
              >
                <span className="tabular-nums" style={{ color: INK, opacity: 0.5 }}>
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="tabular-nums">{formatClock(t.t)}</span>
                <span className="uppercase" style={{ color: ACCENT }}>
                  {t.kind}
                </span>
                <span style={body}>{t.label}</span>
                <span className="tabular-nums">{t.detail ?? ""}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="col-span-12 lg:col-span-5">
          <p
            className="border-b pb-1 text-xs uppercase tracking-[0.3em]"
            style={{ ...typewriter, borderColor: RULE, color: ACCENT }}
          >
            Weekly Standings
          </p>
          <h3 className="mt-3 text-4xl italic" style={masthead}>
            Time in range
          </h3>
          <table className="mt-4 w-full text-sm" style={typewriter}>
            <thead>
              <tr className="text-left text-xs uppercase" style={{ color: INK, opacity: 0.55 }}>
                <th className="pb-2">Day</th>
                <th className="pb-2">Date</th>
                <th className="pb-2 text-right">In range</th>
                <th className="pb-2 text-right">Avg mmol/L</th>
              </tr>
            </thead>
            <tbody>
              {weeklyTIR.map((d) => (
                <tr key={d.date} className="border-t" style={{ borderColor: RULE }}>
                  <td className="py-2 italic" style={masthead}>
                    {d.weekday}
                  </td>
                  <td className="py-2">{d.date}</td>
                  <td className="py-2 text-right tabular-nums">{d.inRange}%</td>
                  <td className="py-2 text-right tabular-nums">{d.avg.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs italic" style={{ color: INK, opacity: 0.65 }}>
            * The week's range averages 75% — three points above the runner's running mean.
          </p>
        </section>

        <section className="col-span-12">
          <p
            className="border-b pb-1 text-xs uppercase tracking-[0.3em]"
            style={{ ...typewriter, borderColor: RULE, color: ACCENT }}
          >
            Form &amp; Function · Recent Movements
          </p>
          <div
            className="mt-4 grid grid-cols-1 gap-px"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              backgroundColor: INK,
            }}
          >
            {recentWorkouts.map((w) => (
              <article key={w.id} className="p-5" style={{ backgroundColor: PAPER }}>
                <p
                  className="text-xs uppercase tracking-[0.3em]"
                  style={{ ...typewriter, color: ACCENT }}
                >
                  {w.date}
                </p>
                <h4 className="mt-2 text-3xl italic" style={masthead}>
                  {w.sport}
                </h4>
                <p className="text-sm" style={typewriter}>
                  {formatDistance(w.distance)} · {formatPace(w.duration, w.distance)}
                </p>
                <p className="mt-4 text-xs" style={{ ...typewriter, color: ACCENT }}>
                  ΔBG {w.glucoseDelta > 0 ? "+" : ""}
                  {w.glucoseDelta.toFixed(1)} mmol/L
                </p>
              </article>
            ))}
          </div>
        </section>
      </article>

      <footer
        className="border-t-4 px-8 py-4 text-center text-xs uppercase tracking-[0.3em]"
        style={{ ...typewriter, borderColor: INK, backgroundColor: PAPER_DARK }}
      >
        Set in Newsreader &amp; Special Elite · Printed on the open web · &copy; the serene almanac
        · MIT
      </footer>
    </div>
  );
}

function Headline({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.3em]"
        style={{ fontFamily: "var(--font-typewriter)", color: ACCENT }}
      >
        {label}
      </p>
      <p className="mt-1 text-3xl tabular-nums" style={{ fontFamily: "var(--font-display-luxe)" }}>
        {value}
      </p>
      <p
        className="text-xs italic"
        style={{ fontFamily: "var(--font-display-luxe)", color: INK, opacity: 0.6 }}
      >
        {unit}
      </p>
    </div>
  );
}
