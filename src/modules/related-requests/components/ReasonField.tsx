import { STORE_NAMES } from "@shared/cache";
import { FormInputText, type FormInputProps } from "@shared/ui";
import type { Path } from "react-hook-form";
import { rules } from "../model";
import type { FormValues } from "../model/useRelatedRequests";

interface Props<TFieldValues extends FormValues> {
  control: FormInputProps<TFieldValues>["control"];
  businessId: string;
  disabled: boolean;
}

export const ReasonField = <TFieldValues extends FormValues>(
  props: Props<TFieldValues>,
) => {
  const { control, businessId, disabled } = props;
  return (
    <FormInputText
      name={"reason" as Path<TFieldValues>}
      control={control}
      label="Причина*"
      rules={rules.reason}
      slotProps={{
        textField: {
          multiline: true,
          minRows: 3,
          placeholder: "Введите не менее 5 символов, но не более 1000",
        },
      }}
      disabled={disabled}
      persistScope={businessId}
      draftStoreName={STORE_NAMES.RELATED_REQUEST_DRAFTS}
      saveOnInput
    />
  );
};
