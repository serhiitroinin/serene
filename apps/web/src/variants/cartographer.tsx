import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";
import { RouteMap } from "./route-map";

const data = { fontFamily: "var(--font-mono-data)" } as const;
const hand = { fontFamily: "var(--font-script-hand)" } as const;
const serif = { fontFamily: "var(--font-serif-editorial)" } as const;

const PAPER = "#f3eadb";
const PAPER_DEEP = "#e7d8b9";
const KRAFT = "#c8b692";
const INK = "#2a2419";
const FOREST = "#3a5a40";
const BRICK = "#9b2a2a";

export function CartographerVariant() {
  const { glucose, today, recovery, workout, route, weeklyTIR, treatments } = mockData;

  return (
    <div className="min-h-dvh" style={{ ...serif, backgroundColor: PAPER, color: INK }}>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 opacity-50 mix-blend-multiply"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2" /></filter><rect width="60" height="60" filter="url(%23n)" opacity="0.18"/></svg>\')',
        }}
      />

      <div className="relative grid" style={{ gridTemplateColumns: "260px 1fr" }}>
        <aside
          className="sticky top-0 h-dvh border-r-2 px-6 py-8"
          style={{ borderColor: INK, backgroundColor: PAPER_DEEP }}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-3xl" style={{ ...hand, color: BRICK }}>
              S
            </span>
            <h1 className="text-xs uppercase tracking-[0.3em]" style={data}>
              SERENE / FIELD LOG
            </h1>
          </div>

          <div
            className="mt-2 text-xs uppercase tracking-widest"
            style={{ ...data, color: FOREST }}
          >
            52°22'N · 4°53'E · ALT 2m
          </div>

          <div className="mt-8 border-y-2 py-4" style={{ borderColor: INK }}>
            <p
              className="text-[10px] uppercase tracking-[0.32em]"
              style={{ ...data, color: BRICK }}
            >
              Today's expedition
            </p>
            <p className="mt-2 text-3xl" style={{ ...hand, color: INK }}>
              14.2 km loop
            </p>
            <p className="text-xs" style={data}>
              06:14 — 07:44
            </p>
          </div>

          <ul className="mt-6 space-y-3 text-sm uppercase tracking-wider" style={data}>
            {[
              ["I.", "Today", true],
              ["II.", "The trace", false],
              ["III.", "Routes", false],
              ["IV.", "Sleep & rest", false],
              ["V.", "Treatments", false],
              ["VI.", "Field notes", false],
              ["VII.", "Companions", false],
            ].map(([num, label, active]) => (
              <li
                key={label as string}
                className="flex items-baseline gap-3"
                style={{ color: active ? BRICK : INK }}
              >
                <span className="tabular-nums" style={{ color: FOREST }}>
                  {num}
                </span>
                <span style={{ textDecoration: active ? "underline" : "none" }}>{label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-sm border-2 border-dashed p-3" style={{ borderColor: INK }}>
            <p
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ ...data, color: FOREST }}
            >
              Compass · ⌖
            </p>
            <p className="mt-2 text-base italic leading-snug" style={serif}>
              "All who wander are not lost — but a few of them have type 1."
            </p>
            <p className="mt-2 text-xs" style={hand}>
              — J.R.R. (apocryphal)
            </p>
          </div>
        </aside>

        <main className="px-12 py-10">
          <header
            className="flex items-baseline justify-between border-b-2 pb-4"
            style={{ borderColor: INK }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.4em]" style={{ ...data, color: BRICK }}>
                Folio I — Today
              </p>
              <h2 className="mt-2 text-5xl italic leading-tight" style={serif}>
                A morning's reading, with one fourteen-kilometre digression.
              </h2>
            </div>
            <div className="text-right text-xs uppercase tracking-widest" style={data}>
              <p style={{ color: FOREST }}>Plate I — VII</p>
              <p style={{ color: INK, opacity: 0.7 }}>Drawn from observation</p>
            </div>
          </header>

          <section className="mt-10 grid gap-10 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <p
                className="text-[10px] uppercase tracking-[0.4em]"
                style={{ ...data, color: FOREST }}
              >
                Plate I — Topographic route
              </p>
              <div
                className="relative mt-3 aspect-[16/9] overflow-hidden border-2"
                style={{ borderColor: INK, color: KRAFT, backgroundColor: PAPER_DEEP }}
              >
                <RouteMap
                  route={route}
                  variant="paper"
                  className="absolute inset-0 size-full"
                  showGlucoseGradient
                />
                <div
                  className="absolute left-3 top-3 rotate-[-3deg] rounded-sm bg-white/80 px-2 py-1 text-[10px] uppercase tracking-widest"
                  style={data}
                >
                  scale 1 : 25 000
                </div>
                <div
                  className="absolute bottom-3 right-3 flex items-baseline gap-2 text-xs"
                  style={data}
                >
                  <span style={{ color: FOREST }}>N ↑</span>
                  <span style={{ color: INK, opacity: 0.7 }}>· hand-drawn from GPX</span>
                </div>
                <div
                  className="absolute bottom-3 left-3 max-w-[65%] text-xs italic leading-snug"
                  style={hand}
                >
                  km 7 — 11: glucose dipped to 5.5; recovery shake at finish.
                </div>
              </div>
              <div
                className="mt-5 grid grid-cols-4 gap-6 border-t-2 pt-4"
                style={{ borderColor: INK }}
              >
                <Mini label="Distance" value={formatDistance(workout.distance)} />
                <Mini label="Time" value={formatDuration(workout.duration)} />
                <Mini label="Pace" value={formatPace(workout.duration, workout.distance)} />
                <Mini
                  label="ΔBG"
                  value={`${workout.glucoseDelta.toFixed(1)} mmol`}
                  accent={BRICK}
                />
              </div>
            </article>

            <aside className="lg:col-span-5">
              <p
                className="text-[10px] uppercase tracking-[0.4em]"
                style={{ ...data, color: FOREST }}
              >
                Plate II — Glucose · current
              </p>
              <div
                className="mt-3 border-2 p-6"
                style={{ borderColor: INK, backgroundColor: PAPER_DEEP }}
              >
                <p className="text-7xl tabular-nums leading-none" style={{ ...serif, color: INK }}>
                  {formatGlucose(glucose.current)}
                </p>
                <p
                  className="mt-2 text-xs uppercase tracking-[0.4em]"
                  style={{ ...data, color: BRICK }}
                >
                  mmol/L · stable · in range
                </p>
                <hr className="my-4" style={{ borderColor: INK }} />
                <ul className="space-y-1 text-sm" style={data}>
                  <li className="flex justify-between">
                    <span style={{ color: FOREST }}>Average · 24h</span>
                    <span className="tabular-nums">{formatGlucose(today.avg)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span style={{ color: FOREST }}>GMI</span>
                    <span className="tabular-nums">{today.gmi.toFixed(1)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span style={{ color: FOREST }}>Std deviation</span>
                    <span className="tabular-nums">{today.sd.toFixed(1)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span style={{ color: FOREST }}>Coefficient of variation</span>
                    <span className="tabular-nums">{today.cv}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span style={{ color: FOREST }}>Readings</span>
                    <span className="tabular-nums">{today.readings}</span>
                  </li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic" style={hand}>
                A flat morning, drifted by exercise, restored by oats.
              </p>
            </aside>
          </section>

          <section className="mt-16">
            <p
              className="text-[10px] uppercase tracking-[0.4em]"
              style={{ ...data, color: FOREST }}
            >
              Plate III — Twenty-four hours, charted
            </p>
            <div
              className="mt-3 border-2 p-6"
              style={{ borderColor: INK, backgroundColor: PAPER_DEEP }}
            >
              <div className="h-48">
                <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="size-full">
                  <g stroke={KRAFT} strokeWidth={0.6}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line
                        key={`gv${i}`}
                        x1={(i + 1) * (1000 / 13)}
                        x2={(i + 1) * (1000 / 13)}
                        y1={0}
                        y2={200}
                      />
                    ))}
                    {[3, 6, 8, 10, 12].map((v) => {
                      const y = 200 - ((v - 2) / 12) * 200;
                      return (
                        <line key={`gh${v}`} x1={0} x2={1000} y1={y} y2={y} strokeDasharray="2 4" />
                      );
                    })}
                  </g>
                  <rect
                    x={0}
                    y={200 - ((10 - 2) / 12) * 200}
                    width={1000}
                    height={((10 - 3.9) / 12) * 200}
                    fill={FOREST}
                    opacity={0.08}
                  />
                  <path
                    d={glucose.last24h
                      .map((p, i) => {
                        const x = (i / (glucose.last24h.length - 1)) * 1000;
                        const y = 200 - ((p.v - 2) / 12) * 200;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke={BRICK}
                    strokeWidth={1.4}
                  />
                </svg>
              </div>
              <div
                className="mt-3 flex justify-between text-[10px] uppercase tracking-widest"
                style={{ ...data, color: FOREST }}
              >
                <span>06:38</span>
                <span>10:00</span>
                <span>14:00</span>
                <span>18:00</span>
                <span>22:00</span>
                <span>now</span>
              </div>
            </div>
          </section>

          <section className="mt-16 grid gap-8 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <p
                className="text-[10px] uppercase tracking-[0.4em]"
                style={{ ...data, color: FOREST }}
              >
                Plate IV — Field notebook
              </p>
              <ol
                className="mt-3 space-y-2 border-2 p-5"
                style={{ ...data, borderColor: INK, backgroundColor: PAPER_DEEP }}
              >
                {treatments.slice(0, 8).map((t, i) => (
                  <li
                    key={t.t}
                    className="grid items-baseline gap-3 border-b border-dashed pb-1.5 text-sm"
                    style={{ gridTemplateColumns: "30px 60px 80px 1fr auto", borderColor: INK }}
                  >
                    <span className="tabular-nums" style={{ color: FOREST }}>
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="tabular-nums">
                      {new Date(t.t).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="uppercase" style={{ color: BRICK }}>
                      {t.kind}
                    </span>
                    <span style={hand}>{t.label}</span>
                    <span className="tabular-nums" style={{ color: INK, opacity: 0.7 }}>
                      {t.detail ?? ""}
                    </span>
                  </li>
                ))}
              </ol>
            </article>

            <aside className="lg:col-span-5">
              <p
                className="text-[10px] uppercase tracking-[0.4em]"
                style={{ ...data, color: FOREST }}
              >
                Plate V — Weekly altitudes
              </p>
              <div
                className="mt-3 border-2 p-5"
                style={{ borderColor: INK, backgroundColor: PAPER_DEEP }}
              >
                <div className="flex items-end gap-2 h-32">
                  {weeklyTIR.map((d) => (
                    <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full"
                        style={{
                          height: `${d.inRange}%`,
                          backgroundColor: BRICK,
                          opacity: 0.45 + (d.inRange / 100) * 0.5,
                        }}
                      />
                      <span className="text-[10px] uppercase" style={{ ...data, color: FOREST }}>
                        {d.weekday[0]}
                      </span>
                      <span className="text-[10px] tabular-nums" style={data}>
                        {d.inRange}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs italic" style={{ ...hand, color: INK }}>
                  altitude here is metaphor — % time inside the band, day by day.
                </p>
              </div>

              <div
                className="mt-6 border-2 p-5"
                style={{ borderColor: INK, backgroundColor: PAPER_DEEP }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.4em]"
                  style={{ ...data, color: FOREST }}
                >
                  Plate VI — Crew
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li
                    className="flex items-baseline justify-between border-b border-dashed pb-1"
                    style={{ borderColor: INK }}
                  >
                    <span style={hand}>Recovery</span>
                    <span className="tabular-nums" style={data}>
                      {recovery.score} / 100
                    </span>
                  </li>
                  <li
                    className="flex items-baseline justify-between border-b border-dashed pb-1"
                    style={{ borderColor: INK }}
                  >
                    <span style={hand}>HRV</span>
                    <span className="tabular-nums" style={data}>
                      {recovery.hrv} ms
                    </span>
                  </li>
                  <li
                    className="flex items-baseline justify-between border-b border-dashed pb-1"
                    style={{ borderColor: INK }}
                  >
                    <span style={hand}>Resting heart</span>
                    <span className="tabular-nums" style={data}>
                      {recovery.rhr} bpm
                    </span>
                  </li>
                  <li className="flex items-baseline justify-between">
                    <span style={hand}>Sleep</span>
                    <span className="tabular-nums" style={data}>
                      {recovery.sleep} h
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </section>

          <footer
            className="mt-20 flex items-baseline justify-between border-t-2 pt-4 text-xs uppercase tracking-widest"
            style={{ ...data, borderColor: INK }}
          >
            <span style={{ color: FOREST }}>Plate VII — Continued p. 8</span>
            <span style={hand}>plotted by hand · MAY · MMXXVI</span>
            <span style={{ color: BRICK }}>FIELD LOG · serene</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.4em]" style={{ ...data, color: FOREST }}>
        {label}
      </p>
      <p className="mt-1 text-lg tabular-nums" style={{ ...serif, color: accent ?? INK }}>
        {value}
      </p>
    </div>
  );
}
