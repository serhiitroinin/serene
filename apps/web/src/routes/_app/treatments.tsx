import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { formatClock } from "~/lib/format";
import { getTreatmentsFn } from "~/server/functions/data";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/_app/treatments")({
  component: TreatmentsPage,
  loader: () => getTreatmentsFn(),
});

function TreatmentsPage() {
  const treatments = Route.useLoaderData();
  const empty = treatments.length === 0;

  return (
    <>
      <PageTopbar
        title="Treatments"
        meta="full log"
        right={
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground/40 px-2.5 py-1 text-xs text-background"
          >
            <Plus className="size-3" /> Log event · v0.2
          </button>
        }
      />
      <main className="grid gap-3 px-6 py-5">
        {empty ? (
          <article className="rounded-3xl border border-dashed border-border/60 bg-card/60 p-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight" style={display}>
              No treatments logged
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manual treatment entry (insulin / carbs / exercise / notes) lands in v0.2. For now
              this section reflects what's been recorded automatically by sources.
            </p>
            <Link
              to="/settings"
              search={{ tab: "sources" }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:bg-foreground/90"
            >
              Settings · sources <ArrowUpRight className="size-3.5" />
            </Link>
          </article>
        ) : (
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
              {treatments.map((t, i) => (
                <li
                  key={`${t.t}-${i}`}
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
                  <p className="font-medium">{t.label}</p>
                  <p className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {t.detail ?? "—"}
                  </p>
                  <span
                    className="text-[10px] uppercase tracking-wider text-muted-foreground"
                    style={mono}
                  >
                    {t.source}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </>
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
