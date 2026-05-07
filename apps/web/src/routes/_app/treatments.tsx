import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { formatClock, mockData } from "~/data/mock";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/_app/treatments")({
  component: TreatmentsPage,
});

function TreatmentsPage() {
  const { treatments } = mockData;
  const counts = treatments.reduce<Record<string, number>>((acc, t) => {
    acc[t.kind] = (acc[t.kind] ?? 0) + 1;
    return acc;
  }, {});

  // Mock: insulin total today, carbs total today
  const insulinTotal = treatments
    .filter((t) => t.kind === "insulin")
    .reduce((s, t) => s + (parseFloat(t.detail?.match(/[\d.]+/)?.[0] ?? "0") || 0), 0);
  const carbsTotal = treatments
    .filter((t) => t.kind === "carbs")
    .reduce((s, t) => s + (parseInt(t.detail?.match(/\d+/)?.[0] ?? "0", 10) || 0), 0);

  return (
    <>
      <PageTopbar
        title="Treatments"
        meta="full log · today"
        right={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-xs text-background hover:bg-foreground/90"
          >
            <Plus className="size-3" /> Log event
          </button>
        }
      />
      <main className="grid gap-3 px-6 py-5">
        <section className="grid gap-3 lg:grid-cols-4">
          <Stat
            tone="blue"
            label="Insulin · today"
            value={`${insulinTotal.toFixed(1)} u`}
            sub={`${counts.insulin ?? 0} doses`}
          />
          <Stat
            tone="amber"
            label="Carbs · today"
            value={`${carbsTotal} g`}
            sub={`${counts.carbs ?? 0} entries`}
          />
          <Stat tone="emerald" label="Exercise" value={`${counts.exercise ?? 0}`} sub="sessions" />
          <Stat tone="muted" label="Notes" value={`${counts.note ?? 0}`} sub="auto + manual" />
        </section>

        <section className="flex flex-wrap items-center gap-2">
          <FilterPill label="All" count={treatments.length} active />
          <FilterPill label="Insulin" count={counts.insulin ?? 0} tone="blue" />
          <FilterPill label="Carbs" count={counts.carbs ?? 0} tone="amber" />
          <FilterPill label="Exercise" count={counts.exercise ?? 0} tone="emerald" />
          <FilterPill label="Notes" count={counts.note ?? 0} tone="muted" />
          <span className="ml-auto text-xs text-muted-foreground" style={mono}>
            range: today · last 24h
          </span>
        </section>

        <section className="rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
          <header className="flex items-baseline justify-between border-b border-border/40 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
              timeline · {treatments.length} events
            </p>
            <span className="text-[11px] text-muted-foreground" style={mono}>
              most recent first
            </span>
          </header>
          <ol>
            {treatments.toReversed().map((t, i) => (
              <li
                key={t.t}
                className={`grid items-center gap-4 px-5 py-3 text-sm ${i < treatments.length - 1 ? "border-b border-border/30" : ""}`}
                style={{ gridTemplateColumns: "60px 28px 1fr 200px auto" }}
              >
                <span className="tabular-nums text-muted-foreground" style={mono}>
                  {formatClock(t.t)}
                </span>
                <span
                  className={`grid size-6 place-items-center rounded-full text-xs font-medium ${kindBadge(t.kind)}`}
                >
                  {kindLetter(t.kind)}
                </span>
                <div>
                  <p className="font-medium">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground" style={mono}>
                    {kindLabel(t.kind)}
                  </p>
                </div>
                <p className="text-xs tabular-nums text-muted-foreground" style={mono}>
                  {t.detail ?? "—"}
                </p>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  style={mono}
                >
                  edit
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-dashed border-border/60 bg-card/50 p-6 text-sm text-muted-foreground">
          <p style={mono} className="text-[10px] uppercase tracking-[0.2em]">
            heads-up
          </p>
          <p className="mt-2">
            Treatment logging is opt-in and informational only. serene does not provide insulin
            dosing recommendations or any clinical decision support — events here are just for
            context next to glucose and activity.
          </p>
        </section>
      </main>
    </>
  );
}

function Stat({
  tone,
  label,
  value,
  sub,
}: {
  tone: "blue" | "amber" | "emerald" | "muted";
  label: string;
  value: string;
  sub?: string;
}) {
  const ring = {
    blue: "ring-blue-500/30",
    amber: "ring-amber-500/30",
    emerald: "ring-emerald-500/30",
    muted: "ring-border",
  }[tone];
  return (
    <article className={`rounded-2xl bg-card/95 p-5 ring-1 ${ring} backdrop-blur-xl`}>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight" style={display}>
        {value}
      </p>
      {sub ? (
        <p className="text-xs text-muted-foreground" style={mono}>
          {sub}
        </p>
      ) : null}
    </article>
  );
}

function FilterPill({
  label,
  count,
  tone,
  active,
}: {
  label: string;
  count: number;
  tone?: "blue" | "amber" | "emerald" | "muted";
  active?: boolean;
}) {
  const baseTone = active
    ? "border-foreground bg-foreground text-background"
    : tone === "blue"
      ? "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300"
      : tone === "amber"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : tone === "emerald"
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-border/60 bg-card/60 text-muted-foreground";
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${baseTone}`}
      style={mono}
    >
      <span>{label}</span>
      <span className="opacity-70">{count}</span>
    </button>
  );
}

function kindBadge(kind: string): string {
  switch (kind) {
    case "insulin":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-300";
    case "carbs":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "exercise":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function kindLetter(kind: string): string {
  return kind === "insulin" ? "I" : kind === "carbs" ? "C" : kind === "exercise" ? "E" : "•";
}

function kindLabel(kind: string): string {
  return kind === "insulin"
    ? "Insulin · long-acting"
    : kind === "carbs"
      ? "Carbohydrate intake"
      : kind === "exercise"
        ? "Exercise event"
        : "Note";
}
