import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "~/components/theme-toggle";

const display = { fontFamily: "var(--font-bricolage)" } as const;
const mono = { fontFamily: "var(--font-mono-grotesque)" } as const;

type Window = "1h" | "4h" | "24h" | "7d" | "30d" | "90d" | "1y";

type Props = {
  title: string;
  meta?: ReactNode;
  back?: { to: string; label: string };
  windows?: ReadonlyArray<Window>;
  activeWindow?: Window;
  onWindowChange?: (w: Window) => void;
  right?: ReactNode;
};

export function PageTopbar({
  title,
  meta,
  back,
  windows,
  activeWindow,
  onWindowChange,
  right,
}: Props) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/40 bg-background/75 px-6 py-3 backdrop-blur-xl">
      <div className="flex items-baseline gap-3">
        {back ? (
          <Link
            to={back.to}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
            <span className="text-xs uppercase tracking-wider" style={mono}>
              {back.label}
            </span>
          </Link>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight" style={display}>
          {title}
        </h1>
        {meta ? <span className="text-sm text-muted-foreground">{meta}</span> : null}
      </div>
      <div className="flex items-center gap-2">
        {right}
        {windows && activeWindow ? (
          <div
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 p-0.5 text-xs"
            style={mono}
          >
            {windows.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => onWindowChange?.(w)}
                className={`rounded-full px-2.5 py-1 ${
                  w === activeWindow ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        ) : null}
        <ThemeToggle />
        <span className="grid size-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
          S
        </span>
      </div>
    </header>
  );
}
