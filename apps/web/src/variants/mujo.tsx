import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";

const display = { fontFamily: "var(--font-serif-modern)" } as const;
const serif = { fontFamily: "var(--font-serif-zen)" } as const;
const mono = { fontFamily: "var(--font-mono-data)" } as const;

const PAPER = "#f7f3ec";
const SUMI = "#1a1814";
const RULE = "#1a181430";
const SAKURA = "#c2546c";
const SHIBUI = "#5d6862";

export function MujoVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, weeklyTIR } = mockData;

  return (
    <div className="min-h-dvh" style={{ ...serif, backgroundColor: PAPER, color: SUMI }}>
      <div className="grid lg:grid-cols-[200px_1fr]">
        <aside className="border-r p-8 text-sm" style={{ borderColor: SUMI }}>
          <p className="text-[10px] uppercase tracking-[0.5em]" style={{ ...mono, color: SAKURA }}>
            無常
          </p>
          <h1 className="mt-1 text-3xl italic" style={display}>
            serene
          </h1>

          <div className="mt-12 flex h-px w-8" style={{ backgroundColor: SUMI }} />

          <ul className="mt-8 space-y-5 text-base italic" style={display}>
            {[
              ["今日", "Today"],
              ["流れ", "The trace"],
              ["走る", "Movement"],
              ["眠り", "Sleep"],
              ["食事", "Treatments"],
              ["記録", "Records"],
            ].map(([jp, en], i) => (
              <li key={en} className="leading-tight">
                <p className="text-2xl" style={{ color: i === 0 ? SAKURA : SUMI }}>
                  {jp}
                </p>
                <p
                  className="text-xs uppercase tracking-[0.32em]"
                  style={{ ...mono, color: SHIBUI }}
                >
                  {en}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-16 text-xs italic leading-relaxed" style={{ color: SHIBUI }}>
            "Nothing remains, nothing is finished, nothing is perfect."
            <br />— wabi · sabi · suki
          </div>
        </aside>

        <main className="p-12 lg:p-20">
          <header className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-[0.5em]" style={{ ...mono, color: SHIBUI }}>
              木曜日 · Thursday · 7 May
            </p>
            <p className="text-xs uppercase tracking-[0.5em]" style={{ ...mono, color: SAKURA }}>
              ✿ 一日 · one day
            </p>
          </header>

          <section className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.5em]" style={{ ...mono, color: SAKURA }}>
                glucose · 血糖
              </p>
              <h2
                className="mt-6 leading-[0.9] tracking-tight italic"
                style={{ ...display, fontSize: "clamp(7rem, 18vw, 17rem)" }}
              >
                <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
                <span className="text-2xl not-italic align-top opacity-60" style={mono}>
                  {"  "}mmol/L
                </span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-[1.7]" style={serif}>
                A morning of <span style={{ color: SAKURA }}>uneventful breath</span>. The line
                walked between breakfast and the run, returned, and is now resting.
              </p>
            </div>

            <aside className="lg:col-span-5 lg:border-l lg:pl-12" style={{ borderColor: SUMI }}>
              <p className="text-xs uppercase tracking-[0.5em]" style={{ ...mono, color: SAKURA }}>
                図 — fig. 1
              </p>
              <h3 className="mt-3 italic" style={{ ...display, fontSize: "2rem" }}>
                The trace, twenty-four hours.
              </h3>
              <div className="mt-6 h-48">
                <svg viewBox="0 0 600 180" preserveAspectRatio="none" className="size-full">
                  <line
                    x1={0}
                    x2={600}
                    y1={180 - ((3.9 - 2) / 12) * 180}
                    y2={180 - ((3.9 - 2) / 12) * 180}
                    stroke={SUMI}
                    strokeOpacity={0.25}
                    strokeDasharray="2 4"
                  />
                  <line
                    x1={0}
                    x2={600}
                    y1={180 - ((10 - 2) / 12) * 180}
                    y2={180 - ((10 - 2) / 12) * 180}
                    stroke={SUMI}
                    strokeOpacity={0.25}
                    strokeDasharray="2 4"
                  />
                  <path
                    d={glucose.last24h
                      .map((p, i) => {
                        const x = (i / (glucose.last24h.length - 1)) * 600;
                        const y = 180 - ((p.v - 2) / 12) * 180;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke={SUMI}
                    strokeWidth={1}
                  />
                </svg>
              </div>
              <div
                className="mt-3 flex justify-between text-[10px] uppercase tracking-widest"
                style={{ ...mono, color: SHIBUI }}
              >
                <span>夜 · night</span>
                <span>朝 · morning</span>
                <span>今 · now</span>
              </div>
            </aside>
          </section>

          <hr className="my-20" style={{ borderColor: RULE }} />

          <section className="grid gap-12 lg:grid-cols-4">
            <Stat label="一" en="In range" value={`${tir.inRange}`} unit="per cent · 24h" />
            <Stat label="二" en="Average" value={formatGlucose(today.avg)} unit="mmol per litre" />
            <Stat label="三" en="Variance" value={`${today.cv}%`} unit="cv" />
            <Stat label="四" en="Readings" value={today.readings.toString()} unit="entries" />
          </section>

          <hr className="my-20" style={{ borderColor: RULE }} />

          <section className="grid gap-16 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.5em]" style={{ ...mono, color: SAKURA }}>
                走る · the run
              </p>
              <h3 className="mt-4 text-5xl italic leading-[1]" style={display}>
                Fourteen kilometres before the city woke.
              </h3>
              <p className="mt-6 max-w-prose text-base leading-relaxed">
                {formatDistance(workout.distance)} at{" "}
                {formatPace(workout.duration, workout.distance)}. The glucose curve dipped from{" "}
                {formatGlucose(7.6)} to {formatGlucose(5.5)} between kilometres seven and eleven,
                then returned to its quiet line.
              </p>
              <div
                className="mt-8 grid grid-cols-2 gap-x-12 gap-y-3 border-t pt-6 text-sm"
                style={{ borderColor: SUMI }}
              >
                <KV label="Time" value={formatDuration(workout.duration)} />
                <KV label="Pace" value={formatPace(workout.duration, workout.distance)} />
                <KV label="Avg HR" value={`${workout.avgHr} bpm`} />
                <KV label="Strain" value={workout.strain.toFixed(1)} />
                <KV label="ΔBG" value={`${workout.glucoseDelta.toFixed(1)} mmol`} accent={SAKURA} />
                <KV label="Recovery" value={`${recovery.score}/100`} />
              </div>
            </article>

            <article className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.5em]" style={{ ...mono, color: SAKURA }}>
                週 · the week
              </p>
              <div className="mt-6 grid grid-cols-7 gap-1 lg:gap-2">
                {weeklyTIR.map((d) => {
                  const intensity = d.inRange / 100;
                  return (
                    <div key={d.date} className="flex flex-col items-center gap-2">
                      <div
                        className="aspect-square w-full"
                        style={{
                          backgroundColor: SAKURA,
                          opacity: 0.15 + intensity * 0.7,
                        }}
                      />
                      <p className="text-[10px] tabular-nums" style={{ ...mono, color: SHIBUI }}>
                        {d.weekday[0]}
                      </p>
                      <p className="text-[10px] tabular-nums" style={mono}>
                        {d.inRange}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm italic leading-relaxed" style={{ color: SHIBUI }}>
                Seven days, plotted as opacity. The eye prefers averages; the body keeps notes.
              </p>
            </article>
          </section>

          <hr className="my-20" style={{ borderColor: RULE }} />

          <section>
            <p className="text-xs uppercase tracking-[0.5em]" style={{ ...mono, color: SAKURA }}>
              記録 · records
            </p>
            <h3 className="mt-3 text-3xl italic" style={display}>
              Recent movements
            </h3>
            <ol className="mt-6 divide-y" style={{ borderColor: SUMI }}>
              {recentWorkouts.map((w, i) => (
                <li
                  key={w.id}
                  className="grid items-baseline gap-6 py-5 text-sm"
                  style={{ gridTemplateColumns: "40px 100px 1fr auto auto", borderColor: RULE }}
                >
                  <span
                    className="text-2xl tabular-nums italic"
                    style={{ ...display, color: SAKURA }}
                  >
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span style={{ ...mono, color: SHIBUI }}>{w.date}</span>
                  <span className="text-2xl italic" style={display}>
                    {w.sport.toLowerCase()}
                    {w.distance ? ` · ${formatDistance(w.distance)}` : ""}
                  </span>
                  <span style={mono}>{formatPace(w.duration, w.distance)}</span>
                  <span
                    className="tabular-nums"
                    style={{ ...mono, color: w.glucoseDelta < 0 ? SAKURA : SUMI }}
                  >
                    Δ {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <footer
            className="mt-32 flex items-baseline justify-between border-t pt-6 text-xs uppercase tracking-[0.5em]"
            style={{ ...mono, borderColor: SUMI, color: SHIBUI }}
          >
            <span>set in fraunces · cormorant · plex mono</span>
            <span style={{ color: SAKURA }}>春 · MAY MMXXVI</span>
            <span>fin</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Stat({
  label,
  en,
  value,
  unit,
}: {
  label: string;
  en: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <p className="text-2xl italic" style={{ ...display, color: SAKURA }}>
        {label}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.4em]" style={{ ...mono, color: SHIBUI }}>
        {en}
      </p>
      <p className="mt-2 text-5xl tabular-nums italic" style={display}>
        {value}
      </p>
      <p className="text-xs italic" style={{ color: SHIBUI }}>
        {unit}
      </p>
    </div>
  );
}

function KV({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.4em]" style={{ ...mono, color: SHIBUI }}>
        {label}
      </p>
      <p className="mt-1 italic tabular-nums" style={{ color: accent ?? "inherit" }}>
        {value}
      </p>
    </div>
  );
}
