import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";
import { RouteMap } from "./route-map";

const display = { fontFamily: "var(--font-display-luxe)" } as const;
const serif = { fontFamily: "var(--font-serif-zen)" } as const;
const mono = { fontFamily: "var(--font-mono-data)" } as const;

const BONE = "#f3eee5";
const BONE_DEEP = "#ece5d6";
const INK = "#1c150f";
const OXBLOOD = "#5d1a1a";
const GOLD = "#a07f3f";

export function AtelierVariant() {
  const { glucose, tir, recovery, workout, recentWorkouts, route } = mockData;

  return (
    <div className="min-h-dvh" style={{ backgroundColor: BONE, color: INK }}>
      <header className="border-b" style={{ borderColor: INK }}>
        <div
          className="mx-auto flex max-w-[1280px] items-baseline justify-between px-12 py-6 text-xs uppercase tracking-[0.4em]"
          style={mono}
        >
          <span style={{ color: OXBLOOD }}>Maison Serene</span>
          <span>Édition · Mai · MMXXVI</span>
          <span>Couture &middot; nº 04</span>
        </div>
        <div className="mx-auto flex max-w-[1280px] items-baseline justify-between px-12 pb-10">
          <h1
            className="leading-[0.85] tracking-[-0.02em]"
            style={{ ...display, fontSize: "clamp(5rem, 11vw, 11rem)" }}
          >
            <span className="italic">serene</span>
            <span className="text-2xl align-top opacity-50" style={mono}>
              {" "}
              / atelier
            </span>
          </h1>
          <nav
            className="hidden items-baseline gap-6 text-sm uppercase tracking-[0.3em] lg:flex"
            style={mono}
          >
            <span style={{ color: OXBLOOD }}>Aujourd'hui</span>
            <span>Carnet</span>
            <span>Étoffe</span>
            <span>Plan</span>
            <span>Studio</span>
          </nav>
        </div>
        <div
          className="mx-auto flex max-w-[1280px] items-baseline justify-between border-t px-12 py-3 text-xs uppercase tracking-[0.4em]"
          style={{ ...mono, borderColor: INK }}
        >
          <span>Pages 02 — 09</span>
          <span style={{ color: GOLD }}>Glucose · Mouvement · Sommeil</span>
          <span>Édition Limitée</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-12 pb-20 pt-12">
        <section className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.4em]" style={{ ...mono, color: OXBLOOD }}>
              Cover · pp. 02
            </p>
            <h2 className="mt-4 text-6xl leading-[1.05]" style={display}>
              <span className="italic">"a glucose,</span> a quiet morning, a long run before the
              city wakes."
            </h2>
            <p className="mt-6 max-w-prose text-lg leading-relaxed" style={serif}>
              The morning held its line. Six-point-eight millimoles, by the way, is the colour of a
              very pale tea. Time-in-range posted seventy-eight per cent across the day, which is
              not a record so much as an old friend. The run went south by two-point-one mmol/L
              between kilometres seven and eleven; a recovery shake of fifty-five grammes
              carbohydrate righted the curve before lunch. "Couture for the metabolism," as it were.
            </p>
            <div
              className="mt-8 grid grid-cols-3 gap-x-10 border-t border-b py-6"
              style={{ borderColor: INK }}
            >
              <Stat
                label="Glucose à present"
                value={formatGlucose(glucose.current)}
                unit="mmol/L"
              />
              <Stat label="Temps en gamme" value={`${tir.inRange}`} unit="pour cent" />
              <Stat label="Récupération" value={`${recovery.score}`} unit="sur 100" />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:pl-8 lg:border-l" style={{ borderColor: INK }}>
            <div className="border" style={{ borderColor: INK }}>
              <div
                className="aspect-[4/5] w-full overflow-hidden"
                style={{ backgroundColor: BONE_DEEP, color: OXBLOOD }}
              >
                <svg viewBox="0 0 400 500" className="size-full" aria-hidden="true">
                  <defs>
                    <pattern id="atelier-noise" width="3" height="3" patternUnits="userSpaceOnUse">
                      <circle cx="1.5" cy="1.5" r="0.4" fill={INK} opacity="0.18" />
                    </pattern>
                  </defs>
                  <rect width="400" height="500" fill="url(#atelier-noise)" />
                  <g transform="translate(200, 250)">
                    <circle
                      r="180"
                      fill="none"
                      stroke={OXBLOOD}
                      strokeWidth={0.6}
                      strokeDasharray="2 6"
                    />
                    <circle r="120" fill="none" stroke={OXBLOOD} strokeWidth={0.6} />
                    <circle r="60" fill={OXBLOOD} opacity={0.1} />
                    <text
                      textAnchor="middle"
                      y="-200"
                      fontSize="14"
                      fill={INK}
                      style={mono}
                      letterSpacing="0.3em"
                    >
                      MAI 7
                    </text>
                    <g style={{ ...display, fontSize: 96 }} fill={INK}>
                      <text textAnchor="middle" y="20">
                        {formatGlucose(glucose.current)}
                      </text>
                    </g>
                    <text
                      textAnchor="middle"
                      y="60"
                      fontSize="14"
                      fill={OXBLOOD}
                      style={mono}
                      letterSpacing="0.4em"
                    >
                      MMOL · L⁻¹
                    </text>
                  </g>
                </svg>
              </div>
              <p
                className="border-t px-4 py-3 text-xs uppercase tracking-[0.4em]"
                style={{ ...mono, borderColor: INK }}
              >
                Plate I &nbsp;·&nbsp; le portrait du matin
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-20 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <p className="text-xs uppercase tracking-[0.4em]" style={{ ...mono, color: OXBLOOD }}>
              The trace · Plate II
            </p>
            <h3 className="mt-3 text-5xl italic" style={display}>
              Twenty-four hours, seen as a single line.
            </h3>
            <div className="mt-6 h-56 border" style={{ borderColor: INK }}>
              <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="size-full">
                <rect
                  x={0}
                  y={200 - ((10 - 2) / 12) * 200}
                  width={1200}
                  height={((10 - 3.9) / 12) * 200}
                  fill={GOLD}
                  opacity={0.08}
                />
                <path
                  d={glucose.last24h
                    .map((p, i) => {
                      const x = (i / (glucose.last24h.length - 1)) * 1200;
                      const y = 200 - ((p.v - 2) / 12) * 200;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke={INK}
                  strokeWidth={1}
                />
              </svg>
            </div>
            <div
              className="mt-3 flex justify-between text-xs uppercase tracking-[0.4em]"
              style={mono}
            >
              <span>06:38</span>
              <span style={{ color: OXBLOOD }}>noon</span>
              <span>22:00</span>
              <span>now</span>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <article className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.4em]" style={{ ...mono, color: OXBLOOD }}>
              Atelier · pp. 06
            </p>
            <h3 className="mt-3 text-5xl italic" style={display}>
              The route, in chiffon.
            </h3>
            <p className="mt-4 max-w-prose leading-relaxed" style={serif}>
              The {formatDistance(workout.distance)} long run, taken before sunrise, traced the
              river twice and the bridge once. The glucose curve, when laid over the line, reads
              like an embroidered hem.
            </p>
            <div
              className="relative mt-6 aspect-[16/9] overflow-hidden border"
              style={{ borderColor: INK, color: OXBLOOD, backgroundColor: BONE_DEEP }}
            >
              <RouteMap
                route={route}
                variant="paper"
                className="absolute inset-0 size-full"
                showGlucoseGradient
              />
              <p
                className="absolute right-4 top-4 text-xs uppercase tracking-[0.4em]"
                style={{ ...mono, color: INK }}
              >
                Plate III
              </p>
            </div>
            <div
              className="mt-6 grid grid-cols-4 gap-6 border-t pt-6 text-sm"
              style={{ borderColor: INK, ...serif }}
            >
              <Detail label="Distance" value={formatDistance(workout.distance)} />
              <Detail label="Allure" value={formatPace(workout.duration, workout.distance)} />
              <Detail label="Coeur" value={`${workout.avgHr} bpm`} />
              <Detail
                label="Glucose Δ"
                value={`${workout.glucoseDelta.toFixed(1)} mmol`}
                accent={OXBLOOD}
              />
            </div>
          </article>

          <article className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.4em]" style={{ ...mono, color: OXBLOOD }}>
              Garde-robe · selection
            </p>
            <h3 className="mt-3 text-4xl italic" style={display}>
              Recent efforts, curated.
            </h3>
            <ol className="mt-6 space-y-5">
              {recentWorkouts.slice(0, 4).map((w, i) => (
                <li
                  key={w.id}
                  className="grid items-baseline gap-4 border-b pb-4"
                  style={{ gridTemplateColumns: "auto 1fr auto", borderColor: INK }}
                >
                  <span
                    className="text-3xl italic tabular-nums"
                    style={{ ...display, color: OXBLOOD }}
                  >
                    nº {i + 1}
                  </span>
                  <div>
                    <p className="text-2xl italic" style={display}>
                      {w.sport}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em]" style={mono}>
                      {w.date} · {formatDistance(w.distance)} · {formatDuration(w.duration)}
                    </p>
                  </div>
                  <span
                    className="tabular-nums"
                    style={{ ...mono, color: w.glucoseDelta < 0 ? OXBLOOD : INK }}
                  >
                    Δ {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </span>
                </li>
              ))}
            </ol>
          </article>
        </section>

        <section
          className="mt-20 grid gap-12 border-t pt-12 lg:grid-cols-12"
          style={{ borderColor: INK }}
        >
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.4em]" style={{ ...mono, color: OXBLOOD }}>
              Sommeil
            </p>
            <p className="mt-3 text-7xl tabular-nums italic" style={display}>
              {recovery.sleep}h
            </p>
            <p className="mt-1 text-sm" style={serif}>
              From {recovery.score >= 70 ? "ample" : "decent"} sleep, a respectable recovery score
              of {recovery.score} out of one hundred.
            </p>
          </div>
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.4em]" style={{ ...mono, color: OXBLOOD }}>
              Coeur
            </p>
            <p className="mt-3 text-7xl tabular-nums italic" style={display}>
              {recovery.hrv}
            </p>
            <p className="mt-1 text-sm" style={serif}>
              ms of variability — the most candid line in any cardiogram.
            </p>
          </div>
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.4em]" style={{ ...mono, color: OXBLOOD }}>
              Repos
            </p>
            <p className="mt-3 text-7xl tabular-nums italic" style={display}>
              {recovery.rhr}
            </p>
            <p className="mt-1 text-sm" style={serif}>
              bpm at rest. Not low for the calendar, but punctual for the runner.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t" style={{ borderColor: INK }}>
        <div
          className="mx-auto flex max-w-[1280px] items-baseline justify-between px-12 py-6 text-xs uppercase tracking-[0.4em]"
          style={mono}
        >
          <span>Set in Playfair Display · Cormorant Garamond · IBM Plex Mono</span>
          <span style={{ color: OXBLOOD }}>To be continued · pp. 10</span>
          <span>FIN</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p
        className="text-xs uppercase tracking-[0.4em]"
        style={{ fontFamily: "var(--font-mono-data)", color: OXBLOOD }}
      >
        {label}
      </p>
      <p className="mt-2 text-5xl tabular-nums" style={{ fontFamily: "var(--font-display-luxe)" }}>
        {value}
      </p>
      <p
        className="text-sm italic"
        style={{ fontFamily: "var(--font-serif-zen)", color: INK, opacity: 0.6 }}
      >
        {unit}
      </p>
    </div>
  );
}

function Detail({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.4em]"
        style={{ fontFamily: "var(--font-mono-data)" }}
      >
        {label}
      </p>
      <p className="mt-1 italic tabular-nums" style={{ color: accent ?? "inherit" }}>
        {value}
      </p>
    </div>
  );
}
