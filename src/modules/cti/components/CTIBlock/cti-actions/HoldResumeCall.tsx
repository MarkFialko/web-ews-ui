import { WORKLOG_ACTIONS } from "@shared/worklog-logger";

import { CallActionIcon } from "../../common";
import { useAgentAction } from "@modules/cti/model";
import type { IPartyListParticipant } from "@sber-scpl/core/jssdk";
import { PauseIcon } from "./PauseIcon";

interface Props {
  party?: IPartyListParticipant;
  disabled?: boolean;
}

export const HoldResumeCall = (props: Props) => {
  const { party, disabled } = props;

  const holdAction = useAgentAction(
    "interaction",
    (interaction) => interaction.hold([party.callID!]),
    "Не удалось поставить на удержание",
    WORKLOG_ACTIONS.CTI_HOLD,
  );

  const resumeAction = useAgentAction(
    "interaction",
    (interaction) => interaction.resume(party.callID!),
    "Не удалось снять с удержания",
    WORKLOG_ACTIONS.CTI_RESUME,
  );

  const onHoldResumeCall = () => {
    if (!party) return;
    if (party.hold) {
      resumeAction.execute();
    } else {
      holdAction.execute();
    }
  };

  return (
    <CallActionIcon
      label={party?.hold ? "Вернуть звонок" : "Поставить на ожидание"}
      icon={<PauseIcon disabled={disabled} />}
      active={party?.hold}
      onClick={onHoldResumeCall}
      disabled={disabled}
    />
  );
};
