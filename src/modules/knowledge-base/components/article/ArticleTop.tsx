import type { ArticleDTO } from "@modules/knowledge-base/api/knowledgeBaseApi";
import { openKnowledgeArticle } from "@modules/knowledge-base/utils";
import { useTags } from "@modules/request-card/components/tags/useTags";
import { Stack, Button } from "@mui/material";
import type { RequestDTO } from "@shared/request";

interface Props {
  onBack: () => void;
  request: RequestDTO;
  article: ArticleDTO;
}

export const ArticleTop = (props: Props) => {
  const { request, article, onBack } = props;

  const { getIsLinked, handleSaveTag } = useTags(request);

  const isLinked = getIsLinked(article.tag);

  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
    >
      <Button variant="outlined" size="small" onClick={onBack}>
        К списку
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={() => openKnowledgeArticle(article.tag)}
      >
        Открыть
      </Button>
      {!isLinked && (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleSaveTag(article.tag)}
        >
          Привязать
        </Button>
      )}
    </Stack>
  );
};
