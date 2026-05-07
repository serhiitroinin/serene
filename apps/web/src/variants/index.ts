import { AuroraVariant } from "./aurora";
import { BentoVariant } from "./bento";
import { CanopyVariant } from "./canopy";
import { DriftVariant } from "./drift";
import { HorizonVariant } from "./horizon";
import { LuxeVariant } from "./luxe";
import { MosaicVariant } from "./mosaic";
import { PrismVariant } from "./prism";
import { ReverieVariant } from "./reverie";
import { StudioVariant } from "./studio";
import type { VariantKey } from "./shared";

export type { VariantKey };

export const variants: Record<VariantKey, () => React.JSX.Element> = {
  aurora: AuroraVariant,
  bento: BentoVariant,
  prism: PrismVariant,
  reverie: ReverieVariant,
  mosaic: MosaicVariant,
  horizon: HorizonVariant,
  studio: StudioVariant,
  canopy: CanopyVariant,
  drift: DriftVariant,
  luxe: LuxeVariant,
};

export const variantMeta: Record<VariantKey, { label: string; tagline: string }> = {
  aurora: { label: "Aurora", tagline: "Aurora-mesh glass · ring cards · time windows" },
  bento: { label: "Bento", tagline: "Tiled bento grid · color-coded left bars" },
  prism: { label: "Prism", tagline: "Six-color semantic · sidebar rail · pastel mesh" },
  reverie: { label: "Reverie", tagline: "Centered serif hero · pink-violet dream" },
  mosaic: { label: "Mosaic", tagline: "Asymmetric tile mosaic · teal/amber" },
  horizon: { label: "Horizon", tagline: "Sky-to-sun gradient hero · clean cards" },
  studio: { label: "Studio", tagline: "Sidebar workspace · monitoring rows" },
  canopy: { label: "Canopy", tagline: "Forest serif · long-form sentences" },
  drift: { label: "Drift", tagline: "Centered hero · cool pastel · breathing room" },
  luxe: { label: "Luxe", tagline: "Atelier édition · amber-rose · serif italic" },
};

export const variantOrder: ReadonlyArray<VariantKey> = [
  "aurora",
  "bento",
  "prism",
  "reverie",
  "mosaic",
  "horizon",
  "studio",
  "canopy",
  "drift",
  "luxe",
];
