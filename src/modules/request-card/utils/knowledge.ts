import { isShTag } from "./tags";
import { KNOWLEDGE_ARTICLE_TITLES } from "../constants/knowledge";

export const findLinkedKnowledgeArticle = (
  hashtags: readonly string[],
  suggestedArticle?: null,
): { id: string; title: string } | null => {
  const knowledgeTag = hashtags.find(isShTag);
  if (!knowledgeTag) return null;

  const normalizedId = knowledgeTag.replace(/^#/, "").replace(/^sh-/i, "SH-");

  if (
    suggestedArticle &&
    suggestedArticle.id.toLowerCase() === normalizedId.toLowerCase()
  ) {
    return {
      id: suggestedArticle.id,
      title: suggestedArticle.title,
    };
  }

  const linkedTitle = KNOWLEDGE_ARTICLE_TITLES[normalizedId];
  if (!linkedTitle) return null;

  return {
    id: normalizedId,
    title: linkedTitle,
  };
};
