import { Controller, type UseFormSetValue } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useState, useEffect } from "react";

interface CheckboxOption {
  label: string;
  value: string;
}

export function FormInputMultiCheckbox<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  setValue,
  label,
  options,
}: FormInputProps<TFieldValues> & {
  options: CheckboxOption[];
  setValue: UseFormSetValue<TFieldValues>;
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelect = (val: string) => {
    if (selectedItems.includes(val)) {
      setSelectedItems(selectedItems.filter((item) => item !== val));
    } else {
      setSelectedItems([...selectedItems, val]);
    }
  };

  useEffect(() => {
    setValue(name, selectedItems);
  }, [name, selectedItems, setValue]);

  return (
    <FormControl size="small" variant="outlined">
      <FormLabel component="legend">{label}</FormLabel>
      {options.map((opt) => (
        <FormControlLabel
          key={opt.value}
          control={
            <Controller
              name={name}
              control={control}
              render={() => (
                <Checkbox
                  checked={selectedItems.includes(opt.value)}
                  onChange={() => handleSelect(opt.value)}
                />
              )}
            />
          }
          label={opt.label}
        />
      ))}
    </FormControl>
  );
}
