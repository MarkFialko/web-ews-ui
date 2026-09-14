import { Chip, List, ListItemButton, ListItemText, Paper } from "@mui/material";

import type { QUICK_REPLIES } from "../constants";

interface Props {
  replies: typeof QUICK_REPLIES;
  activeIndex: number;
  onAcceptQuickReply: (index: number) => void;
}

export const QuickReplies = (props: Props) => {
  const { replies, activeIndex, onAcceptQuickReply } = props;

  return (
    <Paper
      variant="outlined"
      className="paperPrimaryOutline"
      sx={{
        position: "absolute",
        bottom: "100%",
        left: 0,
        right: 0,
        mb: 1,
        overflow: "hidden",
        zIndex: 20,
      }}
    >
      <List disablePadding>
        {replies.map((template, index) => (
          <ListItemButton
            key={template.code}
            className="quickReplyItem"
            selected={index === activeIndex}
            onClick={() => onAcceptQuickReply(index)}
          >
            <ListItemText
              primary={template.text}
              primaryTypographyProps={{ noWrap: true }}
            />
            <Chip label={template.code} size="small" />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};
