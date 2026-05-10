import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { AntiScopeFooter } from "~/components/app/anti-scope-footer";
import { ThemeToggle } from "~/components/theme-toggle";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

export const Route = createFileRoute("/share/$token")({
  component: SharePage,
});

// Share-link is intentionally not wired to real glucose data in v0.1.
// Tokens are not yet validated against a share_tokens table, expiry is
// not enforced, and rate limiting is not in place. Until those land in
// v0.2, this route renders a "coming soon" placeholder so we can't leak
// the owner's CGM stream to anyone with a guessable URL.
function SharePage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(50% 60% at 30% 0%, color-mix(in oklch, oklch(0.74 0.14 160) 16%, transparent), transparent 75%)",
        }}
      />
      <header className="relative">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-violet-400 text-xs font-bold text-white">
              s
            </span>
            <p className="text-sm font-semibold tracking-tight" style={display}>
              serene
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-2xl flex-1 px-6 pb-12">
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/60 p-8 text-center backdrop-blur-xl">
          <Lock className="mx-auto size-8 text-muted-foreground" />
          <h1 className="mt-3 text-2xl font-semibold tracking-tight" style={display}>
            Share-link is coming in v0.2
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Token validation, expiry, and rate limiting land with the share-link feature in the next
            release. Until then this URL doesn't expose any data.
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground" style={mono}>
            getserene.health
          </p>
        </div>
      </main>
      <AntiScopeFooter />
    </div>
  );
}
