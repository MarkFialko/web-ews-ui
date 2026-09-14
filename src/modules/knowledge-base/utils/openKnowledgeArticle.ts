import { buildKnowledgeArticleUrl } from "../knowledgeBaseTool.model";

export const openKnowledgeArticle = (shId: string) => {
  window.open(buildKnowledgeArticleUrl(shId), "_blank", "noopener,noreferrer");
};
