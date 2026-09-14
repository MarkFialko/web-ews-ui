import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import {
  alpha,
  Button,
  Chip,
  ListItemButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { ShortArticleDTO } from "../api/knowledgeBaseApi";
import { openKnowledgeArticle } from "../utils";
import { useTags } from "@modules/request-card/components/tags/useTags";
import type { RequestDTO } from "@shared/request";
import { type MouseEvent } from "react";

interface Props {
  request: RequestDTO;
  isAi: boolean;
  article: ShortArticleDTO;
}

export function ShortArticleRow(props: Props) {
  const { request, article, isAi } = props;

  const { handleSaveTag, getIsLinked } = useTags(request);

  const isLinked = getIsLinked(article.tag);

  const handleLinkTag = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    handleSaveTag(article.tag);
  };

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        overflow: "hidden",
        borderColor: isAi
          ? theme.palette.success.main
          : theme.palette.divider,
        backgroundColor: isAi
          ? alpha(theme.palette.success.main, 0.06)
          : "background.paper",
      })}
    >
      <ListItemButton
        sx={{ alignItems: "flex-start", gap: 1 }}
        onClick={() => openKnowledgeArticle(article.tag)}
      >
        <Stack spacing={0.4} sx={{ minWidth: 0, flex: 1 }}>
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Typography variant="bodyAccent">{article.title}</Typography>
            <Typography variant="metaTiny">{article.tag}</Typography>
            {isAi && <Chip size="small" color="success" label="AI" />}
            {isLinked && (
              <CheckCircleOutlineOutlinedIcon
                sx={{ fontSize: 18, color: "success.main" }}
              />
            )}
          </Stack>
        </Stack>
        <Button
          size="small"
          disabled={isLinked}
          variant={isLinked ? "contained" : "outlined"}
          onClick={handleLinkTag}
        >
          #
        </Button>
      </ListItemButton>
    </Paper>
  );
}
