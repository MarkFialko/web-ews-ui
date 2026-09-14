import type { CommandDefinition } from "./commandPalette.types";

export type RankedCommandDefinition = {
  rank: number;
  item: CommandDefinition;
};

export const normalizeCommandPaletteSearchValue = (value: string) =>
  value.trim().toLowerCase();

export const getCommandPaletteMatchRank = (value: string, query: string) => {
  const normalizedValue = normalizeCommandPaletteSearchValue(value);
  if (!normalizedValue || !query) return Number.POSITIVE_INFINITY;
  // TODO: строка скрыта тултипом на исходном фото, восстановлена по смыслу — проверить оригинал
  if (normalizedValue === query) return 0;
  if (normalizedValue.startsWith(query)) return 1;
  if (normalizedValue.includes(query)) return 2;
  return Number.POSITIVE_INFINITY;
};

export const getBestCommandPaletteMatchRank = (
  values: readonly string[],
  query: string,
) =>
  values.reduce(
    (bestRank, value) =>
      Math.min(bestRank, getCommandPaletteMatchRank(value, query)),
    Number.POSITIVE_INFINITY,
  );

export const compareCommandPaletteSearchLabels = (
  left: string,
  right: string,
) => left.localeCompare(right, "ru", { numeric: true, sensitivity: "base" });
