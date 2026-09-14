import { Stack, type Theme } from "@mui/material";
import { EndCall, EndConference, StartCall } from "./cti-actions";
import { PhoneNumberSelect } from "./PhoneNumberSelect";
import { useCTI } from "@modules/cti/model";

const SX = (theme: Theme) => ({
  flexDirection: "row",
  gap: theme.spacing(0.75),
  alignItems: "center",
  justifyContent: "flex-start",
});

export const InteractionAction = () => {
  const {
    isCallActive,
    isPostProcessing,
    firstLine,
    setFirstLine,
    isConference,
  } = useCTI();

  const EndAction = isConference ? <EndConference /> : <EndCall />;

  return (
    <Stack sx={SX}>
      <PhoneNumberSelect
        label={isCallActive ? "Звонок на номер" : "Номер телефона"}
        value={firstLine}
        onChange={setFirstLine}
        disabled={isPostProcessing || isCallActive}
      />
      {isCallActive ? (
        EndAction
      ) : (
        <StartCall disabled={isPostProcessing} phoneNumber={firstLine} />
      )}
    </Stack>
  );
};
