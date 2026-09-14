import { Typography, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  color?: string;
  fontWeight?: number;
  title?: string;
}

export const MetaText = (props: Props) => {
  const { children, color, fontWeight, title } = props;

  const content = (
    <Typography
      component="span"
      variant="caption"
      noWrap
      sx={{
        color,
        fontSize: 12,
        lineHeight: 1.35,
        fontWeight,
      }}
    >
      {children}
    </Typography>
  );

  if (!title) return content;
  return <Tooltip title={title}>{content}</Tooltip>;
};
