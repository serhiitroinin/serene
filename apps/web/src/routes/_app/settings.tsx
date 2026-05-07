import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Check, Copy, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageTopbar } from "~/components/app/topbar";
import {
  completeWhoopOAuthFn,
  connectSourceFn,
  disconnectSourceFn,
  getWhoopAuthorizeUrlFn,
  listSourcesFn,
  triggerSyncFn,
} from "~/server/functions/sources";

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

type Search = {
  tab: Tab;
  code?: string;
  state?: string;
  error?: string;
};

const isTab = (v: unknown): v is Tab => typeof v === "string" && TABS.some((t) => t.key === v);
const optStr = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

const searchSchema = (search: Record<string, unknown>): Search => {
  const out: Search = { tab: isTab(search.tab) ? search.tab : "general" };
  const code = optStr(search.code);
  if (code) out.code = code;
  const state = optStr(search.state);
  if (state) out.state = state;
  const error = optStr(search.error);
  if (error) out.error = error;
  return out;
};

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
  validateSearch: searchSchema,
  loader: () => listSourcesFn(),
});

type SourceRow = Awaited<ReturnType<typeof listSourcesFn>>[number];

function SettingsPage() {
  const search = Route.useSearch();
  const { tab } = search;
  const sources = Route.useLoaderData();
  const router = useRouter();
  const [oauthStatus, setOauthStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!search.code) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await completeWhoopOAuthFn({ data: { code: search.code! } });
        if (cancelled) return;
        if (r.ok) {
          setOauthStatus("WHOOP connected.");
          router.invalidate();
        } else {
          setOauthStatus(`WHOOP connection failed: ${r.error ?? "unknown"}`);
        }
      } catch (err) {
        if (!cancelled) setOauthStatus(err instanceof Error ? err.message : String(err));
      } finally {
        // Strip code/state from URL
        if (!cancelled) {
          router.navigate({ to: "/settings", search: { tab: "sources" }, replace: true });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search.code, router]);

  return (
    <>
      <PageTopbar title="Settings" meta="preferences · sources · share" />
      {oauthStatus ? (
        <div className="mx-6 mt-4 rounded-md border border-border/60 bg-card/90 px-3 py-2 text-sm">
          {oauthStatus}
        </div>
      ) : null}
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
              </Link>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          {tab === "general" ? <GeneralTab /> : null}
          {tab === "sources" ? <SourcesTab sources={sources} /> : null}
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

function SourcesTab({ sources }: { sources: ReadonlyArray<SourceRow> }) {
  return (
    <Section
      title="Data sources"
      description="serene reads from these. Credentials are encrypted at rest with AES-256-GCM."
    >
      <ul className="space-y-3">
        {sources.map((s) => (
          <SourceCard key={s.meta.id} source={s} />
        ))}
      </ul>
    </Section>
  );
}

function SourceCard({ source }: { source: SourceRow }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(source.lastError);
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      source.meta.fields.map((f) => [
        f.key,
        f.type === "select" ? (f.options?.[0]?.value ?? "") : "",
      ]),
    ),
  );

  const handleConnect = async () => {
    if (source.meta.authType === "oauth") {
      setBusy(true);
      try {
        const result = await getWhoopAuthorizeUrlFn();
        window.location.href = result.url;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setBusy(false);
      }
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await connectSourceFn({ data: { source: source.meta.id, payload: form } });
      if (!result.ok) setError(result.error ?? "Unknown error");
      else if (!result.syncOk) setError(`Connected but first sync failed: ${result.syncError}`);
      else {
        setOpen(false);
        router.invalidate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    setBusy(true);
    try {
      await disconnectSourceFn({ data: { source: source.meta.id } });
      router.invalidate();
    } finally {
      setBusy(false);
    }
  };

  const handleSync = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await triggerSyncFn({ data: { source: source.meta.id } });
      if (!result.ok) setError(result.error ?? "Sync failed");
      router.invalidate();
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="rounded-2xl border border-border/40 bg-card/95 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`size-2 rounded-full ${
              source.connected
                ? source.lastError
                  ? "bg-amber-500"
                  : "bg-emerald-500"
                : "bg-muted-foreground/40"
            }`}
          />
          <div>
            <p className="font-medium">{source.meta.name}</p>
            <p className="text-xs text-muted-foreground">{source.meta.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {source.connected && source.lastRefreshedAt ? (
            <span className="text-xs text-muted-foreground" style={mono}>
              last sync {formatRelative(source.lastRefreshedAt)}
            </span>
          ) : null}
          {source.connected ? (
            <>
              <button
                type="button"
                onClick={handleSync}
                disabled={busy}
                className="rounded-md border border-border/60 px-3 py-1 text-xs hover:bg-muted/40 disabled:opacity-50"
              >
                {busy ? <Loader2 className="size-3 animate-spin" /> : "Sync now"}
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-md border border-rose-500/30 px-3 py-1 text-xs text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
              >
                <Trash2 className="size-3" />
                disconnect
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() =>
                source.meta.authType === "oauth" ? handleConnect() : setOpen((o) => !o)
              }
              disabled={busy}
              className="rounded-md bg-foreground px-3 py-1 text-xs text-background hover:bg-foreground/90 disabled:opacity-50"
            >
              {source.meta.authType === "oauth" ? (
                <span className="inline-flex items-center gap-1">
                  Connect with WHOOP <ExternalLink className="size-3" />
                </span>
              ) : open ? (
                "Cancel"
              ) : (
                "Connect"
              )}
            </button>
          )}
        </div>
      </div>

      {error ? (
        <p className="mt-3 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      {open && source.meta.authType === "credentials" && !source.connected ? (
        <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
          {source.meta.fields.map((f) => (
            <Field
              key={f.key}
              field={f}
              value={form[f.key] ?? ""}
              onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
            />
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-border/60 px-3 py-1.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConnect}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-xs text-background hover:bg-foreground/90 disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
              Connect
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: SourceRow["meta"]["fields"][number];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span
        className="mb-1 block text-xs uppercase tracking-[0.18em] text-muted-foreground"
        style={mono}
      >
        {field.label}
      </span>
      {field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-sm rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm"
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="w-full max-w-sm rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm"
        />
      )}
      {field.hint ? <p className="mt-1 text-[11px] text-muted-foreground">{field.hint}</p> : null}
    </label>
  );
}

function formatRelative(d: Date | string | null): string {
  if (!d) return "never";
  const date = d instanceof Date ? d : new Date(d);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} h ago`;
  return `${Math.round(diff / 86400)} d ago`;
}

