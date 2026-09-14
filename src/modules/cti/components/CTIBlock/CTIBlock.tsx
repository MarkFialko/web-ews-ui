import { useState } from "react";
import { Stack } from "@mui/material";
import { AddCall, PhoneForwarded } from "@mui/icons-material";

import { CallActionIcon } from "../common";
import { AgentLayout } from "./agent";
import { AudioControls } from "./audio";
import { HoldResumeCall } from "./cti-actions";
import { IncomingCallDialog } from "./IncomingCallDialog";
import { CTITabsPanel } from "./tabs";
import { useCTI } from "@modules/cti/model";
import { PostProcessing } from "./PostProcessing";
import { InteractionAction } from "./InteractionAction";
import { ConferencePanel, TransferPanel } from "./panels";
import { HoldResumeConference } from "./cti-actions/HoldResumeConference";

export const CTIBlock = () => {
  const {
    workitemState,
    participantsWithoutMe,
    isCallActive,
    isPostProcessing,
    isConference,
  } = useCTI();

  const [currentPanel, setCurrentPanel] = useState<"conference" | "transfer">(
    "conference",
  );

  return (
    <Stack sx={{ height: "100%" }} spacing={1}>
      <Stack spacing={0.85}>
        <AudioControls />
        <AgentLayout />
        <Stack spacing={0.75}>
          <InteractionAction />

          {isCallActive ? (
            <Stack direction="row" spacing={0.75} sx={{ "& > *": { flex: 1 } }}>
              {isConference ? (
                <HoldResumeConference />
              ) : (
                <HoldResumeCall party={participantsWithoutMe[0]} />
              )}
              <CallActionIcon
                disabled={
                  workitemState?.workitemStateID === "Transfer" ||
                  workitemState?.workitemStateID === "Conference"
                }
                label="Перевод звонка"
                icon={<PhoneForwarded />}
                active={currentPanel === "transfer"}
                onClick={() => setCurrentPanel("transfer")}
              />
              <CallActionIcon
                label="Конференция"
                icon={<AddCall />}
                active={currentPanel === "conference"}
                onClick={() => setCurrentPanel("conference")}
              />
            </Stack>
          ) : null}

          {isPostProcessing && <PostProcessing key={isPostProcessing} />}
        </Stack>
        {isCallActive && (
          <>
            {currentPanel === "transfer" && <TransferPanel />}
            {currentPanel === "conference" && <ConferencePanel />}
          </>
        )}
      </Stack>

      <Stack
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          "& > *:first-child": { minWidth: 0 },
        }}
      >
        <CTITabsPanel />
      </Stack>

      <IncomingCallDialog />
    </Stack>
  );
};
