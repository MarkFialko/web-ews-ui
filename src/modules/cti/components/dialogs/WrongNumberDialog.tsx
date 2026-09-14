import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  type DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";

const DIALOG_SX = {
  ".MuiDialogTitle-root": {
    p: 3,
  },
  ".MuiDialogContent-root": {
    py: 0,
  },
  ".MuiDialogActions-root": {
    p: 3,
  },
};

interface Props extends Pick<DialogProps, "open"> {
  onApply: () => void;
}

export const WrongNumberDialog = (props: Props) => {
  const { onApply, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps} sx={DIALOG_SX}>
      <DialogTitle align="center" variant="h3">
        Некорректный номер телефона
      </DialogTitle>
      <DialogContent>
        <Typography align="center" variant="subtitle1">
          Подключение возможно только при вводе номера телефона с Вашего
          рабочего места
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onApply} fullWidth>
          Понятно
        </Button>
      </DialogActions>
    </Dialog>
  );
};
