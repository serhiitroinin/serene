import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";
import { variantMeta, variantOrder, type VariantKey } from "~/variants";

type Props = { current: VariantKey };

export function VariantSwitcher({ current }: Props) {
  const meta = variantMeta[current];
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex flex-col items-center gap-2">
        <p className="rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
          {meta.label} · {meta.tagline}
        </p>
        <nav className="flex items-center gap-1 rounded-full border border-white/15 bg-black/75 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {variantOrder.map((key) => {
            const isActive = key === current;
            const m = variantMeta[key];
            return (
              <Link
                key={key}
                to="/"
                search={{ v: key }}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
                title={m.tagline}
              >
                {m.label}
              </Link>
            );
          })}
          <span className="mx-1 h-4 w-px bg-white/15" aria-hidden="true" />
          <ThemeToggle />
        </nav>
      </div>
    </div>
  );
}
