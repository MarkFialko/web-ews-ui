import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

import { CallActionIcon } from "../../common";
import { useCTI, useAgentAction } from "@modules/cti/model";
import { PauseIcon } from "./PauseIcon";

export const HoldResumeConference = () => {
  const { interaction, participantsWithoutMe, isConference } = useCTI();
  const log = useWorklogLogger();

  const isParticipantsOnHold = participantsWithoutMe.every((p) => p.hold);

  const callIDs = participantsWithoutMe.map((p) => p.callID!);

  const holdAction = useAgentAction(
    "interaction",
    (interaction) => interaction.hold(callIDs),
    "Не удалось поставить конференцию на удержание",
    WORKLOG_ACTIONS.CTI_HOLD,
  );

  const resumeAction = useAgentAction(
    "interaction",
    (interaction) => {
      participantsWithoutMe.forEach((p) => interaction.resume(p.callID!));
    },
    "Не удалось снять конференцию с удержания",
    WORKLOG_ACTIONS.CTI_RESUME,
  );

  if (!isConference) return null;

  const onHoldResumeConference = () => {
    if (participantsWithoutMe.length === 0 || !interaction) return;

    if (isParticipantsOnHold) {
      resumeAction.execute();
      return;
    }

    holdAction.execute();
  };

  return (
    <CallActionIcon
      label={
        isParticipantsOnHold
          ? "Снять конференци с удержания"
          : "Поставить конференцию на удержание"
      }
      icon={<PauseIcon />}
      active={isParticipantsOnHold}
      onClick={onHoldResumeConference}
    />
  );
};
