import { Box, Stack, Typography, Paper, Button, Divider } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { CommunicationHub } from "./CommunicationHub";
import { TOOL_IDS } from "../../constants";
import type { communication } from "@shared/routing";

export type KnowledgeListArticle = {
  id: string;
  title: string;
};

export type AdaptiveCommunicationBlockProps = {
  article: null;
  linkedArticle: KnowledgeListArticle | null;
  knowledgeIntentArticle: KnowledgeListArticle | null;
  state: ReturnType<typeof import("../utils").getCommunicationState>;
  isClosed: boolean;
  onOpenTool?: (toolId: communication, articleId?: string) => void;
  onLinkKnowledgeArticle?: (articleId: string) => void;
};

export function AdaptiveCommunicationBlock({
  article,
  linkedArticle,
  knowledgeIntentArticle,
  state,
  isClosed,
  onOpenTool,
  onLinkKnowledgeArticle,
}: AdaptiveCommunicationBlockProps) {
  const displayedArticle = knowledgeIntentArticle ?? linkedArticle ?? article;
  const hasKnowledgeIntent = Boolean(knowledgeIntentArticle);
  const isAiRecommendedArticle =
    !hasKnowledgeIntent &&
    Boolean(
      article &&
      displayedArticle &&
      article.id.toUpperCase() === displayedArticle.id.toUpperCase(),
    );

  if (!displayedArticle && isClosed) return null;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      {displayedArticle ? (
        <>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.25, p: 1.5 }}
          >
            {isAiRecommendedArticle ? (
              <Box
                component="img"
                src="/gigachat.svg"
                alt="GigaChat"
                sx={(theme) => ({
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
                })}
              />
            ) : (
              <Box
                sx={(theme) => ({
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `1px solid ${theme.palette.divider}`,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: theme.palette.text.secondary,
                })}
              >
                <MenuBookOutlinedIcon sx={{ fontSize: 14 }} />
              </Box>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="fieldLabel"
                sx={{ display: "block", mb: 0.25 }}
              >
                {hasKnowledgeIntent
                  ? "Входящая статья по SH-intent"
                  : isAiRecommendedArticle
                    ? "Рекомендация AI-агента"
                    : "Статья привязана к заявке"}
              </Typography>
              <Typography variant="bodyAccent" noWrap>
                {displayedArticle.title}
              </Typography>
              <Typography variant="fieldLabel">
                {displayedArticle.id}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              {hasKnowledgeIntent ? (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onLinkKnowledgeArticle?.(displayedArticle.id)}
                >
                  Привязать к статье
                </Button>
              ) : null}
              <Button
                size="small"
                variant="text"
                endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
                onClick={() =>
                  onOpenTool?.(TOOL_IDS.KNOWLEDGE, displayedArticle.id)
                }
              >
                Перейти
              </Button>
            </Stack>
          </Box>
          {!isClosed ? <Divider /> : null}
        </>
      ) : null}

      {!isClosed ? (
        <CommunicationHub state={state} onOpenTool={onOpenTool} />
      ) : null}
    </Paper>
  );
}
