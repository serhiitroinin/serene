import { Calendar, ChevronDown, FileText, Hash, MapPin, Plus } from "lucide-react";
import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from "~/components/ui/map";
import {
  formatClock,
  formatDistance,
  formatDuration,
  formatGlucose,
  formatPace,
  mockData,
  ROUTE_CENTER,
} from "./shared";
import { Sparkline } from "./sparkline";

const editorial = { fontFamily: "var(--font-serif-editorial)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export function NotionVariant() {
  const { glucose, tir, today, workout, recentWorkouts, treatments, weeklyTIR, route } = mockData;
  const coords: [number, number][] = route.map((p) => [p.lng, p.lat]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="grid lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col overflow-y-auto border-r border-border/40 bg-muted/30 px-3 py-4 text-sm lg:flex">
          <div className="mb-4 flex items-center gap-2 px-1.5">
            <span className="grid size-5 place-items-center rounded text-base">🌿</span>
            <span className="font-medium">Serhii's serene</span>
            <ChevronDown className="ml-auto size-3 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search…"
            className="mb-4 rounded border border-border/40 bg-background px-2 py-1 text-xs text-muted-foreground"
          />
          <p className="px-1.5 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <ul className="space-y-0.5">
            {[
              ["📊", "Today", true],
              ["🩸", "Glucose log"],
              ["🏃", "Activity"],
              ["💤", "Recovery"],
              ["🍞", "Treatments"],
              ["🗺️", "Routes"],
              ["📈", "Reports"],
            ].map(([icon, label, active]) => (
              <li key={label as string}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 rounded px-1.5 py-1 text-left ${
                    active ? "bg-muted text-foreground" : "text-foreground/80 hover:bg-muted/50"
                  }`}
                >
                  <span className="size-4 text-center text-base leading-none">{icon}</span>
                  <span className="flex-1 text-sm">{label}</span>
                  {active ? <span className="text-[10px] text-muted-foreground">↩</span> : null}
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-6 px-1.5 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            Recent runs
          </p>
          <ul className="space-y-0.5">
            {recentWorkouts.slice(0, 4).map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-1.5 py-1 text-left hover:bg-muted/50"
                >
                  <FileText className="size-3.5 text-muted-foreground" />
                  <span className="flex-1 truncate text-sm">
                    {w.sport} · {formatDistance(w.distance)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {w.date.split("·")[0]?.trim()}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-auto flex items-center gap-2 rounded px-1.5 py-1.5 text-sm text-muted-foreground hover:bg-muted/50"
          >
            <Plus className="size-3.5" /> Add a page
          </button>
        </aside>

        <main className="px-12 py-12 lg:px-24">
          <div className="mx-auto max-w-3xl">
            <p className="flex items-center gap-2 text-xs text-muted-foreground" style={mono}>
              <Calendar className="size-3" />{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <h1 className="mt-3 text-5xl font-bold tracking-tight" style={editorial}>
              Today · in glance
            </h1>
            <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
              A 14-kilometre run before sunrise dipped glucose to 5.5, the recovery shake walked it
              back, and the rest of the day held inside the band.{" "}
              <em>Time-in-range: {tir.inRange}%.</em>
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["#stable", "#in-range", "#long-run", "#vondelpark", "#39-days-out"].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-0.5 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  style={mono}
                >
                  <Hash className="size-2.5" />
                  {t.slice(1)}
                </span>
              ))}
            </div>

            <div className="mt-10 rounded-lg border border-border/40 bg-muted/30">
              <div
                className="flex items-baseline gap-3 border-b border-border/40 px-5 py-2.5 text-xs text-muted-foreground"
                style={mono}
              >
                <span>📊</span>
                <span>glucose · 24h</span>
                <span className="ml-auto">
                  avg {formatGlucose(today.avg)} · gmi {today.gmi.toFixed(1)} · cv {today.cv}%
                </span>
              </div>
              <div className="px-5 py-5">
                <p
                  className="flex items-baseline gap-2 text-6xl font-bold tracking-tight"
                  style={editorial}
                >
                  <span className="tabular-nums">{formatGlucose(glucose.current)}</span>
                  <span className="text-base font-normal text-muted-foreground">
                    mmol/L · stable
                  </span>
                </p>
                <div className="mt-4 h-32 text-foreground/80">
                  <Sparkline
                    data={glucose.last24h}
                    width={760}
                    height={128}
                    showRangeBand
                    strokeColor="currentColor"
                    bandColor="var(--color-glucose-in-range)"
                    className="size-full"
                  />
                </div>
              </div>
            </div>

            <h2 className="mt-12 text-2xl font-bold tracking-tight" style={editorial}>
              The route
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Toggle: <span className="rounded bg-muted px-1 py-0.5">map view</span> ·{" "}
              <span className="text-muted-foreground/60">trace view</span>
            </p>
            <div className="mt-3 overflow-hidden rounded-lg border border-border/40">
              <div className="aspect-[16/8] w-full">
                <Map center={ROUTE_CENTER} zoom={12.4} className="size-full">
                  <MapRoute coordinates={coords} color="#ef4444" width={3.5} opacity={0.95} />
                  <MapMarker longitude={coords[0]![0]} latitude={coords[0]![1]}>
                    <MarkerContent>
                      <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        S
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapMarker longitude={coords.at(-1)![0]} latitude={coords.at(-1)![1]}>
                    <MarkerContent>
                      <span className="grid size-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow ring-2 ring-background">
                        F
                      </span>
                    </MarkerContent>
                  </MapMarker>
                  <MapControls position="top-right" />
                </Map>
              </div>
            </div>
            <ul className="mt-3 grid grid-cols-4 gap-2 text-sm">
              {[
                ["Distance", formatDistance(workout.distance)],
                ["Time", formatDuration(workout.duration)],
                ["Pace", formatPace(workout.duration, workout.distance)],
                ["ΔBG", `${workout.glucoseDelta.toFixed(1)} mmol`],
              ].map(([k, v]) => (
                <li key={k} className="rounded bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="tabular-nums" style={mono}>
                    {v}
                  </p>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl font-bold tracking-tight" style={editorial}>
              Treatments timeline
            </h2>
            <ul className="mt-3 divide-y divide-border/40 rounded-lg border border-border/40">
              {treatments.slice(0, 8).map((t) => (
                <li
                  key={t.t}
                  className="grid items-center gap-4 px-5 py-2.5 text-sm"
                  style={{ gridTemplateColumns: "62px 24px 1fr auto" }}
                >
                  <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {formatClock(t.t)}
                  </span>
                  <span
                    className={`grid size-5 place-items-center rounded text-[10px] font-medium ${kindBadge(t.kind)}`}
                  >
                    {kindLetter(t.kind)}
                  </span>
                  <span>{t.label}</span>
                  <span className="text-xs tabular-nums text-muted-foreground" style={mono}>
                    {t.detail ?? ""}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl font-bold tracking-tight" style={editorial}>
              Weekly · time in range
            </h2>
            <table className="mt-3 w-full text-sm">
              <thead className="text-xs text-muted-foreground" style={mono}>
                <tr className="border-b border-border/40">
                  <th className="py-2 text-left font-normal">Day</th>
                  <th className="py-2 text-left font-normal">Date</th>
                  <th className="py-2 text-right font-normal">In range</th>
                  <th className="py-2 text-right font-normal">Avg mmol/L</th>
                  <th className="w-32" />
                </tr>
              </thead>
              <tbody>
                {weeklyTIR.map((d) => (
                  <tr key={d.date} className="border-b border-border/30">
                    <td className="py-2.5">{d.weekday}</td>
                    <td className="py-2.5 text-muted-foreground">{d.date}</td>
                    <td className="py-2.5 text-right tabular-nums" style={mono}>
                      {d.inRange}%
                    </td>
                    <td className="py-2.5 text-right tabular-nums" style={mono}>
                      {d.avg.toFixed(1)}
                    </td>
                    <td className="py-2.5">
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-foreground/70"
                          style={{ width: `${d.inRange}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p
              className="mt-12 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground"
              style={mono}
            >
              <span>
                <MapPin className="mr-1 inline size-3" /> 52.358°N · 4.879°E
              </span>
              <span>last edited {formatClock(Date.now() - 60_000)} · auto-saved</span>
            </p>
          </div>
        </main>
      </div>
    </div>
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
