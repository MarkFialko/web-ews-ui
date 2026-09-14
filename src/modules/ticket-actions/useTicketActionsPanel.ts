import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  canCloseTicketInStatus,
  getCloseTicketDisabledReason,
  requiresIncidentReason,
  type ClosureOption,
} from "./model";
import {
  useGetWorkgroupsQuery,
  useGetCloseCodesQuery,
  useGetIncReasonQuery,
  useGetLateReasonQuery,
  useCloseTaskMutation,
  useGetServiceByCodeIdQuery,
  useGetWorkgroupByLabelQuery,
  useGetWorkgroupMembersQuery,
} from "./api";
import { useUser } from "@shared/user";
import { useTriageRequests } from "@modules/triage/model";
import { getStorageProvider, STORE_NAMES } from "@shared/cache";
import { resolveTicketActionEntityType, TICKET_TYPES } from "@shared/request";

import { CACHE_KEY } from "@modules/triage/api";
import type {
  TicketActionDirtyField,
  TicketActionDirtyState,
  TicketActionStateLike,
} from "./types/ticketActionDraft";
import {
  mapCloseCodes,
  mapIncReasons,
  mapLateReasons,
  mapWorkgroupTitles,
  mapMembersToOptions,
  toLabelValue,
} from "./utils/optionMappers";
import { buildEmptyDirtyState, markClean } from "./utils/dirtyStateFactory";
import { useSnackbar } from "notistack";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";
import { useRequestsRouter } from "@shared/routing";

type TicketGroupOption = string;

export type PanelViewData = {
  ticketActionState: TicketActionStateLike;
  ticketActionDraft: TicketActionStateLike;
  ticketActionDirty: TicketActionDirtyState;
  assigneeOptions: any[];
  isMembersLoading: boolean;
  workgroupCategories: any[];
  isWorkgroupsLoading: boolean;
  workgroupOptions: string[];
  selectedWorkgroupItem: any;
  serviceOptions: string[];
  selectedServiceId: number | undefined;
  isLabelLoading: boolean;
  isObjectLoading: boolean;
  isCloseCodesLoading: boolean;
  closureCodeOptions: ClosureOption[];
  incidentReasonOptions: ClosureOption[];
  lateReasonOptions: ClosureOption[];
  closeDisabled: boolean;
  isLate: boolean;
  savingField: TicketActionDirtyField | null;
  isSubmitting: boolean;
  openConfirm: boolean;
};

export type PanelCallbacks = {
  handleGroupChange: (value: string) => void;
  handleObjectChange: (value: string) => void;
  handleAssigneeChange: (value: any) => void;
  handleSaveField: (field: TicketActionDirtyField) => Promise<void>;
  handleClose: () => void;
  handleCancelClose: () => void;
  handleConfirmClose: () => void;
  handleSubmitClose: () => void;
  setSavingField: (field: TicketActionDirtyField | null) => void;
  setOpenConfirm: (open: boolean) => void;
};

