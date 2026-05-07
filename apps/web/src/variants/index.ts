import { AlmanacVariant } from "./almanac";
import { AtelierVariant } from "./atelier";
import { BrutalistVariant } from "./brutalist";
import { CartographerVariant } from "./cartographer";
import { MujoVariant } from "./mujo";
import { SynthwaveVariant } from "./synthwave";
import { TerminalVariant } from "./terminal";
import { VelocityVariant } from "./velocity";
import type { VariantKey } from "./shared";

export type { VariantKey };

export const variants: Record<VariantKey, () => React.JSX.Element> = {
  terminal: TerminalVariant,
  brutalist: BrutalistVariant,
  velocity: VelocityVariant,
  almanac: AlmanacVariant,
  atelier: AtelierVariant,
  synthwave: SynthwaveVariant,
  mujo: MujoVariant,
  cartographer: CartographerVariant,
};

export const variantMeta: Record<
  VariantKey,
  { label: string; tagline: string; tone: "dark" | "light" | "duotone" }
> = {
  terminal: {
    label: "Terminal",
    tagline: "Trading-floor precision",
    tone: "dark",
  },
  brutalist: {
    label: "Brutalist",
    tagline: "Concrete, neon, no apologies",
    tone: "dark",
  },
  velocity: {
    label: "Velocity",
    tagline: "Kinetic athletic energy",
    tone: "dark",
  },
  almanac: {
    label: "Almanac",
    tagline: "Vintage runner's journal",
    tone: "light",
  },
  atelier: {
    label: "Atelier",
    tagline: "Fashion-house editorial",
    tone: "light",
  },
  synthwave: {
    label: "Synthwave",
    tagline: "CRT cyberpunk HUD",
    tone: "dark",
  },
  mujo: {
    label: "Mujo",
    tagline: "Japanese reductionism",
    tone: "light",
  },
  cartographer: {
    label: "Cartographer",
    tagline: "Topographic field log",
    tone: "duotone",
  },
};

export const variantOrder: ReadonlyArray<VariantKey> = [
  "terminal",
  "brutalist",
  "velocity",
  "almanac",
  "atelier",
  "synthwave",
  "mujo",
  "cartographer",
];
