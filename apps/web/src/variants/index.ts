import { ArchiveVariant } from "./archive";
import { BlueprintVariant } from "./blueprint";
import { LatticeVariant } from "./lattice";
import { MosaicVariant } from "./mosaic";
import { OrchidVariant } from "./orchid";
import { PanelVariant } from "./panel";
import { StudioVariant } from "./studio";
import type { VariantKey } from "./shared";

export type { VariantKey };

export const variants: Record<VariantKey, () => React.JSX.Element> = {
  studio: StudioVariant,
  mosaic: MosaicVariant,
  archive: ArchiveVariant,
  panel: PanelVariant,
  blueprint: BlueprintVariant,
  orchid: OrchidVariant,
  lattice: LatticeVariant,
};

export const variantMeta: Record<VariantKey, { label: string; tagline: string }> = {
  studio: { label: "Studio", tagline: "Sidebar workspace · ringed metric grid · data table" },
  mosaic: { label: "Mosaic", tagline: "Asymmetric tile mosaic · teal/amber bars" },
  archive: { label: "Archive", tagline: "Sidebar history + tile mosaic · entry numbering" },
  panel: { label: "Panel", tagline: "Slim icon rail + bento tiles · indigo accent" },
  blueprint: { label: "Blueprint", tagline: "Engineer's notebook · cyan grid · monospace" },
  orchid: { label: "Orchid", tagline: "Warm orchid + sage · serif italic · soft tiles" },
  lattice: { label: "Lattice", tagline: "Sidebar + gold accents · streak card · roman" },
};

export const variantOrder: ReadonlyArray<VariantKey> = [
  "studio",
  "mosaic",
  "archive",
  "panel",
  "blueprint",
  "orchid",
  "lattice",
];
