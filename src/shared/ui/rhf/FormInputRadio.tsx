import { Controller } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";

interface RadioOption {
  label: string;
  value: string;
}

export function FormInputRadio<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  options,
}: FormInputProps<TFieldValues> & { options: RadioOption[] }) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup value={value} onChange={onChange}>
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
}
