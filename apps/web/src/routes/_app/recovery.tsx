import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, Moon, Plug } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { getRecoveryFn } from "~/server/functions/data";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/_app/recovery")({
  component: RecoveryPage,
  loader: () => getRecoveryFn(),
});

function RecoveryPage() {
  const { recoveries, sleeps } = Route.useLoaderData();
  const today = recoveries[0];
  const lastSleep = sleeps[0];
  const empty = recoveries.length === 0 && sleeps.length === 0;

  return (
    <>
      <PageTopbar
        title="Recovery"
        meta="HRV · sleep · resting heart rate"
        windows={["7d", "30d", "90d", "1y"]}
        activeWindow="30d"
      />
      <main className="grid gap-3 px-6 py-5 lg:grid-cols-12">
        {empty ? (
          <article className="lg:col-span-12 rounded-3xl border border-dashed border-border/60 bg-card/60 p-10 text-center">
            <Plug className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-3 text-2xl font-semibold tracking-tight" style={display}>
              No recovery data yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect WHOOP from the Settings → Data sources tab. WHOOP uses OAuth2; you'll need a
              registered developer app (WHOOP_CLIENT_ID/SECRET env vars).
            </p>
            <Link
              to="/settings"
              search={{ tab: "sources" }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:bg-foreground/90"
            >
              Connect WHOOP <ArrowUpRight className="size-3.5" />
            </Link>
          </article>
        ) : (
          <>
            <article className="lg:col-span-5 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-card to-card p-6 ring-1 ring-indigo-500/20 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
                recovery · today
              </p>
              {today ? (
                <>
                  <div className="mt-4 flex items-center gap-6">
                    <Ring value={today.score ?? 0} />
                    <div>
                      <p
                        className="text-6xl font-semibold leading-none tabular-nums"
                        style={display}
                      >
                        {today.score ?? "—"}
                      </p>
                      <p className="text-sm text-muted-foreground">/ 100</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">
                    HRV {today.hrv ?? "—"} ms · resting HR {today.rhr ?? "—"} bpm
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No recent recovery score.</p>
              )}
            </article>

            <article className="lg:col-span-7 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
              <header className="flex items-baseline justify-between">
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  recent recovery scores
                </p>
                <span className="text-xs text-muted-foreground" style={mono}>
                  {recoveries.length} days
                </span>
              </header>
              <div className="mt-5 h-36">
                <svg
                  viewBox={`0 0 ${recoveries.length * 24} 144`}
                  preserveAspectRatio="none"
                  className="size-full"
                >
                  {recoveries.map((r, i) => {
                    const score = r.score ?? 0;
                    return (
                      <rect
                        key={i}
                        x={i * 24 + 4}
                        y={144 - (score / 100) * 144}
                        width={16}
                        height={(score / 100) * 144}
                        rx={3}
                        fill={
                          score >= 67
                            ? "rgb(16 185 129)"
                            : score >= 33
                              ? "rgb(245 158 11)"
                              : "rgb(244 63 94)"
                        }
                        opacity={0.85}
                      />
                    );
                  })}
                </svg>
              </div>
            </article>

            <article className="lg:col-span-7 rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
              <header className="flex items-baseline justify-between">
                <p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  style={mono}
                >
                  last night
                </p>
                {lastSleep ? (
                  <span className="text-xs text-muted-foreground" style={mono}>
                    {Math.round(((lastSleep.durationSeconds ?? 0) / 3600) * 10) / 10}h ·{" "}
                    {lastSleep.score ?? "—"}% performance
                  </span>
                ) : null}
              </header>
              {lastSleep ? (
                <p className="mt-3 text-3xl font-semibold tabular-nums" style={display}>
                  {Math.round(((lastSleep.durationSeconds ?? 0) / 3600) * 10) / 10}h
                </p>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No sleep recorded.</p>
              )}
            </article>

            <aside className="lg:col-span-5 grid gap-3">
              <Card
                label="HRV"
                value={today?.hrv ?? "—"}
                unit="ms"
                icon={<Heart className="size-3.5 text-rose-500" />}
              />
              <Card
                label="Resting heart rate"
                value={today?.rhr ?? "—"}
                unit="bpm"
                icon={<Heart className="size-3.5 text-emerald-500" />}
              />
              <Card
                label="Sleeps logged · 7d"
                value={sleeps.length.toString()}
                icon={<Moon className="size-3.5 text-indigo-500" />}
              />
            </aside>
          </>
        )}
      </main>
    </>
  );
}

function Ring({ value }: { value: number }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color =
    value >= 67 ? "rgb(16 185 129)" : value >= 33 ? "rgb(245 158 11)" : "rgb(244 63 94)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        opacity={0.12}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function Card({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string | number | null;
  unit?: string;
  icon?: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-border/40 bg-card/90 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          {label}
        </p>
        {icon}
      </div>
      <p
        className="mt-2 flex items-baseline gap-1 text-3xl font-semibold tabular-nums"
        style={display}
      >
        {value ?? "—"}
        {unit ? (
          <span className="text-sm font-normal text-muted-foreground" style={mono}>
            {unit}
          </span>
        ) : null}
      </p>
    </article>
  );
}
