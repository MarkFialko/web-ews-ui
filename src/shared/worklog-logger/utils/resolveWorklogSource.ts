import type { WorklogSource } from "@shared/worklog";
import { ACTION_SOURCE_MAP } from "../constants/actions";

/**
 * Источник для кода действия.
 * У неизвестного кода source по умолчанию `webEws` — служебное событие не
 * должно попасть в ленту само собой.
 */
export function resolveWorklogSource(action: string): WorklogSource {
  return (
    ACTION_SOURCE_MAP[action as keyof typeof ACTION_SOURCE_MAP] ?? "webEws"
  );
}
