import { Controller, useController } from "react-hook-form";
import { Autocomplete, TextField, type AutocompleteProps } from "@mui/material";
import { useRef } from "react";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";
import { isEqual } from "lodash";

export interface AutocompleteOption<Value> {
  label: string;
  value: Value;
}

export type FormInputAutocompleteProps<
  Value,
  TFieldValues extends FieldValues,
> = FormInputProps<TFieldValues> & {
  options: AutocompleteOption<Value>[];
} & Partial<
    AutocompleteProps<
      AutocompleteOption<Value>,
      undefined,
      undefined,
      undefined
    >
  >;

export function FormInputAutocomplete<Value, TFieldValues extends FieldValues>(
  props: FormInputAutocompleteProps<Value, TFieldValues>,
) {
  const {
    name,
    control,
    label,
    rules,
    options,
    persistScope,
    draftStoreName,
    disabled,
    ...autocompleteProps
  } = props;

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
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const autocompleteValue =
          options.find((o) => isEqual(o.value, value)) ?? null;

        return (
          <Autocomplete
            loadingText="Загрузка данных..."
            noOptionsText="Нет данных"
            {...autocompleteProps}
            options={options}
            getOptionLabel={(opt) => opt.label ?? ""}
            isOptionEqualToValue={(o, v) => isEqual(o, v)}
            value={autocompleteValue}
            disabled={disabled}
            onInputChange={(_, newVal) => {
              if (!autocompleteProps.freeSolo) return;
              onChange(newVal);
              clearDraftOnce();
            }}
            onChange={(_, newVal) => {
              onChange(newVal ? newVal.value : null);
              clearDraftOnce();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!error}
                helperText={error ? error.message : null}
                size="small"
              />
            )}
          />
        );
      }}
    />
  );
}
