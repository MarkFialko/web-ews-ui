import { Box } from "@mui/material";
import { FormProvider, useWatch, type UseFormReturn } from "react-hook-form";
import type { RequestDTO } from "@shared/request";
import { WorkgroupServiceField } from "./components/WorkgroupServiceField";
import { useTransferToWorkgroup } from "./model/useTransferToWorkgroup";
import { AssigneeAutocompleteField } from "./components/AssigneeAutocompleteField";
import { ReasonField } from "./components/ReasonField";
import { SubmitButton } from "./components/SubmitButton";
import type { FormValues } from "./model/useRelatedRequests";

interface TransferToWorkgroupPanelProps {
  isFetching: boolean;
  form: UseFormReturn<FormValues>;
  request: RequestDTO;
  onClose: () => void;
}

export default function TransferToWorkgroupPanel({
  isFetching,
  form,
  request,
  onClose,
}: TransferToWorkgroupPanelProps) {
  const { onSubmit, isSubmitting } = useTransferToWorkgroup({
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

              {/* Причина */}
              <ReasonField
                control={form.control}
                businessId={request.businessId}
                disabled={isFormDisabled}
              />
            </>
          )}

          <SubmitButton disabled={isFormDisabled} loading={isSubmitting} />
        </Box>
      </FormProvider>
    </Box>
  );
}
