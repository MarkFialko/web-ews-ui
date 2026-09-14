import { type ReactNode } from "react";
import { useGetLateReasonQuery } from "@shared/queries/dictionaryApi";
import { FormInputDropdown } from "@shared/ui";
import type { FieldValues, Control } from "react-hook-form";

interface LateReasonSelectProps<TFieldValues extends FieldValues> {
  name: string;
  control: Control<TFieldValues>;
}

export function LateReasonSelect<TFieldValues extends FieldValues>({
  name,
  control,
}: LateReasonSelectProps<TFieldValues>): ReactNode {
  const { data, isLoading } = useGetLateReasonQuery();

  const options =
    data?.items?.map((item) => ({
      value: item.value,
      label: item.label,
    })) ?? [];

  return (
    <FormInputDropdown
      name={name}
      control={control}
      label="Причина нарушения КС *"
      options={options}
      disabled={isLoading}
    />
  );
}
