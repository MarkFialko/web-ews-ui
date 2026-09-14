import { OutboundInteractionOptions } from "@sber-scpl/core/jssdk";

import { alpha, IconButton, Tooltip } from "@mui/material";
import { PhoneInTalkOutlined } from "@mui/icons-material";

import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";
import { useAgentAction } from "@modules/cti/model/useAgentAction";

interface Props {
  disabled: boolean;
  phoneNumber: string;
}

export const StartCall = (props: Props) => {
  const { phoneNumber, disabled } = props;

  const log = useWorklogLogger();

  const { execute, isLoading } = useAgentAction(
    "agent",
    (agent) =>
      agent.createOutInteraction({
        destination: phoneNumber,
        outboundTo: OutboundInteractionOptions.DESTINATION_NUMBER,
        channel: "call",
      }),
    "Не удалось совершить вызов",
    WORKLOG_ACTIONS.CTI_CALL_START,
  );

  const isDisabled = disabled || isLoading;

  const handleStartCall = () => {
    execute();
  };

  return (
    <Tooltip title="Позвонить">
      <span>
        <IconButton
          color="success"
          disabled={isDisabled}
          onClick={handleStartCall}
          sx={(theme) => ({
            width: 40,
            height: 40,
            border: 1,
            borderColor: "divider",
            bgcolor: isDisabled
              ? "background.paper"
              : alpha(theme.palette.success.main, 0.25),
          })}
        >
          <PhoneInTalkOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
};
