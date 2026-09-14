import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ArticleDTO } from "../api/knowledgeBaseApi";
import type { RequestDTO } from "@shared/request";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";
import { useTags } from "@modules/request-card/components/tags/useTags";
import { ArticleTop, SolutionBlock, TextInfoBlock } from "./article";

export interface Props {
  request: RequestDTO;
  article: ArticleDTO;
  onBack: () => void;
}

export function ArticleRow(props: Props) {
  const { request, article, onBack } = props;

  const { getIsLinked } = useTags(request);

  const isLinked = getIsLinked(article.tag);

  return (
    <Stack spacing={1}>
      <ArticleTop onBack={onBack} request={request} article={article} />

      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Stack spacing={1.5}>
          <Box
            sx={{ px: 0.5, pb: 1, borderBottom: 1, borderColor: "divider" }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                mb: 0.5,
              }}
            >
              База знаний
            </Typography>
            <Typography
              variant="bodyAccent"
              sx={{
                overflowWrap: "anywhere",
                display: "block",
              }}
            >
              {article.articleTitle}
            </Typography>
            <Stack
              direction="row"
              spacing={0.4}
              alignItems="center"
              sx={{ minHeight: 16, mt: 0.5 }}
            >
              <Typography
                variant="metaTiny"
                sx={{
                  color: isLinked ? "success.main" : "text.disabled",
                }}
              >
                {article.tag}
              </Typography>
              {isLinked ? (
                <CheckCircleOutlineOutlined
                  sx={{
                    fontSize: 13,
                    color: "success.main",
                    flexShrink: 0,
                  }}
                />
              ) : null}
            </Stack>
          </Box>

          <Stack spacing={1}>
            <TextInfoBlock title="Проблема" value={article.problem} />

            <TextInfoBlock
              title="Рекомендации по устранению"
              value={article.recommendations}
            />

            <SolutionBlock
              title="Решение для пользователя"
              solution={article.solutionForUser}
            />

            <SolutionBlock
              title="Решение для СБС"
              solution={article.solutionForSbs}
            />
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
