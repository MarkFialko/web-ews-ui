import { useCallback, useState } from "react";

import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";
import { STORE_NAMES } from "@shared/cache";
import type { RequestDTO } from "@shared/request";
import { useAppNotifications } from "@shared/notifications";
import { extractErrorMessage } from "@shared/api";

import type { FormValues } from "./useRelatedRequests";
import {
  useCreateZnrMutation,
  useCreateZpiMutation,
  useLazyGetTemplateUUIDQuery,
  type CreateZpiZnrPayload,
} from "../api/createZpiZnr";
import { useUser } from "@shared/user";

interface Props {
  request: RequestDTO;
  onCompleted: () => void;
}

export function useCreateZpiZnr({ request, onCompleted }: Props) {
  const { notifyError, notifySuccess } = useAppNotifications();

  const { user } = useUser();

  const [createZnr] = useCreateZnrMutation();
  const [createZpi] = useCreateZpiMutation();
  const [getTemplate] = useLazyGetTemplateUUIDQuery();

  const { clearAllDrafts } = useFieldDraft({
    scope: request.businessId,
    field: "transfer",
    getValue: () => "",
    storeName: STORE_NAMES.RELATED_REQUEST_DRAFTS,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsSubmitting(true);

      const isSR = request.businessId.toLocaleUpperCase().startsWith("SR");

      getTemplate(isSR ? "TSRT000000000" : "TINCT00000000001")
        .unwrap()
        .then(async (template) => {
          const payload: CreateZpiZnrPayload = {
            templateVersionId: template.templateId,
            initiator: user?.empObjectId ?? "Не определён",
            workGroup: values.workgroupUUID,
            itService: values.serviceUUID,
            targetDate: values.ks.toISOString(),
            description: values.description,
            finalStatus: "IN_WORKGROUP",
          };

          const reqFn = isSR
            ? createZnr({
                ...payload,
                requestId: request.taskId,
                assignee: values.assignee,
                stepNumber: null,
                title: request.title,
                tags: request.tags,
              })
            : createZpi({
                ...payload,
                incidentId: request.taskId,
                step: null,
              });

          await reqFn
            .unwrap()
            .then(async () => {
              await clearAllDrafts();
              onCompleted();
              notifySuccess("Создание прошло успешно");
            })
            .catch((error) => {
              notifyError(
                `Ошибка при создании ЗПИ/ЗНР: ${extractErrorMessage(error?.data)}`,
              );
            })
            .finally(() => setIsSubmitting(false));
        })
        .catch((error) => {
          setIsSubmitting(false);
          notifyError(
            `Не удалось получить идентификатор шаблона: ${extractErrorMessage(error?.data)}`,
          );
        });
    },
    [
      request.businessId,
      request.taskId,
      request.title,
      request.tags,
      getTemplate,
      user?.empObjectId,
      createZnr,
      createZpi,
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
