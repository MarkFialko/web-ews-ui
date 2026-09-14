import { Controller, useController } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import { useRef } from "react";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";

interface DropdownOption {
  label: string;
  value: string;
}

export function FormInputDropdown<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  label,
  options,
  rules,
  disabled,
  persistScope,
  draftStoreName,
}: FormInputProps<TFieldValues> & {
  options: DropdownOption[];
  disabled?: boolean;
}) {
  const { field } = useController({ name, control });

  const { clearDraft } = useFieldDraft({
    scope: persistScope,
    field: name as string,
    getValue: () => String(field.value ?? ""),
    storeName: draftStoreName,
  });

  const clearedRef = useRef(false);

  const clearDraftOnce = () => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    void clearDraft();
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl size="small" fullWidth error={!!error}>
          <InputLabel>{label}</InputLabel>
          <Select
            label={label}
            onChange={(e) => {
              onChange(e);
              clearDraftOnce();
            }}
            value={value}
            disabled={disabled}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {error?.message ? (
            <FormHelperText>{error.message}</FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
}
