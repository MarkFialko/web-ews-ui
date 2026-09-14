import { Chip, Stack, Tooltip } from "@mui/material";
import { useMemo } from "react";

interface Props {
  tags: string[];
}

const SPACING = 8;
const MAX_SYMBOLS_COUNT = 100;

const calcVisibleCount = (tags: string[]): number => {
  let len = 0;
  for (let i = 0; i < tags.length; i++) {
    len += tags[i].length + SPACING;
    if (len > MAX_SYMBOLS_COUNT) return i;
  }
  return tags.length;
};

export const TagsView = (props: Props) => {
  const { tags } = props;

  const visibleCount = useMemo(() => calcVisibleCount(tags), [tags]);
  const visible = tags.slice(0, visibleCount);
  const rest = tags.length - visibleCount;

  return (
    <Tooltip title={tags.join(", ")} placement="top">
      <Stack direction="row" spacing={1} sx={{ width: "fit-content" }}>
        {visible.map((tag) => (
          <Chip key={tag} label={tag} />
        ))}
        {rest > 0 && <Chip label={`+${rest}`} variant="outlined" />}
      </Stack>
    </Tooltip>
  );
};
