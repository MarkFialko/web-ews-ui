import { useEffect, useState, type SubmitEvent } from "react";
import { useForm } from "react-hook-form";

import { useOptimisticTaskCache } from "@modules/request-card";

import { useAppNotifications } from "@shared/notifications";
import { extractErrorMessage } from "@shared/api";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";

import { getStorageProvider, STORE_NAMES } from "@shared/cache";
import { PROTOCOL_TYPE_CODES, useProtocol } from "@shared/protocol";

import type { FormValues } from "./types";

const DEFAULT_FORM_VALUES: FormValues = {
  typeCode: PROTOCOL_TYPE_CODES.ENGINEER_MESSAGE,
  message: "",
};

export const useProtocolPanel = (ticketId: string) => {
  const { notifyError } = useAppNotifications();

  const { clearAllDrafts } = useFieldDraft({
    scope: ticketId,
    field: "",
    getValue: () => "",
    storeName: STORE_NAMES.PROTOCOL_DRAFTS,
  });

  const { taskData: request } = useOptimisticTaskCache(ticketId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { sendToProtocol } = useProtocol();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onSubmit",
    shouldUnregister: false,
  });

  useEffect(() => {
    let cancelled = false;

    const base = DEFAULT_FORM_VALUES;

    (async () => {
      const drafts: Record<string, string> = {};
      try {
        const prefix = `${ticketId}:`;
        const all = await getStorageProvider().getAllRecords<string>(
          STORE_NAMES.PROTOCOL_DRAFTS,
        );
        all
          .filter((r) => r.key.startsWith(prefix))
          .forEach((r) => {
            const field = r.key.slice(prefix.length);
            if (field in base) drafts[field] = r.value;
          });
      } catch {
        /* черновиков нет — ок */
      }
      if (cancelled) return;

      const merged = { ...base, ...drafts };
      reset(merged, { keepDirtyValues: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [ticketId, reset]);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    return handleSubmit((values: FormValues) => {
      if (!request) return;

      setIsSubmitting(true);

      sendToProtocol(request, values.message, values.typeCode)
        .then(() => {
          clearAllDrafts();
          reset(DEFAULT_FORM_VALUES);
        })
        .catch((e) =>
          notifyError(
            "Не удалось отправить сообщение в протокол: " +
              extractErrorMessage(e?.data),
          ),
        )
        .finally(() => {
          setIsSubmitting(false);
        });
    })();
  };

  return { control, onSubmit, isSubmitting } as const;
};
