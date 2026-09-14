import type { EngineerRequestStatus } from "@modules/engineer-requests/types/EngineerRequest";

import type { ClosureOption } from "../model/closureCodes";
import type { TicketActionEntityType } from "@shared/request";

/** Поля заявки, которые можно сохранять по отдельности */
export type TicketActionDirtyField =
  | "object"
  | "group"
  | "assignee"
  | "resolution"
  | "service"
  | "actionReason"
  | "closureCode"
  | "incidentReason"
  | "lateReason";

/** Состояние dirty-флагов: true = поле изменено, не сохранено */
export type TicketActionDirtyState = Record<TicketActionDirtyField, boolean>;

/** Текущее состояние заявки (плоское) */
export type TicketActionStateLike = {
  status: EngineerRequestStatus;
  entityType: TicketActionEntityType;
  object: string;
  objectId: string;
  group: string;
  groupId: string;
  assignee: string;
  assigneeId: string;
  resolution: string;
  service: string;
  actionReason: string;
};

/** Значения формы закрытия (плоские, из react-hook-form) */
export type ClosureFormValues = {
  object: string;
  group: string;
  assignee: string;
  closureCode: string;
  incidentReason: string;
  lateReason: string;
  resolution: string;
  actionReason: string;
};

/** Данные для рендеринга панели */
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
  handleCancelClose: () => void;
  handleConfirmClose: () => void;
  handleSubmitClose: () => void;
  handlePerformClose: () => void;
  setSavingField: (field: TicketActionDirtyField | null) => void;
  setOpenConfirm: (open: boolean) => void;
};
