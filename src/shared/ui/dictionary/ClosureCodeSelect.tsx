import { type ReactNode } from "react";
import { useGetCloseCodesQuery } from "@shared/queries/dictionaryApi";
import { FormInputDropdown } from "@shared/ui";
import type { FieldValues, Control } from "react-hook-form";

interface ClosureCodeSelectProps<TFieldValues extends FieldValues> {
  name: string;
  control: Control<TFieldValues>;
  entityType?: string;
}

export function ClosureCodeSelect<TFieldValues extends FieldValues>({
  name,
  control,
  entityType,
}: ClosureCodeSelectProps<TFieldValues>): ReactNode {
  const { data, isLoading } = useGetCloseCodesQuery(entityType || undefined);

  const options =
    data?.items?.map((item) => ({
      value: item.value,
      label: item.label,
    })) ?? [];

  return (
    <FormInputDropdown
      name={name}
      control={control}
      label="Код закрытия *"
      options={options}
      disabled={isLoading}
    />
  );
}
