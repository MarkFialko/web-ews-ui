import { Button } from "@mui/material";
import { AddRounded } from "@mui/icons-material";

interface Props {
  disabled: boolean;
  onSave: () => void;
}

export const SaveButton = (props: Props) => {
  const { disabled, onSave } = props;

  return (
    <Button
      size="small"
      variant="contained"
      onClick={onSave}
      disabled={disabled}
      startIcon={<AddRounded fontSize="small" sx={{ color: "common.white" }} />}
    >
      Сохранить
    </Button>
  );
};
