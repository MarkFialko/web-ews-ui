/** Реестр фича-флагов приложения. Библиотеки читают флаг через
 * хук `useFeatureFlag`, а не напрямую из этого модуля.
 */

export type FeatureFlagName = "worklogLogging";

/**
 * Текущие значения флагов.
 *
 * Временно: значение задаётся здесь, пока не настроены переменные окружения.
 * Чтобы включить логирование локально, поменяй значение на true.
 */
export const FEATURE_FLAGS: Record<FeatureFlagName, boolean> = {
  worklogLogging: !import.meta.env.DEV,
};
