import { Controller, useController } from "react-hook-form";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import TextField from "@mui/material/TextField";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";
import { debounce } from "@shared/utils";

type TextFieldSlotProps = {
  textField?: Partial<React.ComponentProps<typeof TextField>>;
};

export function FormInputText<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  rules,
  slotProps,
  persistScope,
  draftStoreName,
  saveOnInput,
  disabled,
  debounceMs,
}: FormInputProps<TFieldValues> & { slotProps?: TextFieldSlotProps }) {
  const { field } = useController({ name, control });

  const { clearDraft, save } = useFieldDraft({
    scope: persistScope,
    field: name as string,
    getValue: () => String(field.value ?? ""),
    storeName: draftStoreName,
  });

  const clearedRef = useRef(false);

  const debouncedWrite = useMemo(() => {
    if (debounceMs == null || debounceMs === 0) return null;
    return debounce((value: string) => {
      field.onChange(value);
    }, debounceMs);
  }, [debounceMs, field]);

  const shouldSaveValueOnChange = persistScope && draftStoreName && saveOnInput;

  const clearDraftOnce = () => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    void clearDraft();
  };

  useEffect(() => {
    return () => {
      debouncedWrite?.cancel();
    };
  }, [debouncedWrite]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (debouncedWrite) {
        debouncedWrite(e.target.value);
      } else {
        field.onChange(e);
      }
      clearDraftOnce();
      shouldSaveValueOnChange && save(e.target.value);
    },
    [debouncedWrite, field, shouldSaveValueOnChange, save, clearDraftOnce],
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange: _, value }, fieldState: { error } }) => (
        <TextField
          {...slotProps?.textField}
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={handleChange}
          value={debounceMs ? undefined : value}
          fullWidth
          label={label}
          variant="outlined"
          disabled={disabled}
        />
      )}
    />
  );
}
