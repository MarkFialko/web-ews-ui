/**
 * DTO данных для автозаполнения формы локальной поддержки
 * из API SberEsm (endpoint: /sbs/get-new-task/{entityId})
 */
export type SberEsmSbsResponse = {
  vsp?: boolean;
  address?: string;
  territorialBank?: string;
  serviceId?: string;
  pcName?: string;
  telephone?: string;
};
