import { Link } from "@tanstack/react-router";
import { variantMeta, variantOrder, type VariantKey } from "~/variants";

type Props = { current: VariantKey };

export function VariantSwitcher({ current }: Props) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border/80 bg-background/85 p-1 shadow-lg shadow-black/30 backdrop-blur-md">
      <span className="px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Variant
      </span>
      {variantOrder.map((key) => {
        const isActive = key === current;
        const meta = variantMeta[key];
        return (
          <Link
            key={key}
            to="/"
            search={{ v: key }}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={meta.description}
          >
            {meta.label}
          </Link>
        );
      })}
    </div>
  );
}
