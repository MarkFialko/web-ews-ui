import { Controller } from "react-hook-form";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";

interface ToggleOption {
  label: string;
  value: string;
}

export function FormInputToggleGroup<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  label,
  options,
}: FormInputProps<TFieldValues> & { options: ToggleOption[] }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <ToggleButtonGroup
          value={value}
          onChange={(_, newValue) => onChange(newValue)}
          exclusive
          size="small"
        >
          {options.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
}
