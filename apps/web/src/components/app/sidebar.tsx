import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  BookOpen,
  Heart,
  Inbox,
  Layers,
  MapPin,
  Settings,
  Share2,
} from "lucide-react";
import { formatRelativeTime, mockData } from "~/data/mock";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;
const data = { fontFamily: "var(--font-mono-data)" } as const;

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

export function AppSidebar() {
  const { weeklyTIR } = mockData;
  const weekAvg = Math.round(weeklyTIR.reduce((s, d) => s + d.inRange, 0) / weeklyTIR.length);

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

      <Link
        to="/glucose"
        className="block rounded-xl bg-muted/50 px-3 py-2 text-xs transition-colors hover:bg-muted/70"
      >
        <p className="uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          This week
        </p>
        <p className="mt-1 text-2xl font-medium tabular-nums" style={display}>
          {weekAvg}%
        </p>
        <p className="text-muted-foreground" style={mono}>
          avg in range
        </p>
      </Link>

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
        <ul className="mt-2 space-y-1" style={data}>
          <li className="flex justify-between">
            <span>libre</span>
            <span className="text-emerald-600 dark:text-emerald-400">● ok</span>
          </li>
          <li className="flex justify-between">
            <span>whoop</span>
            <span className="text-emerald-600 dark:text-emerald-400">● ok</span>
          </li>
          <li className="flex justify-between">
            <span>garmin</span>
            <span className="text-amber-600 dark:text-amber-400">● syncing</span>
          </li>
          <li className="flex justify-between">
            <span>last sync</span>
            <span className="text-muted-foreground">{formatRelativeTime(Date.now() - 60_000)}</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
