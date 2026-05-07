import { formatDistance, formatDuration, formatGlucose, formatPace, mockData } from "./shared";
import { Sparkline } from "./sparkline";

const massive = { fontFamily: "var(--font-display-massive)" } as const;
const cond = { fontFamily: "var(--font-condensed-light)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const body = { fontFamily: "var(--font-body-soft)" } as const;

const COLORS = {
  bg: "#1a1a1a",
  paper: "#2a2a2a",
  ink: "#f4f4f0",
  acid: "#c2ff00",
  blood: "#ff3a2d",
  rust: "#d97338",
};

export function BrutalistVariant() {
  const { glucose, tir, today, recovery, workout, recentWorkouts, treatments } = mockData;

  return (
    <div className="min-h-dvh" style={{ ...body, backgroundColor: COLORS.bg, color: COLORS.ink }}>
      <div className="grid" style={{ gridTemplateColumns: "260px 1fr" }}>
        <aside
          className="sticky top-0 flex h-dvh flex-col justify-between border-r p-6"
          style={{ borderColor: COLORS.ink, backgroundColor: COLORS.paper }}
        >
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.3em]"
              style={{ ...mono, color: COLORS.acid }}
            >
              SRN — 052026
            </p>
            <h2 className="mt-3 text-5xl leading-[0.85]" style={massive}>
              SERENE
              <br />
              /Σ
            </h2>

            <ul className="mt-10 space-y-1 text-2xl uppercase" style={cond}>
              <Nav label="Today" active />
              <Nav label="Glucose" />
              <Nav label="Activity" />
              <Nav label="Recovery" />
              <Nav label="Treatments" />
              <Nav label="Reports" />
              <Nav label="Sources" />
              <Nav label="Share" />
            </ul>
          </div>

          <div
            className="space-y-4 border-t pt-4 text-xs uppercase"
            style={{ borderColor: COLORS.ink }}
          >
            <div className="flex justify-between" style={mono}>
              <span>SENSOR</span>
              <span style={{ color: COLORS.acid }}>● ON</span>
            </div>
            <div className="flex justify-between" style={mono}>
              <span>BATTERY</span>
              <span>74%</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: COLORS.ink, opacity: 0.6 }}>
              READ: NOTHING IN THIS APPLICATION CONSTITUTES MEDICAL ADVICE. INFORMATIONAL ONLY.
            </p>
          </div>
        </aside>

        <main className="flex flex-col">
          <header
            className="flex items-baseline justify-between border-b px-10 py-6 uppercase"
            style={{ borderColor: COLORS.ink, ...mono }}
          >
            <span className="text-xs tracking-widest">{"// W18.D04 / 14:38 LOCAL"}</span>
            <span className="text-xs tracking-widest" style={{ color: COLORS.acid }}>
              IN RANGE FOR 03:42:11
            </span>
          </header>

          <section
            className="grid border-b"
            style={{ gridTemplateColumns: "1.2fr 1fr", borderColor: COLORS.ink }}
          >
            <div
              className="flex flex-col justify-between border-r p-10"
              style={{ borderColor: COLORS.ink }}
            >
              <p
                className="text-xs uppercase tracking-[0.32em]"
                style={{ ...mono, color: COLORS.acid }}
              >
                CURRENT · MMOL/L
              </p>
              <div>
                <p
                  className="leading-[0.78] tracking-tighter"
                  style={{ ...massive, fontSize: "clamp(8rem, 18vw, 18rem)" }}
                >
                  {formatGlucose(glucose.current)}
                </p>
                <p className="mt-3 text-2xl uppercase" style={cond}>
                  STABLE · TARGET BAND HOLDING
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm uppercase" style={mono}>
                <Bigstat label="TIR" value={`${tir.inRange}%`} accent={COLORS.acid} />
                <Bigstat label="GMI" value={today.gmi.toFixed(1)} accent={COLORS.acid} />
                <Bigstat label="CV" value={`${today.cv}%`} accent={COLORS.acid} />
              </div>
            </div>

            <div className="flex flex-col p-10">
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ ...mono, color: COLORS.acid }}
              >
                24H
              </p>
              <div className="mt-4 flex-1">
                <Sparkline
                  data={glucose.last24h}
                  width={600}
                  height={260}
                  showRangeBand
                  strokeColor={COLORS.acid}
                  bandColor={COLORS.acid}
                  className="size-full"
                />
              </div>
              <div
                className="mt-4 flex justify-between border-t pt-3 text-xs uppercase tabular-nums"
                style={{ ...mono, borderColor: COLORS.ink }}
              >
                <span>−24h · 06:38</span>
                <span>{tir.inRange}% inside the band</span>
                <span>now · 14:38</span>
              </div>
            </div>
          </section>

          <section
            className="grid border-b"
            style={{ gridTemplateColumns: "1fr 1fr 1fr", borderColor: COLORS.ink }}
          >
            <BrutCard
              eyebrow="RECOVERY"
              big={`${recovery.score}`}
              sub={`HRV ${recovery.hrv} · RHR ${recovery.rhr} · ${recovery.sleep}H SLEEP`}
              accent={COLORS.acid}
              borderColor={COLORS.ink}
            />
            <BrutCard
              eyebrow="STRAIN"
              big={recovery.strain.toFixed(1)}
              sub={`AVG HR ${workout.avgHr} · ${formatDuration(workout.duration)} EFFORT`}
              accent={COLORS.rust}
              borderColor={COLORS.ink}
            />
            <BrutCard
              eyebrow="GLUCOSE Δ"
              big={`${workout.glucoseDelta > 0 ? "+" : ""}${workout.glucoseDelta.toFixed(1)}`}
              sub="DURING TODAY'S RUN"
              accent={workout.glucoseDelta < 0 ? COLORS.acid : COLORS.blood}
              borderColor={COLORS.ink}
            />
          </section>

          <section
            className="grid border-b"
            style={{ gridTemplateColumns: "1fr 1.4fr", borderColor: COLORS.ink }}
          >
            <div className="border-r p-10" style={{ borderColor: COLORS.ink }}>
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ ...mono, color: COLORS.acid }}
              >
                LAST EFFORT
              </p>
              <h3 className="mt-3 text-7xl uppercase leading-[0.9]" style={massive}>
                {workout.sport}
                <br />
                {formatDistance(workout.distance)}
              </h3>
              <p className="mt-2 text-xl uppercase" style={cond}>
                {formatPace(workout.duration, workout.distance)} ·{" "}
                {formatDuration(workout.duration)}
              </p>
              <p
                className="mt-6 max-w-md text-sm leading-relaxed"
                style={{ color: COLORS.ink, opacity: 0.7 }}
              >
                Glucose dropped from 7.6 to 5.5 mmol/L during the second half. 55 g recovery shake
                post-run kept the rebound mild. Next check in 35 minutes.
              </p>
            </div>

            <div className="p-10">
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ ...mono, color: COLORS.acid }}
              >
                EVENT LOG · 24H
              </p>
              <ul className="mt-4 space-y-2.5 text-sm" style={mono}>
                {treatments.slice(0, 8).map((t) => (
                  <li
                    key={t.t}
                    className="grid items-baseline gap-3 border-b pb-2 uppercase"
                    style={{ gridTemplateColumns: "60px 90px 1fr auto", borderColor: COLORS.ink }}
                  >
                    <span style={{ color: COLORS.ink, opacity: 0.55 }}>
                      {new Date(t.t).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span
                      className="rounded-none px-1.5 py-0.5 text-center text-[10px]"
                      style={{
                        backgroundColor:
                          t.kind === "insulin"
                            ? COLORS.acid
                            : t.kind === "carbs"
                              ? COLORS.rust
                              : t.kind === "exercise"
                                ? COLORS.blood
                                : COLORS.ink,
                        color: t.kind === "note" ? COLORS.bg : COLORS.bg,
                      }}
                    >
                      {t.kind}
                    </span>
                    <span>{t.label}</span>
                    <span
                      className="text-right tabular-nums"
                      style={{ color: COLORS.ink, opacity: 0.7 }}
                    >
                      {t.detail ?? "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="p-10">
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ ...mono, color: COLORS.acid }}
            >
              RECENT EFFORTS
            </p>
            <div
              className="mt-4 grid gap-px"
              style={{ gridTemplateColumns: "repeat(5, 1fr)", backgroundColor: COLORS.ink }}
            >
              {recentWorkouts.map((w) => (
                <div key={w.id} className="p-4" style={{ backgroundColor: COLORS.paper }}>
                  <p className="text-[10px] uppercase" style={{ ...mono, color: COLORS.acid }}>
                    {w.date}
                  </p>
                  <h4 className="mt-2 text-3xl uppercase" style={massive}>
                    {w.sport}
                  </h4>
                  <p className="mt-1 text-sm uppercase" style={cond}>
                    {formatDistance(w.distance)} · {formatPace(w.duration, w.distance)}
                  </p>
                  <p
                    className="mt-3 text-xs uppercase"
                    style={{ ...mono, color: w.glucoseDelta < 0 ? COLORS.acid : COLORS.blood }}
                  >
                    ΔBG {w.glucoseDelta > 0 ? "+" : ""}
                    {w.glucoseDelta.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Nav({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <li className="flex items-center gap-2 leading-tight">
      {active ? <span style={{ color: "var(--brut-acid, #c2ff00)" }}>▶</span> : <span> </span>}
      <span style={{ opacity: active ? 1 : 0.65, textDecoration: active ? "underline" : "none" }}>
        {label}
      </span>
    </li>
  );
}

function Bigstat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-widest" style={{ opacity: 0.6 }}>
        {label}
      </p>
      <p className="text-3xl tabular-nums" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function BrutCard({
  eyebrow,
  big,
  sub,
  accent,
  borderColor,
}: {
  eyebrow: string;
  big: string;
  sub: string;
  accent: string;
  borderColor: string;
}) {
  return (
    <div className="border-r p-8 last:border-r-0" style={{ borderColor }}>
      <p className="text-xs uppercase tracking-[0.3em]" style={{ ...mono, color: accent }}>
        {eyebrow}
      </p>
      <p
        className="mt-3 leading-[0.85] tracking-tighter"
        style={{ ...massive, fontSize: "clamp(5rem, 10vw, 9rem)", color: accent }}
      >
        {big}
      </p>
      <p className="mt-2 text-sm uppercase" style={cond}>
        {sub}
      </p>
    </div>
  );
}
