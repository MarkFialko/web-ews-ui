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

interface UseChangeAssigneeProps {
  request: RequestDTO;
  onCompleted: () => void;
}

export function useChangeAssignee({
  request,
  onCompleted,
}: UseChangeAssigneeProps) {
  const { notifyError, notifySuccess } = useAppNotifications();

  const { user } = useUser();
  const [reassign] = useReassignTicketMutation();

  const { clearAllDrafts } = useFieldDraft({
    scope: request.businessId,
    field: "changeAssignee",
    getValue: () => "",
    storeName: STORE_NAMES.RELATED_REQUEST_DRAFTS,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (!user) return;

      setIsSubmitting(true);
      //  workGroup/itService НЕ меняются
      const payload: ReassignDTO = {
        businessId: request.businessId,
        taskId: request.taskId,
        workGroup: request.workGroup?.id ?? "",
        assignee: values.changeAssignee,
        itService: request.itService?.id ?? "",
        reasonReassignment: values.reason,
      };

      await reassign({ ...payload, engineerName: user.employeeNumber! })
        .unwrap()
        .then(async () => {
          await clearAllDrafts();
          onCompleted();
          notifySuccess("Смена исполнителя прошла успешно");
        })
        .catch((error) => {
          notifyError(
            `Ошибка при смене исполнителя: ${extractErrorMessage(error?.data)}`,
          );
        })
        .finally(() => setIsSubmitting(false));
    },
    [
      user,
      request,
      reassign,
      clearAllDrafts,
      onCompleted,
      notifyError,
      notifySuccess,
    ],
  );

  return {
    onSubmit,
    isSubmitting,
  };
}
