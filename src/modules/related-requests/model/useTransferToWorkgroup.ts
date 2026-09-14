import { useCallback, useState } from "react";

import { useReassignTicketMutation } from "../api/reassign";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";
import { STORE_NAMES } from "@shared/cache";
import type { RequestDTO } from "@shared/request";
import type { ReassignDTO } from "../api/reassign";
import { useAppNotifications } from "@shared/notifications";
import { extractErrorMessage } from "@shared/api";

import type { FormValues } from "./useRelatedRequests";
import { useUser } from "@shared/user";

interface UseTransferToWorkgroupProps {
  request: RequestDTO;
  onCompleted: () => void;
}

export function useTransferToWorkgroup({
  request,
  onCompleted,
}: UseTransferToWorkgroupProps) {
  const { notifyError, notifySuccess } = useAppNotifications();

  const { user } = useUser();
  const [reassign] = useReassignTicketMutation();

  const { clearAllDrafts } = useFieldDraft({
    scope: request.businessId,
    field: "transfer",
    getValue: () => "",
    storeName: STORE_NAMES.RELATED_REQUEST_DRAFTS,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (!user) return;

      setIsSubmitting(true);
      // передаём новый workgroup и optionally assignee
      const payload: ReassignDTO = {
        businessId: request.businessId,
        taskId: request.taskId,
        workGroup: values.workgroupUUID,
        assignee: values.assignee || undefined,
        itService: values.serviceUUID,
        reasonReassignment: values.reason,
      };

      await reassign({ ...payload, engineerName: user.employeeNumber! })
        .unwrap()
        .then(async () => {
          await clearAllDrafts();
          onCompleted();
          notifySuccess("Переадресация обращения прошла успешно");
        })
        .catch((error) => {
          notifyError(
            `Ошибка при переадресации обращения: ${extractErrorMessage(error?.data)}`,
          );
        })
        .finally(() => setIsSubmitting(false));
    },
    [
      user,
      request.businessId,
      request.taskId,
      reassign,
      clearAllDrafts,
      onCompleted,
      notifySuccess,
      notifyError,
    ],
  );

  return {
    onSubmit,
    isSubmitting: isSubmitting,
  };
}
