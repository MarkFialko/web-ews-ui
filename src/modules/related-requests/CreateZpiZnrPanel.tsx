import { Box } from "@mui/material";
import { FormProvider, useWatch, type UseFormReturn } from "react-hook-form";
import type { RequestDTO } from "@shared/request";
import { WorkgroupServiceField } from "./components/WorkgroupServiceField";
import { AssigneeAutocompleteField } from "./components/AssigneeAutocompleteField";
import { SubmitButton } from "./components/SubmitButton";
import type { FormValues } from "./model/useRelatedRequests";
import { FormInputText } from "@shared/ui";
import { STORE_NAMES } from "@shared/cache";
import { rules } from "./model";
import { TargetDatePreviewBlock } from "./components/TargetDatePreviewBlock";
import { useCreateZpiZnr } from "./model/useCreateZpiZnr";

interface Props {
  isFetching: boolean;
  form: UseFormReturn<FormValues>;
  request: RequestDTO;
  onClose: () => void;
}

export const CreateZpiZnr = ({ isFetching, form, request, onClose }: Props) => {
  const { onSubmit, isSubmitting } = useCreateZpiZnr({
    request,
    onCompleted: onClose,
  });

  const workgroupEsmId = useWatch({
    control: form.control,
    name: "workgroupUUID",
  });
  const serviceEsmId = useWatch({
    control: form.control,
    name: "serviceUUID",
  });

  const showAdditionalForm = workgroupEsmId && serviceEsmId;

  const isFormDisabled = isSubmitting || isFetching;

  return (
    <Box sx={{ p: 3 }}>
      <FormProvider {...form}>
        <Box
          component="form"
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Рабочая группа и услуга */}
          <WorkgroupServiceField
            isFetching={isFetching}
            control={form.control}
            businessId={request.businessId}
            disabled={isFormDisabled}
          />

          {showAdditionalForm && (
            <>
              {/* Исполнитель */}
              <AssigneeAutocompleteField
                name="assignee"
                loading={isFetching}
                workgroupId={workgroupEsmId}
                control={form.control}
                businessId={request.businessId}
                disabled={isFormDisabled}
              />

              <TargetDatePreviewBlock request={request} form={form} />

              {/* Причина */}
              <FormInputText
                name="description"
                control={form.control}
                label="Описание*"
                rules={rules.description}
                slotProps={{
                  textField: {
                    multiline: true,
                    minRows: 3,
                    placeholder:
                      "Подробно опишите проблему, указав не менее 10 символов",
                  },
                }}
                disabled={isFormDisabled}
                persistScope={request.businessId}
                draftStoreName={STORE_NAMES.RELATED_REQUEST_DRAFTS}
                saveOnInput
              />
            </>
          )}

          <SubmitButton disabled={isFormDisabled} loading={isSubmitting} />
        </Box>
      </FormProvider>
    </Box>
  );
};
