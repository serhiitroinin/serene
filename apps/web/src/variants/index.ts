import { AppleVariant } from "./apple";
import { ArcVariant } from "./arc";
import { DatadogVariant } from "./datadog";
import { LinearVariant } from "./linear";
import { NotionVariant } from "./notion";
import { PulseVariant } from "./pulse";
import { StripeVariant } from "./stripe";
import { VercelVariant } from "./vercel";
import type { VariantKey } from "./shared";

export type { VariantKey };

export const variants: Record<VariantKey, () => React.JSX.Element> = {
  linear: LinearVariant,
  stripe: StripeVariant,
  vercel: VercelVariant,
  notion: NotionVariant,
  arc: ArcVariant,
  datadog: DatadogVariant,
  apple: AppleVariant,
  pulse: PulseVariant,
};

export const variantMeta: Record<VariantKey, { label: string; tagline: string }> = {
  linear: { label: "Linear", tagline: "Sidebar · sharp · tools-engineer craft" },
  stripe: { label: "Stripe", tagline: "Editorial · gradient · generous spacing" },
  vercel: { label: "Vercel", tagline: "Black & white · monospace · operations" },
  notion: { label: "Notion", tagline: "Block · long-form · content-first" },
  arc: { label: "Arc", tagline: "Glassmorphism · pastel · rounded" },
  datadog: { label: "Datadog", tagline: "Monitoring dense · Plex · violet alerts" },
  apple: { label: "Apple", tagline: "Card · ring · semantic colors" },
  pulse: { label: "Pulse", tagline: "Calm · serif headlines · teal" },
};

export const variantOrder: ReadonlyArray<VariantKey> = [
  "linear",
  "stripe",
  "vercel",
  "notion",
  "arc",
  "datadog",
  "apple",
  "pulse",
];
