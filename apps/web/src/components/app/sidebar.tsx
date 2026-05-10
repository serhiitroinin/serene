import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Bell,
  BookOpen,
  CircleDashed,
  Heart,
  Inbox,
  Layers,
  MapPin,
  Settings,
  Share2,
} from "lucide-react";
import type { SourceMeta } from "~/server/sources/types";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

type SourceStatus = {
  meta: SourceMeta;
  connected: boolean;
  lastRefreshedAt: Date | null;
  lastError: string | null;
};

function relativeTime(d: Date | null): string {
  if (!d) return "never";
  const ms = Date.now() - d.getTime();
  const min = Math.round(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.round(hr / 24);
  return `${day} day${day === 1 ? "" : "s"} ago`;
}

const NAV = [
  { to: "/", label: "Today", icon: Inbox, exact: true },
  { to: "/glucose", label: "Glucose", icon: Activity, exact: false },
  { to: "/activity", label: "Activity", icon: BookOpen, exact: false },
  { to: "/recovery", label: "Recovery", icon: Heart, exact: false },
  { to: "/treatments", label: "Treatments", icon: Layers, exact: false },
] as const;

const SECONDARY = [
  {
    to: "/settings" as const,
    label: "Settings",
    icon: Settings,
    search: { tab: "general" as const },
  },
];

export function AppSidebar({ sources }: { sources?: ReadonlyArray<SourceStatus> }) {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-4 border-r border-border/40 bg-card/60 px-3 py-4 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2 px-1.5">
        <span className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-violet-400 text-xs font-bold text-white">
          s
        </span>
        <span className="text-base font-semibold tracking-tight" style={display}>
          serene
        </span>
        <button
          type="button"
          aria-label="Notifications"
          className="ml-auto grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted/50"
        >
          <Bell className="size-3.5" />
        </button>
      </div>

      <nav className="space-y-0.5 text-sm">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            activeProps={{ className: "bg-foreground/10 text-foreground" }}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-muted/50"
          >
            <Icon className="size-3.5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-2">
        <p
          className="px-2 pb-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
          style={mono}
        >
          Configure
        </p>
        <nav className="space-y-0.5 text-sm">
          {SECONDARY.map(({ to, label, icon: Icon, search }) => (
            <Link
              key={to}
              to={to}
              search={search}
              activeProps={{ className: "bg-foreground/10 text-foreground" }}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-muted/50"
            >
              <Icon className="size-3.5" />
              <span>{label}</span>
            </Link>
          ))}
          <Link
            to="/settings"
            search={{ tab: "share" }}
            activeProps={{ className: "bg-foreground/10 text-foreground" }}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-muted/50"
          >
            <Share2 className="size-3.5" />
            <span>Share link</span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto rounded-xl border border-border/60 bg-card/85 p-3 text-xs">
        <div className="flex items-center justify-between">
          <p className="font-medium" style={display}>
            Sources
          </p>
          <Link
            to="/settings"
            search={{ tab: "sources" }}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
            style={mono}
          >
            <MapPin className="size-3" />
            manage
          </Link>
        </div>
        {sources && sources.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {sources.map((s) => (
              <li key={s.meta.id} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="truncate text-foreground/80">{s.meta.name}</span>
                {!s.connected ? (
                  <span className="flex items-center gap-1 text-muted-foreground/80">
                    <CircleDashed className="size-3" />
                    <span>not connected</span>
                  </span>
                ) : s.lastError ? (
                  <span className="flex items-center gap-1 text-rose-500/90" title={s.lastError}>
                    <AlertCircle className="size-3" />
                    <span>sync failing</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground" style={mono}>
                    {relativeTime(s.lastRefreshedAt)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Connect Libre, WHOOP, and Garmin from{" "}
            <Link
              to="/settings"
              search={{ tab: "sources" }}
              className="underline hover:text-foreground"
            >
              settings
            </Link>
            .
          </p>
        )}
      </div>
    </aside>
  );
}
