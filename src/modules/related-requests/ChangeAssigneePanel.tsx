import { Box } from "@mui/material";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import type { RequestDTO } from "@shared/request";
import { FormInputText } from "@shared/ui/rhf/FormInputText";
import { useChangeAssignee } from "./model/useChangeAssignee";
import { AssigneeAutocompleteField } from "./components/AssigneeAutocompleteField";
import { ReasonField } from "./components/ReasonField";
import { rules } from "./model";
import { SubmitButton } from "./components/SubmitButton";
import type { FormValues } from "./model/useRelatedRequests";

interface ChangeAssigneePanelProps {
  form: UseFormReturn<FormValues>;
  request: RequestDTO;
  onClose: () => void;
}

export default function ChangeAssigneePanel({
  form,
  request,
  onClose,
}: ChangeAssigneePanelProps) {
  const { onSubmit, isSubmitting } = useChangeAssignee({
    request,
    onCompleted: onClose,
  });

  return (
    <Box sx={{ p: 3 }}>
      <FormProvider {...form}>
        <Box
          component="form"
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Рабочая группа (readonly) */}
          <FormInputText
            name="workgroupLabel"
            control={form.control}
            label="Рабочая группа"
            disabled
          />

          {/* Исполнитель (обязательное) */}
          <AssigneeAutocompleteField
            name="changeAssignee"
            workgroupId={request.workGroup?.id}
            control={form.control}
            businessId={request.businessId}
            disabled={isSubmitting}
            rules={rules.assignee}
          />

          {/* Причина */}
          <ReasonField
            control={form.control}
            businessId={request.businessId}
            disabled={isSubmitting}
          />

          <SubmitButton loading={isSubmitting} />
        </Box>
      </FormProvider>
    </Box>
  );
}
