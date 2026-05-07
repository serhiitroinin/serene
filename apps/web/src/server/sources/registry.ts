import type { SourceId } from "../db/schema";
import { garminSource } from "./garmin";
import { libreSource } from "./libre";
import type { AnySource } from "./types";
import { whoopSource } from "./whoop";

export const sources: Record<SourceId, AnySource> = {
  libre: libreSource,
  whoop: whoopSource,
  garmin: garminSource,
};

export const sourceList: ReadonlyArray<AnySource> = [libreSource, whoopSource, garminSource];

export function getSource(id: SourceId): AnySource {
  const source = sources[id];
  if (!source) throw new Error(`Unknown source: ${id}`);
  return source;
}

export type { AnySource } from "./types";
