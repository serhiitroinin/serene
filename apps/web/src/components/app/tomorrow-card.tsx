import { CalendarClock, Moon } from "lucide-react";
import { Sparkline } from "~/components/charts/sparkline";
import { formatDuration } from "~/lib/format";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

type NightTrace = { date: string; readings: Array<{ t: number; v: number }> };
type RecoveryDay = { date: string; score: number };
type Planned = {
  name: string;
  sport: string | null;
  durationSeconds: number | null;
  planName: string | null;
};

export function TomorrowCard({
  planned,
  overnightSeven,
  recovery7d,
}: {
  planned: Planned | null;
  overnightSeven: ReadonlyArray<NightTrace>;
  recovery7d: ReadonlyArray<RecoveryDay>;
}) {
  const hasPlanned = planned != null;
  const totalReadings = overnightSeven.reduce((s, n) => s + n.readings.length, 0);
  const hasOvernight = totalReadings > 0;

  return (
    <article className="rounded-3xl border border-border/40 bg-card/90 p-6 backdrop-blur-xl">
      <div className="flex items-baseline justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          tomorrow
        </p>
        <span className="text-xs text-muted-foreground" style={mono}>
          night-before look
        </span>
      </div>

      {hasPlanned ? (
        <div className="mt-3 flex items-start gap-3">
          <CalendarClock className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <div className="min-w-0">
            <p className="truncate text-2xl font-semibold tracking-tight" style={display}>
              {planned!.name}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground" style={mono}>
              {[
                planned!.sport,
                planned!.durationSeconds ? formatDuration(planned!.durationSeconds) : null,
                planned!.planName,
              ]
                .filter(Boolean)
                .join(" · ") || "scheduled"}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          No workout scheduled tomorrow. Connect Garmin Coach or schedule one in Garmin Connect.
        </p>
      )}

      {hasOvernight ? (
        <div className="mt-5">
          <p
            className="mb-1.5 flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
            style={mono}
          >
            <Moon className="size-3" />
            <span>last 7 nights overnight glucose</span>
          </p>
          <div className="grid grid-cols-7 gap-1">
            {overnightSeven.map((night) => (
              <div key={night.date} className="flex flex-col items-center gap-1">
                <div className="h-12 w-full text-emerald-500/70">
                  {night.readings.length > 1 ? (
                    <Sparkline
                      data={night.readings}
                      width={60}
                      height={48}
                      strokeColor="currentColor"
                      className="size-full"
                    />
                  ) : (
                    <div className="size-full rounded bg-muted/30" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground" style={mono}>
                  {night.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {recovery7d.length > 0 ? (
        <div className="mt-4 flex items-end gap-1">
          {recovery7d.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-indigo-500/40"
                style={{ height: `${Math.max(2, Math.round((d.score / 100) * 28))}px` }}
                title={`${d.date}: ${d.score}`}
              />
              <span className="text-[10px] text-muted-foreground" style={mono}>
                {d.date}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
