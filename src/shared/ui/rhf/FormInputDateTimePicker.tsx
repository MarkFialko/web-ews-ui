import { Controller } from "react-hook-form";

import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import type { Dayjs } from "dayjs";
import { DateTimePicker, type DateTimePickerProps } from "@mui/x-date-pickers";

/**
 * DatePicker, обёрнутый в RHF Controller.
 * LocalizationProvider уже есть в AppRoot (AdapterDayjs).
 */
export function FormInputDateTimePicker<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  label,
  ...dateTimePickerProps
}: FormInputProps<TFieldValues> & DateTimePickerProps<Dayjs>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DateTimePicker
          {...dateTimePickerProps}
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
          timeSteps={{ minutes: 1 }}
        />
      )}
    />
  );
}
