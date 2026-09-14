import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  type DialogProps,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { useState } from "react";
import type { FormValues } from "./OperatorAuth";

const DEV_PHONE_LENGTH = 9;

const DEFAULT_PHONE_LENGTH = 5;

export const VALID_PHONE_LENGTH = Number(
  import.meta.env.DEV ? DEV_PHONE_LENGTH : DEFAULT_PHONE_LENGTH,
);

const VALIDATION_RULES = {
  phone: {
    validate: (value: string) => {
      return (
        value.length === VALID_PHONE_LENGTH ||
        value.length === DEV_PHONE_LENGTH
      );
    },
  },
};

const DIALOG_SX = {
  ".MuiDialogTitle-root": {
    p: 3,
  },
  ".MuiDialogContent-root": {
    py: 0,
    ".MuiFormHelperText-root": {
      marginLeft: 0,
    },
    ".MuiInputBase-input::placeholder": {
      color: "#C4C4C4",
    },
  },
  ".MuiDialogActions-root": {
    p: 3,
    gap: 2,
  },
};

interface Props extends Pick<DialogProps, "open" | "onClose"> {
  onConnect: (phone: string) => Promise<void>;
}

export const ConnectionNumberDialog = (props: Props) => {
  const { onConnect, ...dialogProps } = props;

  const [isLoading, setIsLoading] = useState(false);

  const methods = useFormContext<FormValues>();

  const handleClose = () => {
    dialogProps.onClose && dialogProps.onClose({}, "backdropClick");
  };

  const handleSubmit = async (values: { phone: string }) => {
    setIsLoading(true);
    const { phone } = values;
    onConnect(phone).finally(() => setIsLoading(false));
  };

  return (
    <Dialog {...dialogProps} sx={DIALOG_SX}>
      <DialogTitle align="center" variant="h3">
        Подключение номера
      </DialogTitle>
      <DialogContent>
        <Controller
          control={methods.control}
          name="phone"
          rules={VALIDATION_RULES.phone}
          render={({ field: { onChange, value }, fieldState }) => (
            <TextField
              type="number"
              fullWidth
              value={value}
              onChange={onChange}
              label="Номер телефона"
              required
              placeholder="Введите номер телефона с Вашего рабочего места"
              error={!!fieldState.error}
              helperText={
                fieldState.error
                  ? `Номер телефона должен состоять из ${VALID_PHONE_LENGTH} цифр`
                  : null
              }
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          fullWidth
          variant="outlined"
          color="secondary"
        >
          Закрыть
        </Button>
        <Button
          loading={isLoading}
          variant="contained"
          onClick={methods.handleSubmit(handleSubmit)}
          fullWidth
        >
          {isLoading ? "Подключение..." : "Подключить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
