import { IconButton, Tooltip } from "@mui/material";
import { useCopy } from "./useCopy";
import { ContentCopy } from "@mui/icons-material";

interface Props {
  value: string;
  message?: string;
  hint?: string;
}

export const CopyButton = (props: Props) => {
  const { value, message, hint } = props;

  const { copy } = useCopy();

  const handleCopyClick = () => {
    copy(value, message);
  };

  return (
    <Tooltip title={hint}>
      <IconButton
        size="small"
        color="inherit"
        onClick={handleCopyClick}
        sx={{
          border: "none",
          color: "inherit",
          p: 0.25,
        }}
      >
        <ContentCopy sx={{ fontSize: 14, color: "inherit" }} />
      </IconButton>
    </Tooltip>
  );
};