function GeneralTab() {
  return (
    <Section title="Profile" description="Display preferences for serene.">
      <p className="text-sm text-muted-foreground">
        Coming in v0.2 — for now, set values via env vars.
      </p>
    </Section>
  );
}

function ShareTab() {
  return (
    <>
      <Section
        title="Share-link"
        description="Generate a token URL that lets a partner see your glucose, read-only."
      >
        <p className="text-sm text-muted-foreground">
          Share-link generation lands in v0.2. The route{" "}
          <code className="rounded bg-muted/40 px-1 py-0.5">/share/$token</code> is already wired up
          for previewing the partner view.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <code
            className="flex-1 truncate rounded-md border border-border/60 bg-background px-3 py-2 text-xs"
            style={mono}
          >
            https://getserene.health/share/8K2x9P-aBcD3FgH-Jk4M
          </code>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-border/60 px-3 py-2 text-xs"
          >
            <Copy className="size-3" /> copy
          </button>
        </div>
        <button
          type="button"
          disabled
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-foreground/40 px-3 py-1.5 text-sm text-background"
        >
          <Plus className="size-3.5" /> New share-link · v0.2
        </button>
      </Section>
    </>
  );
}

function PreferencesTab() {
  return (
    <Section title="Display preferences" description="Glucose unit, target ranges, chart defaults.">
      <p className="text-sm text-muted-foreground">Coming in v0.2.</p>
    </Section>
  );
}

function AccountTab() {
  return (
    <Section title="Account" description="serene is single-tenant in v0.1.">
      <p className="text-sm text-muted-foreground">
        Account management lands when multi-tenant ships in v0.2.
      </p>
    </Section>
  );
}
