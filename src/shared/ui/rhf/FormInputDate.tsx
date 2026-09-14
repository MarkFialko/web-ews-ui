import { Controller } from "react-hook-form";
import {
  DatePicker,
  type DatePickerProps,
} from "@mui/x-date-pickers/DatePicker";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import type { Dayjs } from "dayjs";

/**
 * DatePicker, обёрнутый в RHF Controller.
 * LocalizationProvider уже есть в AppRoot (AdapterDayjs).
 */
export function FormInputDate<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  ...datePickerProps
}: FormInputProps<TFieldValues> & DatePickerProps<Dayjs>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePicker
          {...datePickerProps}
          label={label}
          value={value}
          onChange={(newValue) => onChange(newValue)}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              error: !!error,
              helperText: error ? error.message : null,
            },
          }}
        />
      )}
    />
  );
}
