import { useGetWorkgroupMembersQuery } from "@modules/ticket-actions";
import { STORE_NAMES } from "@shared/cache";
import {
  FormInputAutocomplete,
  type FormInputAutocompleteProps,
} from "@shared/ui";
import { useMemo } from "react";
import type { FormValues } from "../model/useRelatedRequests";
import type { Path } from "react-hook-form";

interface Props<TFieldValues extends FormValues> extends Omit<
  FormInputAutocompleteProps<TFieldValues["assignee"], TFieldValues>,
  "options" | "name"
> {
  name: "assignee" | "changeAssignee";
  businessId: string;
  /** UUID workgroupId */
  workgroupId?: string;
}

export const AssigneeAutocompleteField = <
  TFieldValues extends FormValues = FormValues,
>(
  props: Props<TFieldValues>,
) => {
  const {
    businessId,
    workgroupId,
    disabled,
    control,
    rules,
    name,
    ...autocompleteProps
  } = props;

  const { currentData: members, isFetching } = useGetWorkgroupMembersQuery(
    workgroupId!,
    {
      skip: !workgroupId,
    },
  );

  const assigneeOptions = useMemo(
    () =>
      (members ?? []).map((m) => ({
        label: m.fullName ?? m.userId,
        value: m.userId,
      })),
    [members],
  );

  return (
    <FormInputAutocomplete
      name={name as Path<TFieldValues>}
      control={control}
      label={`Исполнитель${rules?.required ? "*" : ""}`}
      options={assigneeOptions}
      disabled={disabled}
      persistScope={businessId}
      draftStoreName={STORE_NAMES.RELATED_REQUEST_DRAFTS}
      rules={rules}
      {...autocompleteProps}
      loading={autocompleteProps?.loading || isFetching}
    />
  );
};
