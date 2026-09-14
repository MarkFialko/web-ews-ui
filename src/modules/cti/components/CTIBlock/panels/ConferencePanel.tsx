import { useCTI } from "@modules/cti/model";

import { ConferenceIcon, ConsultationIcon } from "../cti-actions";
import { FirstLine, SecondLine, ThirdLine } from "../cti-lines";
import { LinesPanel } from "../LinesPanel";
import type { IPartyListParticipant } from "@sber-scpl/core/jssdk";

const isConsultant = (party: IPartyListParticipant) => {
  return (
    party && (party.party === "consultant" || party.party === "extConsultant")
  );
};

export const ConferencePanel = () => {
  const {
    secondLine,
    thirdLine,
    participantsWithoutMe,
    isTransfer,
    isConference,
  } = useCTI();

  const consultant = participantsWithoutMe.find(isConsultant);

  const isPark = consultant?.state === "park";

  const isActionsDisabled = isConference;

  const Action = isTransfer ? (
    <ConferenceIcon disabled={isActionsDisabled || isPark} />
  ) : (
    <ConsultationIcon
      value={secondLine}
      disabled={secondLine.trim().length === 0 || isActionsDisabled}
    />
  );

  return (
    <LinesPanel title="Создание конференции">
      <FirstLine />
      <SecondLine consultant={consultant} disabled={isActionsDisabled}>
        {Action}
      </SecondLine>
      <ThirdLine>
        <ConsultationIcon
          disabled={thirdLine.trim().length === 0 || isActionsDisabled}
          value={thirdLine}
        />
      </ThirdLine>
    </LinesPanel>
  );
};
