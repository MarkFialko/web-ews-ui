import { SectionHeader } from "@shared/ui";
import { Stack, IconButton, Box, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RequestDTO } from "@shared/request";
import { useGetRecommendationsQuery } from "../api/knowledgeBaseApi";
import { ListError } from "./ListError";
import { useMemo, useState } from "react";
import { ShortArticleRow } from "./ShortArticleRow";

const PAGINATION_SIZE = 7;

interface Props {
  request: RequestDTO;
}

export function KnowledgeBaseArticleList(props: Props) {
  const { request } = props;

  const { currentData, error, refetch, isFetching } =
    useGetRecommendationsQuery(request.businessId);

  const [currentPage, setCurrentPage] = useState(0);

  const recommendedArticle = useMemo(() => {
    return currentData?.recommendedArticle ?? null;
  }, [currentData]);

  const restArticles = useMemo(() => {
    const filteredArticles = (currentData?.additionalArticles ?? []).map(
      (article) => ({ ...article, title: article?.title ?? "Тема" }),
    );
    return filteredArticles;
  }, [currentData]);

  const totalPages = Math.ceil(restArticles.length / PAGINATION_SIZE);
  const visibleArticles = useMemo(() => {
    const start = currentPage * PAGINATION_SIZE;
    return restArticles.slice(start, start + PAGINATION_SIZE);
  }, [restArticles, currentPage]);

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <Stack spacing={1}>
      <SectionHeader
        sx={{ mt: 0, mb: 0, display: "flex", alignItems: "center", gap: 1 }}
      >
        Рекомендованные статьи
      </SectionHeader>

      {recommendedArticle ? (
        <ShortArticleRow request={request} article={recommendedArticle} isAi />
      ) : (
        <>
          {isFetching ? (
            <Typography>Загружаем рекомендованную статью...</Typography>
          ) : (
            <Typography>Статья от AI-агента не найдена.</Typography>
          )}
        </>
      )}

      {(error || visibleArticles.length === 0) && (
        <ListError loading={isFetching} />
      )}

      {visibleArticles.map((article) => (
        <ShortArticleRow
          request={request}
          key={article.tag}
          article={article}
          isAi={false}
        />
      ))}

      {totalPages > 1 && (
        <Stack
          sx={{ justifyContent: "center", alignItems: "center", gap: 2, mt: 1 }}
          flexDirection="row"
        >
          <IconButton
            disabled={!canGoPrev}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <Box sx={{ fontSize: 14, color: "text.secondary" }}>
            {currentPage + 1} / {totalPages}
          </Box>
          <IconButton
            disabled={!canGoNext}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}
