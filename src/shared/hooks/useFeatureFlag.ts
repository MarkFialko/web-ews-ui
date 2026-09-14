import {
  FEATURE_FLAGS,
  type FeatureFlagName,
} from "@shared/config/featureFlags";

/**
 * Возвращает, включена ли указанная фича.
 *
 * Хук -- простой объект доступа, не триггерит ререндер. Если в проекте
 * потребуется реактивность, заменить на `useMemo(() => FLAG, [])`.
 */
export const useFeatureFlag = (name: FeatureFlagName): boolean =>
  FEATURE_FLAGS[name];
