/**
 * DTO для запроса закрытия обращения /esm-actions/close-task/{taskNumber}
 * См. SberEsmCloseTaskDto в спецификации API
 */
export type CloseTaskRequest = {
  /** BusinessId запроса */
  businessId?: string;
  /** ID задачи в ESM */
  taskId?: string;
  /** Идентификатор рабочей группы (UUID) */
  workGroup?: string;
  /** Идентификатор исполнителя (UUID) */
  assignee?: string;
  /** Идентификатор ИТ-услуги (UUID) */
  itService?: string;
  /** Описание решения */
  resolutionDescription?: string;
  /** Код закрытия (например RESOLVED) */
  resolutionCode?: string;
  /** Причина закрытия INC */
  reasonINC?: string;
  /** Причина просрочки срока */
  targetDateLateReason?: string;
  /** Причина переадресации */
  reasonReassignment?: string;
  /** Причина закрытия */
  reason?: string;
  /** Итоговый статус (например COMPLETED) */
  finalStatus?: string;
};
