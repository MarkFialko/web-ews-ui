import { extractServiceCode } from "../utils/serviceCode";
import type { FormValues, WorkgroupServiceOption } from "./useRelatedRequests";

const assignee = {
  required: "Необходимо выбрать исполнителя",
} as const;

const reason = {
  required: "Причина должна содержать не менее 5 символов, но не более 1000",
  minLength: {
    value: 5,
    message: "Причина должна содержать не менее 5 символов, но не более 1000",
  },
  maxLength: {
    value: 1000,
    message: "Причина должна содержать не менее 5 символов, но не более 1000",
  },
} as const;

const workgroupWithService = {
  validate: (value: WorkgroupServiceOption | null, values: FormValues) => {
    if (!value?.workgroupLabel || !value?.service)
      return "Необходимо выбрать рабочую группу и услугу";

    if (!extractServiceCode(value?.service))
      return `Неверный сервис: ${value?.service}`;

    let message = "";

    if (!values.workgroupUUID)
      message += "Не удалось получить рабочую группу. ";
    if (!values?.serviceUUID) message += "Не удалось получить сервис";

    if (message.length > 0) return message;

    return true;
  },
};
const description = {
  required: "Минимальное количество символов - 10",
  minLength: {
    value: 10,
    message: "Минимальное количество символов - 10",
  },
} as const;

export const rules = {
  assignee,
  reason,
  workgroupWithService,
  description,
} as const;
