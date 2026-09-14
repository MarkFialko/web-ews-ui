import { type ReactNode } from "react";
import { useGetIncReasonQuery } from "@shared/queries/dictionaryApi";
import { FormInputDropdown } from "@shared/ui";
import type { FieldValues, Control } from "react-hook-form";

interface IncidentReasonSelectProps<TFieldValues extends FieldValues> {
  name: string;
  control: Control<TFieldValues>;
}

export function IncidentReasonSelect<TFieldValues extends FieldValues>({
  name,
  control,
}: IncidentReasonSelectProps<TFieldValues>): ReactNode {
  const { data, isLoading } = useGetIncReasonQuery();

  const options =
    data?.items?.map((item) => ({
      value: item.value,
      label: item.label,
    })) ?? [];

  return (
    <FormInputDropdown
      name={name}
      control={control}
      label="Причина инцидента *"
      options={options}
      disabled={isLoading}
    />
  );
}