export function useTicketActionsPanel(ticketId: string) {
  const { enqueueSnackbar } = useSnackbar();
  const { openRequests } = useRequestsRouter();
  const log = useWorklogLogger();

  const { clearAllDrafts } = useFieldDraft({
    scope: ticketId,
    field: "",
    getValue: () => "",
    storeName: STORE_NAMES.CLOSURE_DRAFTS,
  });

  const { triageRequests, isLoading: isTriageLoading } = useTriageRequests();

  const apiRequest = useMemo(
    () => triageRequests.find((r) => r.businessId === ticketId) ?? null,
    [triageRequests, ticketId],
  );

  const [ticketActionDraft, setTicketActionDraft] = useState({
    object: "",
    objectId: "",
    group: "",
    groupId: "",
    assigneeId: "",
    service: "",
  });

  const [ticketActionDirty, setTicketActionDirty] =
    useState<TicketActionDirtyState>(buildEmptyDirtyState());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closeTask] = useCloseTaskMutation();
  const [savingField, setSavingField] = useState<
    keyof TicketActionDirtyState | null
  >(null);

  const { data: assigneeOptions, isLoading: isMembersLoading } =
    useGetWorkgroupMembersQuery(
      ticketActionDraft.groupId !== ""
        ? ticketActionDraft.groupId
        : apiRequest?.workGroup?.id,
      {
        skip: !(ticketActionDraft.groupId !== ""
          ? ticketActionDraft.groupId
          : apiRequest?.workGroup?.id),
        refetchOnMountOrArgChange: true,
      },
    );

  const {
    handleSubmit: formHandleSubmit,
    control,
    reset,
    getValues,
    watch,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      object: "",
      group: "",
      assignee: "",
      closureCode: "",
      incidentReason: "",
      lateReason: "",
      resolution: "",
      actionReason: "",
    },
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const baselineRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const sub = watch((values, { name }) => {
      if (!name || !(name in baselineRef.current)) return;
      const current = String((values as Record<string, unknown>)[name] ?? "");
      const base = baselineRef.current[name] ?? "";
      const isDirty = current !== base;
      setTicketActionDirty((prev) =>
        prev[name as keyof TicketActionDirtyState] === isDirty
          ? prev
          : { ...prev, [name as keyof TicketActionDirtyState]: isDirty },
      );
    });
    return () => sub.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!apiRequest) return;
    let cancelled = false;

    const base = {
      object: apiRequest.itService?.label ?? "",
      group: apiRequest.workGroup?.workGroupLabel ?? "",
      assignee: apiRequest.assignee?.personalNumber ?? "",
      closureCode: "",
      incidentReason: "",
      lateReason: "",
      resolution: "",
      actionReason: "",
    };

    (async () => {
      const drafts: Record<string, string> = {};
      try {
        const prefix = `${ticketId}:`;
        const all = await getStorageProvider().getAllRecords<string>(
          STORE_NAMES.CLOSURE_DRAFTS,
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
      baselineRef.current = merged;

      setTicketActionDraft({
        object: merged.object,
        objectId: apiRequest.itService?.id ?? "",
        group: merged.group,
        groupId: apiRequest.workGroup?.id ?? "",
        assigneeId: apiRequest.assignee?.id ?? "",
        service: merged.object,
      });
      setTicketActionDirty(buildEmptyDirtyState());
    })();

    return () => {
      cancelled = true;
    };
  }, [apiRequest, ticketId, reset]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const entityType = resolveTicketActionEntityType(ticketId);

  const { user } = useUser();
  const employeeNumber = user?.employeeNumber;

  const isLate = useMemo(
    () =>
      (entityType === TICKET_TYPES.INC || entityType === TICKET_TYPES.SR) &&
      apiRequest?.targetDate != null &&
      new Date(apiRequest.targetDate).getTime() < Date.now(),
    [apiRequest, entityType],
  );

  const objectValue = useWatch({ control, name: "object" });
  const groupValue = useWatch({ control, name: "group" });

  const apiObject = apiRequest?.itService?.label ?? "";
  const apiGroup = apiRequest?.workGroup?.workGroupLabel ?? "";

  const isReassigned = useMemo(
    () => (objectValue ?? "") !== apiObject || (groupValue ?? "") !== apiGroup,
    [objectValue, groupValue, apiObject, apiGroup],
  );

  const handleConfirmClose = () => {
    setIsSubmitting(true);
    setOpenConfirm(false);
    formHandleSubmit(onSubmitClose)();
  };

  const handleCancelClose = () => {
    setIsSubmitting(false);
    setOpenConfirm(false);
  };

  const handlePerformClose = () => {
    if (ticketActionDirty.assignee) {
      setOpenConfirm(true);
    } else {
      setIsSubmitting(true);
      handleConfirmClose();
    }
  };

  const onSubmitClose = useCallback(
    async (data: Record<string, string>) => {
      try {
        const cv = getValues();
        const grpChanged = cv.group !== apiRequest?.workGroup?.workGroupLabel;
        const objChanged = cv.object !== apiRequest?.itService?.label;

        await closeTask({
          taskNumber: ticketId,
          engineerName: employeeNumber,
          body: {
            businessId: ticketId,
            taskId: apiRequest?.taskId ?? "",
            workGroup: grpChanged ? ticketActionDraft.groupId || null : null,
            assignee: ticketActionDirty.assignee
              ? ticketActionDraft.assigneeId || null
              : null,
            itService: objChanged ? ticketActionDraft.objectId || null : null,
            resolutionDescription: data.resolution,
            resolutionCode: data.closureCode,
            reasonINC: requiresIncidentReason(entityType)
              ? data.incidentReason
              : null,
            targetDateLateReason: isLate ? data.lateReason : null,
            reasonReassignment: isReassigned ? data.actionReason : null,
            reason: null,
            finalStatus: "COMPLETED",
          },
        }).unwrap();

        /* успех: подчищаем черновики этой заявки */
        await clearAllDrafts();

        /* индексный кэш: удалить заявку из кэшированного списка (не сносить весь кэш) */
        try {
          const p = getStorageProvider();
          const entry = await p.getRecord<any>(STORE_NAMES.TRIAGE, CACHE_KEY);
          if (entry && Array.isArray(entry.value)) {
            entry.value = entry.value.filter(
              (r: any) => r.businessId !== ticketId,
            );
            await p.setRecord(STORE_NAMES.TRIAGE, CACHE_KEY, entry);
          }
        } catch {
          /* идемпотентно */
        }

        /* IndexedDB: удалить кэшированные данные клиента по этой заявке */
        try {
          const p = getStorageProvider();
          await Promise.allSettled([
            p.deleteRecord(STORE_NAMES.REQUEST_EMPLOYEE, ticketId),
            p.deleteRecord(STORE_NAMES.REQUEST_PHOTO, ticketId),
            p.deleteRecord(STORE_NAMES.REQUEST_ARMS, ticketId),
            p.deleteRecord(STORE_NAMES.REQUEST_ACCESS, ticketId),
            p.deleteRecord(STORE_NAMES.REQUEST_TICKETS, ticketId),
          ]);
        } catch {
          /* идемпотентно */
        }

        enqueueSnackbar("Заявка переведена в статус «Выполнен».", {
          variant: "success",
        });

        log({
          task: ticketId,
          action: WORKLOG_ACTIONS.CLOSE_TASK,
        });

        // Переназначение на группу — отдельное событие
        if (isReassigned) {
          log({
            task: ticketId,
            action: WORKLOG_ACTIONS.REDIRECT_TASK_ON_GROUP,
            commentParams: { group: cv.group },
          });
        }

        // Переназначение другому исполнителю — отдельное событие
        if (ticketActionDirty.assignee) {
          log({
            task: ticketId,
            action: WORKLOG_ACTIONS.REDIRECT_TASK_ON_USER,
          });
        }

        // Причина просрочки / код закрытия
        if (isLate || data.lateReason) {
          log({
            task: ticketId,
            action: WORKLOG_ACTIONS.TASK_REAZON,
          });
        }

        // Решение (протокол закрытия)
        if (data.resolution) {
          log({
            task: ticketId,
            action: WORKLOG_ACTIONS.WRITE_INFO_DECISION,
          });
        }

        /* НЕ снимаем isSubmitting — форма остаётся заблокированной до ухода */
        openRequests();
      } catch (e: any) {
        const serverMsg = e?.data?.message ?? e?.data?.error ?? "";
        enqueueSnackbar(serverMsg || "Не удалось закрыть заявку.", {
          variant: "error",
        });
        /* черновики НЕ удаляем, кэш НЕ сносим, редирект НЕ делаем */
        setIsSubmitting(false);
      }
    },
    [
      ticketId,
      entityType,
      ticketActionDraft,
      apiRequest,
      isLate,
      isReassigned,
      ticketActionDirty,
      closeTask,
      enqueueSnackbar,
      employeeNumber,
      openRequests,
      getValues,
      reset,
    ],
  );

  const { data: workgroupCategories = [], isLoading: isWorkgroupsLoading } =
    useGetWorkgroupsQuery({
      unit: user?.unit ?? "",
      direction: user?.direction ?? "",
    });

  const { data: workgroupData, isLoading: isLabelLoading } =
    useGetWorkgroupByLabelQuery(ticketActionDraft.group || "", {
      skip:
        !ticketActionDraft.group || ticketActionDraft.group === "first-line",
    });

  const { data: objectData, isLoading: isObjectLoading } =
    useGetServiceByCodeIdQuery(
      (() => {
        const ciMatch = ticketActionDraft.object?.match(/CI[0-9]{8}/);
        return ciMatch ? ciMatch[0] : "";
      })(),
      { skip: !ticketActionDraft.object, refetchOnMountOrArgChange: true },
    );

  const workgroupOptions: TicketGroupOption[] = useMemo(
    () => mapWorkgroupTitles(workgroupCategories),
    [workgroupCategories],
  );

  const selectedWorkgroupItem = useMemo(() => {
    if (!ticketActionDraft.group && !apiRequest?.workGroup?.id)
      return undefined;
    const workgroupId =
      ticketActionDraft.group !== ""
        ? ticketActionDraft.group
        : apiRequest?.workGroup?.workGroupLabel;
    for (const category of workgroupCategories) {
      for (const item of category.workgroupItems) {
        if (item.title === workgroupId) return item;
      }
    }
    return undefined;
  }, [ticketActionDraft.group, workgroupCategories, apiRequest]);

  const serviceOptions: string[] = useMemo(() => {
    if (!selectedWorkgroupItem) return [];
    return selectedWorkgroupItem.workgroupSettings.map(
      (setting) => setting.service,
    );
  }, [selectedWorkgroupItem]);

  const selectedServiceId = useMemo(() => {
    if (!selectedWorkgroupItem || !ticketActionDraft.service) return undefined;
    const setting = selectedWorkgroupItem.workgroupSettings.find(
      (s) => s.service === ticketActionDraft.service,
    );
    return setting?.id;
  }, [selectedWorkgroupItem, ticketActionDraft.service]);

  const closeDisabled =
    !apiRequest ||
    !canCloseTicketInStatus((apiRequest as any)?.stateCode ?? "");
  const closeDisabledReason = apiRequest
    ? getCloseTicketDisabledReason((apiRequest as any)?.stateCode ?? "")
    : undefined;

  const {
    data: closeCodesResponse = { items: [] },
    isLoading: isCloseCodesLoading,
  } = useGetCloseCodesQuery();

  const closureCodeOptions = useMemo(
    () => mapCloseCodes(closeCodesResponse, entityType),
    [closeCodesResponse, entityType],
  );

  const { data: incReasonResponse } = useGetIncReasonQuery();

  const incidentReasonOptions = useMemo(
    () => mapIncReasons(incReasonResponse),
    [incReasonResponse],
  );

  const { data: lateReasonResponse = { items: [] } } = useGetLateReasonQuery();

  const lateReasonOptions = useMemo(
    () => mapLateReasons(lateReasonResponse, entityType),
    [lateReasonResponse, entityType],
  );

  const handleSaveField = useCallback(
    async (field: keyof TicketActionDirtyState) => {
      if (!ticketId) return;
      setSavingField(field);
      try {
        const value = String(
          (getValues() as Record<string, unknown>)[field] ?? "",
        );
        await getStorageProvider().setRecord<string>(
          STORE_NAMES.CLOSURE_DRAFTS,
          `${ticketId}:${field}`,
          value,
        );
        baselineRef.current = { ...baselineRef.current, [field]: value };
        setTicketActionDirty((prev) => markClean(prev, field));
        enqueueSnackbar("Сохранено.", { variant: "success" });

        // Сохранение решения — отдельное событие в ленте
        if (field === "resolution" && value) {
          log({
            task: ticketId,
            action: WORKLOG_ACTIONS.WRITE_INFO_DECISION,
          });
        }
      } catch {
        enqueueSnackbar("Не удалось сохранить.", { variant: "error" });
      } finally {
        setSavingField(null);
      }
    },
    [ticketId, getValues, enqueueSnackbar, log],
  );

  /* groupValue → активный запрос byLabel → groupId → members (цепочка для A — смена РГ)
     Эффект: когда пользователь меняет РГ в форме, получаем id новой РГ через API и обновляем groupId,
     чтобы запросился новый состав members. */
  useEffect(() => {
    if (!groupValue || groupValue === apiRequest?.workGroup?.workGroupLabel)
      return;
    setTicketActionDraft((prev) => ({
      ...prev,
      group: groupValue,
      groupId: "",
    }));
  }, [groupValue, apiRequest]);

  useEffect(() => {
    if (!workgroupData?.id) return;
    setTicketActionDraft((prev) => ({ ...prev, groupId: workgroupData.id }));
  }, [workgroupData?.id]);

  useEffect(() => {
    if (!objectData?.guid) return;
    setTicketActionDraft((prev) => ({ ...prev, objectId: objectData.guid }));
  }, [objectData]);

  const selectedGroupOption: string | null =
    ticketActionDraft.group &&
    workgroupOptions.includes(ticketActionDraft.group)
      ? ticketActionDraft.group
      : apiRequest?.workGroup?.workGroupLabel
        ? apiRequest?.workGroup?.workGroupLabel
        : null;

  const currentAssignee = useMemo(() => {
    if (!assigneeOptions || !ticketActionDraft.assigneeId) return null;
    return (
      assigneeOptions.find((o) => o.userId === ticketActionDraft.assigneeId) ??
      null
    );
  }, [ticketActionDraft.assigneeId, assigneeOptions]);

  const objectOptionsForm = useMemo(() => {
    const base = apiRequest?.itService?.label
      ? [
          {
            label: apiRequest.itService.label,
            value: apiRequest.itService.label,
          },
        ]
      : [];
    const extra = (serviceOptions ?? []).filter(
      (o) => !base.some((b) => b.value === o),
    );
    return base.concat(toLabelValue(extra));
  }, [apiRequest, serviceOptions]);

  const workgroupOptionsForm = useMemo(() => {
    const base = apiRequest?.workGroup?.workGroupLabel
      ? [
          {
            label: apiRequest.workGroup.workGroupLabel,
            value: apiRequest.workGroup.workGroupLabel,
          },
        ]
      : [];
    const extra = (workgroupOptions ?? []).filter(
      (o) => !base.some((b) => b.value === o),
    );
    return base.concat(toLabelValue(extra));
  }, [apiRequest, workgroupOptions]);

  const assigneeOptionsForm = useMemo(() => {
    const cur = apiRequest?.assignee
      ? {
          label:
            [
              apiRequest.assignee.lastName,
              apiRequest.assignee.firstName,
              apiRequest.assignee.middleName,
            ]
              .filter(Boolean)
              .join(" ") || apiRequest.assignee.personalNumber,
          value: apiRequest.assignee.personalNumber ?? "",
        }
      : null;
    if (!cur) return [];
    const members = mapMembersToOptions(assigneeOptions ?? []);
    const dedup = members.filter((m) => m.value !== cur.value);
    return [cur, ...dedup];
  }, [apiRequest, assigneeOptions]);

  return {
    ticketActionDraft,
    ticketActionDirty,
    assigneeOptions,
    isTriageLoading,
    assigneeOptionsForm,
    objectOptionsForm,
    workgroupOptionsForm,
    isMembersLoading,
    workgroupCategories,
    isWorkgroupsLoading,
    workgroupOptions,
    selectedWorkgroupItem,
    serviceOptions,
    selectedServiceId,
    isLabelLoading,
    isObjectLoading,
    isCloseCodesLoading,
    closureCodeOptions,
    incidentReasonOptions,
    lateReasonOptions,
    closeDisabled,
    closeDisabledReason,
    isLate,
    isReassigned,
    savingField,
    isSubmitting,
    openConfirm,
    entityType,
    selectedGroupOption,
    currentAssignee,
    workgroupData,
    objectData,
    apiRequest,
    control,
    formHandleSubmit,
    formErrors,
    handleConfirmClose,
    handlePerformClose,
    handleCancelClose,
    onSubmitClose,
    handleSaveField,
    setSavingField,
    setOpenConfirm,
    reset,
  };
}
