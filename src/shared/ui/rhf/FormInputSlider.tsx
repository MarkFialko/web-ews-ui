import { Controller, type UseFormSetValue } from "react-hook-form";
import { FormLabel, Slider } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useState, useEffect } from "react";

export function FormInputSlider<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  setValue,
  label,
}: FormInputProps<TFieldValues> & { setValue: UseFormSetValue<TFieldValues> }) {
  const [sliderValue, setSliderValue] = useState<number>(30);

  useEffect(() => {
    if (sliderValue !== undefined) setValue(name, sliderValue);
  }, [name, sliderValue, setValue]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  return (
    <>
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={() => (
          <Slider
            value={sliderValue}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            step={1}
          />
        )}
      />
    </>
  );
}
