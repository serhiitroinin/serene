import { ActivityCardVariant } from "./activity-card";
import { EditorialCalmVariant } from "./editorial-calm";
import { LinearGridVariant } from "./linear-grid";
import { WhoopDramaticVariant } from "./whoop-dramatic";
import type { VariantKey } from "./shared";

export type { VariantKey };

export const variants: Record<VariantKey, () => React.JSX.Element> = {
  linear: LinearGridVariant,
  whoop: WhoopDramaticVariant,
  editorial: EditorialCalmVariant,
  activity: ActivityCardVariant,
};

export const variantMeta: Record<VariantKey, { label: string; description: string }> = {
  linear: { label: "Linear", description: "Type-led, dense, hairline grid" },
  whoop: { label: "Dramatic", description: "Full-bleed chart, athletic energy" },
  editorial: { label: "Editorial", description: "Calm reading, mixed serif" },
  activity: { label: "Activity", description: "Bento cards, brighter accents" },
};

export const variantOrder: ReadonlyArray<VariantKey> = ["linear", "whoop", "editorial", "activity"];
