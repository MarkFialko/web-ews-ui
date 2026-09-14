import { useCallback, useState } from "react";

import type {
  IAgent,
  IWebSocketTransactionResult,
  IVoiceInteraction,
} from "@sber-scpl/core/jssdk";

import { useAppNotifications } from "@shared/notifications";
import { useTelephonyService } from "./TelephonyProvider";
import { useActiveVoiceInteraction } from "./useActiveVoiceInteraction";
import { useWorklogLogger, type WorklogAction } from "@shared/worklog-logger";
import { useVoiceInteractionSnapshot } from "./useVoiceInteractionSnapshot";
import { useAgentSnapshot } from "./useAgentSnapshot";

export interface UseAgentActionOptions {
  onSuccess?: () => void;
  onError?: (defaultMessage: string, resultDesc?: string) => void;
}

export type AgentActionTarget = "agent" | "interaction";

type AgentActionFn<T> = (agent: IAgent) => T;
type InteractionActionFn<T> = (interaction: IVoiceInteraction) => T;

/** Результат действия — либо { ok, resultDesc? }, либо void (для hold/resume/accept/hangup). */
type AgentActionResult = IWebSocketTransactionResult | void;

/**
 * Обёртка над вызовами CTI SDK:
 * - **agent-методы** (`createOutInteraction`, `transfer`, `changeState`, `joinToConference`,
 *   `cancelTransfer` и т.д.)
 * - **interaction-методы** (`muteMicrophone`, `unmuteMicrophone`, `hold`, `resume`,
 *   `accept`, `hangup` и т.д.)
 *
 * Автоматически показывает ошибку через `useAppNotifications`, если результат содержит
 * `ok === false`. Для методов, возвращающих `void` (hold, resume, accept, hangup),
 * успех считается по умолчанию — ошибка показывается только при выбрасывании исключения.
 *
 * **Используется для CTI SDK-методов** (возвращают `{ ok, resultDesc? }` или `void`).
 * Для RTK Query мутаций использовать обычный `.unwrap().then().catch()`.
 *
 * @example // agent
 * ```tsx
 * const { execute, isLoading } = useAgentAction(
 *   "agent",
 *   (agent) =>
 *     agent.createOutInteraction({
 *       destination: phone,
 *       outboundTo: OutboundInteractionOptions.DESTINATION_NUMBER,
 *       channel: "call",
 *     }),
 *   "Не удалось совершить вызов",
 *   {
 *     onSuccess: () => logWorklog({ action: WORKLOG_ACTIONS.CALL_DIAL }),
 *   },
 * );
 * ```
 *
 * @example // interaction
 * ```tsx
 * const { execute, isLoading } = useAgentAction(
 *   "interaction",
 *   (interaction) => interaction.muteMicrophone(),
 *   "Не удалось заглушить микрофон",
 *   {
 *     onSuccess: () => setIsMuted(true),
 *   },
 * );
 * ```
 */
export function useAgentAction(
  target: AgentActionTarget,
  actionFn:
    | AgentActionFn<Promise<IWebSocketTransactionResult>>
    | InteractionActionFn<Promise<IWebSocketTransactionResult> | void>,
  defaultErrorMessage: string,
  action: WorklogAction,
  options?: UseAgentActionOptions,
) {
  const [isLoading, setIsLoading] = useState(false);
  const { notifyError } = useAppNotifications();
  const service = useTelephonyService();
  const interaction = useActiveVoiceInteraction();
  const interactionSnapshot = useVoiceInteractionSnapshot(interaction);
  const agentSnapshot = useAgentSnapshot();

  const log = useWorklogLogger();

  const execute = useCallback(async () => {
    setIsLoading(true);
    try {
      const entity = target === "agent" ? service.getAgent() : interaction;

      if (!entity) {
        const entityName = target === "agent" ? "Агент" : "Взаимодействие";
        const message = `${entityName} не инициализирован`;
        notifyError(message);
        options?.onError?.(message);
        return;
      }

      const isAgent = target === "agent";

      log({
        action,
        task: isAgent ? "Agent" : `ID взаимодействия: ${interaction!.id}`,
        commentParams: {
          data: JSON.stringify(
            (isAgent ? agentSnapshot : interactionSnapshot) ?? {},
          ),
        },
      });

      const result: AgentActionResult =
        target === "agent"
          ? await (actionFn as AgentActionFn<Promise<AgentActionResult>>)(
              entity as IAgent,
            )
          : await (
              actionFn as InteractionActionFn<Promise<AgentActionResult>>
            )(entity as IVoiceInteraction);

      log({
        action,
        task: isAgent ? "Agent" : `ID взаимодействия: ${interaction!.id}`,
        commentParams: {
          data: JSON.stringify(result ?? {}),
        },
      });

      // Для void-результатов (hold, resume, accept, hangup) успех по умолчанию.
      if (result === undefined || result === null) {
        options?.onSuccess?.();
        return;
      }

      // Для результатов с полем ok (muteMicrophone, createOutInteraction и т.д.).
      if (!result?.ok) {
        const message = result?.resultDesc
          ? `${defaultErrorMessage}: ${result.resultDesc}`
          : defaultErrorMessage;
        notifyError(message);
        options?.onError?.(message, result?.resultDesc);
        return;
      }

      options?.onSuccess?.();
    } catch (error) {
      notifyError(defaultErrorMessage);
      options?.onError?.(defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    action,
    actionFn,
    defaultErrorMessage,
    interaction,
    log,
    notifyError,
    options,
    service,
    target,
  ]);

  return { execute, isLoading };
}
