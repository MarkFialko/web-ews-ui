import { useCTI } from "@modules/cti/model";
import { LineWrapper } from "./LineWrapper";
import { PhoneNumberSelect } from "../PhoneNumberSelect";
import type { PropsWithChildren } from "react";
import type { IPartyListParticipant } from "@sber-scpl/core/jssdk";
import {
  EndConsultationIcon,
  HoldResumeCall,
} from "@modules/cti/components/CTIBlock/cti-actions";

interface Props {
  consultant?: IPartyListParticipant;
  disabled: boolean;
}

/** Линия консультации */
export const SecondLine = (props: PropsWithChildren<Props>) => {
  const { consultant, disabled, children } = props;
  const { secondLine, setSecondLine, isConference } = useCTI();

  const isPark = consultant?.state === "park";

  const extraActions =
    consultant && !isConference ? (
      <>
        <EndConsultationIcon disabled={disabled} />
        <HoldResumeCall party={consultant} disabled={disabled || isPark} />
      </>
    ) : null;

  return (
    <LineWrapper extraActions={extraActions}>
      <PhoneNumberSelect
        value={secondLine}
        onChange={setSecondLine}
        label="Линия 2"
        disabled={false}
      />
      {children}
    </LineWrapper>
  );
};
