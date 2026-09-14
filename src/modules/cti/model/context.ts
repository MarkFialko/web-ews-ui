import type { IVoiceInteraction } from "@sber-scpl/core/jssdk";

export const CONTEXT_KEY_MAP = {
  employeeNumber: "employeeNumber", // Табельный номер
  classinf1: "classinf1", // Суть обращения
  classinf2: "classinf2", // Домен
  classinf3: "classinf3", // ОС
  information: "information", // Решение
  objectID: "objectID", // Объект
} as const;

export const CONTEXT_KEYS = Object.values(CONTEXT_KEY_MAP);

export type CTIContext = Record<keyof typeof CONTEXT_KEY_MAP, string | null>;

export const getContext = async (
  interaction?: IVoiceInteraction,
): Promise<CTIContext> => {
  if (!interaction) return Promise.reject(null);
  const result = await interaction.getContext(CONTEXT_KEYS);

  const context = result?.ok
    ? ((result?.data?.data as CTIContext) ?? null)
    : null;

  return context ? Promise.resolve(context) : Promise.reject(null);
};
