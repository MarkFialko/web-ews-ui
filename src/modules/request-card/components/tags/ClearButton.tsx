import { CloseRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface Props {
  onClose: () => void;
}
export const ClearButton = (props: Props) => {
  const { onClose } = props;

  return (
    <IconButton size="small" edge="end" onClick={onClose}>
      <CloseRounded fontSize="small" />
    </IconButton>
  );
};
