import { Controller } from "react-hook-form";
import { FormControlLabel, Switch } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";

export function FormInputSwitch<
  TFieldValues extends FieldValues = FieldValues,
>({ name, control, label }: FormInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          control={<Switch checked={!!value} onChange={onChange} />}
          label={label ?? ""}
        />
      )}
    />
  );
}
