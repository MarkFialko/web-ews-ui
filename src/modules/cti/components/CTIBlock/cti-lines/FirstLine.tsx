import { useCTI } from "@modules/cti/model";
import { LineWrapper } from "./LineWrapper";
import { PhoneNumberSelect } from "../PhoneNumberSelect";
import { EndCall, HoldResumeCall } from "../cti-actions";

export const FirstLine = () => {
  const { firstLine, participantsWithoutMe, isTransfer, isConference } =
    useCTI();

  const extraActions = isTransfer ? (
    <>
      <EndCall />
      <HoldResumeCall party={participantsWithoutMe[0]} />
    </>
  ) : null;

  const helperText = isConference ? "Конференция" : undefined;

  const value = isConference ? "" : firstLine;

  return (
    <LineWrapper extraActions={extraActions}>
      <PhoneNumberSelect
        value={value}
        label="Линия 1"
        helperText={helperText}
        disabled
      />
    </LineWrapper>
  );
};
