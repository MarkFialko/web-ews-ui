import { Box } from "@mui/material";
import type { RequestDTO } from "@shared/request/types";
import { useLazyGetKnowledgeArticleQuery } from "./api/knowledgeBaseApi";

import { KnowledgeBaseSearch } from "./components/KnowledgeBaseSearch";
import { KnowledgeBaseArticleList } from "./components/KnowledgeBaseArticleList";
import { ArticleRow } from "./components/ArticleRow";
import { useState } from "react";

const SX = {
  minHeight: "100%",
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  overflowX: "hidden",
};

export type KnowledgeBaseToolPanelProps = {
  request: RequestDTO;
};

function KnowledgeBaseToolPanel(props: KnowledgeBaseToolPanelProps) {
  const { request } = props;

  const [findArticle, { data: knowledgeArticle = null }] =
    useLazyGetKnowledgeArticleQuery();

  const [isArticleOpen, setIsArticleOpen] = useState(false);

  const handleOpenArticle = () => {
    setIsArticleOpen(true);
  };

  const handleCloseArticle = () => {
    setIsArticleOpen(false);
  };

  return (
    <Box sx={SX}>
      {!isArticleOpen && (
        <>
          <KnowledgeBaseSearch
            onSubmit={findArticle}
            onFindArticle={handleOpenArticle}
          />
          <KnowledgeBaseArticleList request={request} />
        </>
      )}

      {isArticleOpen && knowledgeArticle && (
        <ArticleRow
          request={request}
          article={knowledgeArticle}
          onBack={handleCloseArticle}
        />
      )}
    </Box>
  );
}

export default KnowledgeBaseToolPanel;
