import { TAG_PREFIX } from "../constants/tags";
import { KNOWLEDGE_TAG_PREFIX } from "../constants/tags";

export const isShTag = (tag: string): boolean =>
  tag.trim().toLowerCase().startsWith(KNOWLEDGE_TAG_PREFIX);

export const normalizePrefix = (tag: string) =>
  tag.trim().startsWith(TAG_PREFIX) ? tag.trim() : `${TAG_PREFIX}${tag.trim()}`;

export const serializeTags = (tags: string | null): string[] => {
  if (!tags || tags.trim() === "null") return [];

  const normalizedTags = tags
    .split(" ")
    .filter((t) => !!t)
    .map(normalizePrefix);

  return Array.from(new Set(normalizedTags));
};
