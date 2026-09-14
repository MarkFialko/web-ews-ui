import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  type DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";

const DIALOG_SX = {
  ".MuiDialogTitle-root": {
    p: 3,
  },
  ".MuiDialogContent-root": {
    py: 0,
  },
  ".MuiDialogActions-root": {
    p: 3,
    gap: 2,
  },
};

interface Props extends Pick<DialogProps, "open"> {
  onCancel: () => void;
  phone: string;
  onConnect: (phone: string, isForce: boolean) => Promise<void>;
}

export const NumberIsBusyDialog = (props: Props) => {
  const { onConnect, ...dialogProps } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    onConnect(props.phone, true).finally(() => setIsLoading(false));
  };

  return (
    <Dialog {...dialogProps} sx={DIALOG_SX}>
      <DialogTitle align="center" variant="h3">
        Номер занят
      </DialogTitle>
      <DialogContent>
        <Typography align="center" variant="subtitle1">
          Номер <b>{props.phone}</b> занят другим сотрудником
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onCancel}
          fullWidth
          variant="outlined"
          color="secondary"
        >
          Отмена
        </Button>
        <Button
          loading={isLoading}
          variant="contained"
          onClick={handleConnect}
          fullWidth
        >
          {isLoading ? "Подключение..." : "Подключить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
