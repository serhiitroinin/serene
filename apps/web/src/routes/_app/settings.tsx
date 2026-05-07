import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Plus, Trash2 } from "lucide-react";
import { PageTopbar } from "~/components/app/topbar";
import { formatRelativeTime } from "~/data/mock";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

type Tab = "general" | "sources" | "share" | "preferences" | "account";
const TABS: ReadonlyArray<{ key: Tab; label: string }> = [
  { key: "general", label: "General" },
  { key: "sources", label: "Data sources" },
  { key: "share", label: "Share-link" },
  { key: "preferences", label: "Preferences" },
  { key: "account", label: "Account" },
];

const isTab = (v: unknown): v is Tab => typeof v === "string" && TABS.some((t) => t.key === v);

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
  validateSearch: (search: Record<string, unknown>): { tab: Tab } => ({
    tab: isTab(search.tab) ? search.tab : "general",
  }),
});

function SettingsPage() {
  const { tab } = Route.useSearch();

  return (
    <>
      <PageTopbar title="Settings" meta="preferences · sources · share" />
      <main className="grid gap-5 px-6 py-5 lg:grid-cols-[200px_1fr]">
        <aside>
          <nav className="flex flex-col gap-0.5 text-sm">
            {TABS.map((t) => (
              <Link
                key={t.key}
                to="/settings"
                search={{ tab: t.key }}
                className={`flex items-center justify-between rounded-md px-3 py-1.5 ${
                  t.key === tab
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span>{t.label}</span>
                {t.key === tab ? (
                  <span className="text-[10px]" style={mono}>
                    ·
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          {tab === "general" ? <GeneralTab /> : null}
          {tab === "sources" ? <SourcesTab /> : null}
          {tab === "share" ? <ShareTab /> : null}
          {tab === "preferences" ? <PreferencesTab /> : null}
          {tab === "account" ? <AccountTab /> : null}
        </div>
      </main>
    </>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl">
      <header className="border-b border-border/40 px-6 py-4">
        <h2 className="text-base font-semibold" style={display}>
          {title}
        </h2>
        {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-baseline gap-3 border-b border-border/40 py-4 last:border-b-0 sm:grid-cols-[200px_1fr]">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function GeneralTab() {
  return (
    <>
      <Section title="Profile" description="How serene addresses you and what we display.">
        <Row label="Display name">
          <input
            type="text"
            defaultValue="Serhii"
            className="w-full max-w-sm rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm"
          />
        </Row>
        <Row label="Time zone" hint="Detected from browser. Used for trace alignment.">
          <input
            type="text"
            defaultValue="Europe/Amsterdam"
            readOnly
            className="w-full max-w-sm rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground"
          />
        </Row>
      </Section>

      <Section
        title="Glucose ranges"
        description="Targets used for time-in-range and threshold alerts in copy."
      >
        <Row label="Target low" hint="3.9 mmol/L is the international standard.">
          <UnitInput value="3.9" unit="mmol/L" />
        </Row>
        <Row label="Target high" hint="10.0 mmol/L is the international standard.">
          <UnitInput value="10.0" unit="mmol/L" />
        </Row>
        <Row label="Urgent low" hint="Below this, glucose is treated as a strong signal in copy.">
          <UnitInput value="3.0" unit="mmol/L" />
        </Row>
        <Row label="Glucose unit">
          <SegmentedControl options={["mmol/L", "mg/dL"]} value="mmol/L" />
        </Row>
      </Section>

      <Section title="Theme" description="Light or dark — also toggleable from the topbar.">
        <Row label="Theme">
          <SegmentedControl options={["System", "Light", "Dark"]} value="System" />
        </Row>
      </Section>
    </>
  );
}

function SourcesTab() {
  const sources = [
    {
      name: "LibreLinkUp",
      subtitle: "Libre 3 CGM · 1-minute readings",
      status: "ok",
      lastSync: "1 min ago",
    },
    {
      name: "WHOOP",
      subtitle: "Recovery, strain, sleep · official OAuth",
      status: "ok",
      lastSync: "5 min ago",
    },
    {
      name: "Garmin Connect",
      subtitle: "Activities, training load · reverse-engineered",
      status: "syncing",
      lastSync: "23 min ago",
    },
    {
      name: "Apple Health",
      subtitle: "Coming in v0.2 · Dexcom, Oura",
      status: "off",
      lastSync: "—",
    },
  ] as const;

  return (
    <Section
      title="Data sources"
      description="serene reads from these. Credentials are encrypted at rest with AES-256-GCM."
    >
      <ul className="divide-y divide-border/40">
        {sources.map((s) => (
          <li
            key={s.name}
            className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <span
                className={`size-2 rounded-full ${s.status === "ok" ? "bg-emerald-500" : s.status === "syncing" ? "bg-amber-500" : "bg-muted-foreground/40"}`}
              />
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground" style={mono}>
                last sync {s.lastSync}
              </span>
              <button
                type="button"
                className="rounded-md border border-border/60 px-3 py-1 text-xs hover:bg-muted/40"
              >
                {s.status === "off" ? "Connect" : "Manage"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ShareTab() {
  return (
    <>
      <Section
        title="Share-link"
        description="Generate a token URL that lets a partner see your glucose, read-only. No account required."
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/40 bg-muted/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">For my partner</p>
                <p className="text-xs text-muted-foreground" style={mono}>
                  created 2 days ago · expires in 28 days · 14 visits
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                active
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <code
                className="flex-1 truncate rounded-md border border-border/60 bg-background px-3 py-2 text-xs"
                style={mono}
              >
                https://getserene.health/s/8K2x9P-aBcD3FgH-Jk4M
              </code>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-border/60 px-3 py-2 text-xs hover:bg-muted/40"
              >
                <Copy className="size-3" />
                copy
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-rose-500/30 px-3 py-2 text-xs text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
              >
                <Trash2 className="size-3" />
                revoke
              </button>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:bg-foreground/90"
          >
            <Plus className="size-3.5" />
            New share-link
          </button>
        </div>
      </Section>

      <Section
        title="Defaults for new links"
        description="Used when you generate a fresh share-link."
      >
        <Row label="Expiry">
          <SegmentedControl options={["7 days", "30 days", "90 days", "Never"]} value="30 days" />
        </Row>
        <Row
          label="What it shows"
          hint="v0.1 only supports glucose-only. Treatments and activity are post-v1."
        >
          <SegmentedControl options={["Glucose only"]} value="Glucose only" />
        </Row>
        <Row label="Rate limit" hint="Maximum visits per hour before the token cools off.">
          <UnitInput value="60" unit="visits/hr" />
        </Row>
      </Section>
    </>
  );
}

function PreferencesTab() {
  return (
    <Section title="Display preferences" description="Mostly chart defaults and copy preferences.">
      <Row label="Default time window">
        <SegmentedControl options={["1h", "4h", "24h", "7d", "30d"]} value="24h" />
      </Row>
      <Row label="Sparkline style">
        <SegmentedControl options={["Line", "Filled"]} value="Filled" />
      </Row>
      <Row label="Number of recent runs to show">
        <UnitInput value="5" unit="runs" />
      </Row>
    </Section>
  );
}

function AccountTab() {
  return (
    <>
      <Section
        title="Account"
        description="serene is single-tenant in v0.1, so there's not much here yet."
      >
        <Row label="Email">
          <input
            type="email"
            defaultValue="sergey4troinin@gmail.com"
            className="w-full max-w-sm rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm"
          />
        </Row>
        <Row label="Owner ID" hint="Used internally for multi-tenant readiness. Don't share.">
          <code
            className="block rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground"
            style={mono}
          >
            self-1f4d8a82-9c11-4d2e-9d97-72f0
          </code>
        </Row>
        <Row
          label="Last sign-in"
          hint="There is no sign-in flow in v0.1. This is from your env-var bootstrap."
        >
          <span className="text-sm text-muted-foreground">
            {formatRelativeTime(Date.now() - 12 * 60 * 60 * 1000)}
          </span>
        </Row>
      </Section>

      <Section title="Danger zone" description="Irreversible. Be sure.">
        <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
          <div>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
              Delete all my data
            </p>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
              Drops every record from this serene instance. Sources stay disconnected.
            </p>
          </div>
          <button
            type="button"
            className="rounded-md bg-rose-600 px-3 py-1.5 text-xs text-white hover:bg-rose-700"
          >
            Delete everything
          </button>
        </div>
      </Section>
    </>
  );
}

function UnitInput({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <input
        type="text"
        defaultValue={value}
        className="w-24 rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm tabular-nums"
        style={mono}
      />
      <span className="text-xs text-muted-foreground" style={mono}>
        {unit}
      </span>
    </div>
  );
}

function SegmentedControl({ options, value }: { options: ReadonlyArray<string>; value: string }) {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-md border border-border/60 bg-muted/40 p-0.5 text-sm"
      style={mono}
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={`rounded-sm px-2.5 py-1 ${o === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
