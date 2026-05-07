import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronLeft,
  Heart,
  LineChart,
  Lock,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

const STEPS = [
  { key: "welcome", label: "Welcome" },
  { key: "libre", label: "LibreLinkUp" },
  { key: "whoop", label: "WHOOP" },
  { key: "garmin", label: "Garmin" },
  { key: "preferences", label: "Preferences" },
  { key: "done", label: "Done" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export const Route = createFileRoute("/setup")({
  component: SetupPage,
});

function SetupPage() {
  const [step, setStep] = useState<StepKey>("welcome");
  const idx = STEPS.findIndex((s) => s.key === step);
  const next = STEPS[idx + 1]?.key;
  const prev = STEPS[idx - 1]?.key;

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(45% 50% at 0% 0%, color-mix(in oklch, oklch(0.74 0.14 160) 18%, transparent), transparent 70%), radial-gradient(45% 50% at 100% 100%, color-mix(in oklch, oklch(0.74 0.14 280) 14%, transparent), transparent 75%)",
        }}
      />

      <main className="relative mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-violet-400 text-xs font-bold text-white">
            s
          </span>
          <span className="text-base font-semibold tracking-tight" style={display}>
            serene · setup
          </span>
          <span className="ml-auto text-xs text-muted-foreground" style={mono}>
            step {idx + 1} of {STEPS.length}
          </span>
        </div>

        <ol className="mt-6 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s.key} className="flex flex-1 items-center gap-2">
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-medium ${
                  i < idx
                    ? "bg-emerald-500 text-white"
                    : i === idx
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                }`}
                style={mono}
              >
                {i < idx ? <Check className="size-3" /> : i + 1}
              </span>
              <span
                className={`text-[11px] uppercase tracking-[0.18em] ${i === idx ? "text-foreground" : "text-muted-foreground"}`}
                style={mono}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 ? <span className="h-px flex-1 bg-border/60" /> : null}
            </li>
          ))}
        </ol>

        <article className="mt-8 rounded-3xl border border-border/40 bg-card/90 p-8 backdrop-blur-xl">
          {step === "welcome" ? <Welcome /> : null}
          {step === "libre" ? <LibreStep /> : null}
          {step === "whoop" ? <WhoopStep /> : null}
          {step === "garmin" ? <GarminStep /> : null}
          {step === "preferences" ? <PreferencesStep /> : null}
          {step === "done" ? <DoneStep /> : null}
        </article>

        <nav className="mt-6 flex items-center justify-between">
          {prev ? (
            <button
              type="button"
              onClick={() => setStep(prev)}
              className="inline-flex items-center gap-1 rounded-md border border-border/60 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/40"
            >
              <ChevronLeft className="size-3.5" /> Back
            </button>
          ) : (
            <span />
          )}
          {step === "done" ? (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:bg-foreground/90"
            >
              Open dashboard <ArrowRight className="size-3.5" />
            </Link>
          ) : next ? (
            <button
              type="button"
              onClick={() => setStep(next)}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:bg-foreground/90"
            >
              Continue <ArrowRight className="size-3.5" />
            </button>
          ) : null}
        </nav>
      </main>
    </div>
  );
}

function Welcome() {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-violet-400 text-white">
          <Sparkles className="size-4" />
        </span>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          welcome
        </p>
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight" style={display}>
        Let's wire up your data sources.
      </h1>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
        serene reads from up to three sources for v0.1:{" "}
        <span className="text-foreground">Libre 3</span> (via LibreLinkUp),{" "}
        <span className="text-foreground">WHOOP</span>, and{" "}
        <span className="text-foreground">Garmin</span>. None of them is required, but the more you
        connect, the richer the picture.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Highlight icon={<LineChart className="size-4" />} label="Glucose" sub="LibreLinkUp" />
        <Highlight icon={<Heart className="size-4" />} label="Recovery" sub="WHOOP OAuth" />
        <Highlight icon={<Activity className="size-4" />} label="Activity" sub="Garmin Connect" />
      </div>
      <p className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3" />
        Credentials are encrypted at rest with AES-256-GCM. They never leave your serene instance.
      </p>
    </>
  );
}

function LibreStep() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        step 2 · LibreLinkUp
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight" style={display}>
        Connect your Libre 3 sensor
      </h2>
      <p className="mt-3 max-w-prose text-sm text-muted-foreground">
        We use the LibreLinkUp follower flow. Set up LibreLinkUp on the FreeStyle Libre app first
        (Settings → Connected apps → LibreLinkUp), then enter the same credentials here. We poll
        every minute.
      </p>
      <div className="mt-5 grid gap-4">
        <Field label="LibreLinkUp email">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="LibreLinkUp password">
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Region">
          <select className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm">
            <option>EU</option>
            <option>US</option>
            <option>AU</option>
          </select>
        </Field>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        Trouble?{" "}
        <a className="underline hover:text-foreground" href="#">
          See LibreLinkUp setup guide
        </a>
        .
      </p>
    </>
  );
}

function WhoopStep() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        step 3 · WHOOP
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight" style={display}>
        Connect WHOOP
      </h2>
      <p className="mt-3 max-w-prose text-sm text-muted-foreground">
        Uses WHOOP's official OAuth2 API. You'll be redirected to WHOOP, sign in, approve serene's
        read-only scopes, then bounce back here. We poll every 30 minutes.
      </p>
      <div className="mt-5 rounded-2xl border border-border/40 bg-muted/30 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
          read-only scopes
        </p>
        <ul className="mt-2 grid gap-1 text-sm">
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500" /> recovery (daily score, HRV, RHR)
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500" /> sleep (start, end, stages)
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500" /> workouts (start, end, strain, sport)
          </li>
        </ul>
      </div>
      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:bg-foreground/90"
      >
        Sign in with WHOOP <ArrowRight className="size-3.5" />
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        Or skip — you can connect WHOOP later from Settings.
      </p>
    </>
  );
}

function GarminStep() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        step 4 · Garmin
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight" style={display}>
        Connect Garmin
      </h2>
      <p className="mt-3 max-w-prose text-sm text-muted-foreground">
        Garmin doesn't offer an open API for individuals, so this uses the same login your phone
        uses. We poll every 30 minutes.{" "}
        <span className="text-amber-700 dark:text-amber-400">
          Heads-up: Garmin occasionally changes their auth flow. If sync stops, reconnect from
          Settings.
        </span>
      </p>
      <div className="mt-5 grid gap-4">
        <Field label="Garmin Connect email">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Garmin Connect password">
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Region">
          <select className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm">
            <option>EU (.com)</option>
            <option>CN</option>
          </select>
        </Field>
      </div>
    </>
  );
}

function PreferencesStep() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={mono}>
        step 5 · preferences
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight" style={display}>
        How do you read your numbers?
      </h2>
      <p className="mt-3 max-w-prose text-sm text-muted-foreground">
        Used for time-in-range, the band on charts, and copy throughout the app.
      </p>
      <div className="mt-5 grid gap-4">
        <Field label="Glucose unit">
          <div
            className="inline-flex items-center gap-0.5 rounded-md border border-border/60 bg-muted/40 p-0.5 text-sm"
            style={mono}
          >
            <button
              type="button"
              className="rounded-sm bg-background px-3 py-1 text-foreground shadow-sm"
            >
              mmol/L
            </button>
            <button type="button" className="rounded-sm px-3 py-1 text-muted-foreground">
              mg/dL
            </button>
          </div>
        </Field>
        <Field label="Target range">
          <div className="flex items-center gap-2 text-sm" style={mono}>
            <input
              type="text"
              defaultValue="3.9"
              className="w-20 rounded-md border border-border/60 bg-background px-3 py-1.5 tabular-nums"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="text"
              defaultValue="10.0"
              className="w-20 rounded-md border border-border/60 bg-background px-3 py-1.5 tabular-nums"
            />
            <span className="text-muted-foreground">mmol/L</span>
          </div>
        </Field>
        <Field label="Time zone">
          <input
            type="text"
            defaultValue="Europe/Amsterdam"
            className="w-full max-w-sm rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          />
        </Field>
      </div>
    </>
  );
}

function DoneStep() {
  return (
    <>
      <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <Check className="size-6" />
      </span>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight" style={display}>
        You're set.
      </h2>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
        We'll fetch a backfill of recent data from your sources in the next few minutes. Once it
        lands, your dashboard fills in. You can manage everything from{" "}
        <Link
          to="/settings"
          search={{ tab: "general" }}
          className="underline hover:text-foreground"
        >
          Settings
        </Link>
        .
      </p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground" style={mono}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-700 dark:text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-500" /> libre · connected
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-700 dark:text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-500" /> whoop · connected
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-amber-700 dark:text-amber-300">
          <span className="size-1.5 rounded-full bg-amber-500" /> garmin · syncing
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
        <p className="font-medium">Heads-up:</p>
        <p className="mt-1">
          serene is informational only and not medical advice. Treatment guidance, alarms, and
          decision support are out of scope.
        </p>
      </div>
    </>
  );
}

function Highlight({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-muted/30 p-4">
      <span className="grid size-8 place-items-center rounded-xl bg-foreground/5 text-foreground">
        {icon}
      </span>
      <p className="mt-3 text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground" style={mono}>
        {sub}
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground"
        style={mono}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
