import type { TemplateDTO } from "@modules/related-requests/api/createZpiZnr";

export const templateMock: TemplateDTO = {
  templateId: "tpl-0001",
  versionId: "tpl-0001-v1",
  isLatest: true,
  businessId: "SR0001030593",
  title: "Шаблон заявки на техническую работу",
  description: "Шаблон для создания ЗНР по инциденту недоступности сервиса",
  resourceType: "1C-ENTERPRISE",
  templateType: "SRT",
  isActive: true,
  fields: [
    {
      code: "workGroup",
      name: "Рабочая группа",
      isDynamic: false,
      type: "STRING",
      enumId: "",
      config: [],
      isMandatory: true,
      isEditable: true,
      defaultValue: "1-я линия поддержки",
    },
    {
      code: "targetDate",
      name: "Плановая дата выполнения",
      isDynamic: false,
      type: "DATE",
      enumId: "",
      config: [],
      isMandatory: true,
      isEditable: true,
      defaultValue: "",
    },
  ],
};

export const reassignResultMock = { taskId: "task-0001030593" };
