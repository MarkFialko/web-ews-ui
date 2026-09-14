import { useAgentAction } from "@modules/cti/model";
import { CallEndOutlined } from "@mui/icons-material";
import { alpha, IconButton, Tooltip } from "@mui/material";
import { WORKLOG_ACTIONS } from "@shared/worklog-logger";

export const EndCall = () => {
  const hangupAction = useAgentAction(
    "interaction",
    (interaction) => interaction.hangup(),
    "Не удалось завершить звонок",
    WORKLOG_ACTIONS.CTI_CALL_END,
  );

  const handleEndCall = () => {
    hangupAction.execute();
  };

  return (
    <Tooltip title="Завершить звонок">
      <span>
        <IconButton
          color="error"
          onClick={handleEndCall}
          sx={(theme) => ({
            width: 40,
            height: 40,
            border: 1,
            borderColor: "divider",
            bgcolor: alpha(theme.palette.error.main, 0.25),
          })}
        >
          <CallEndOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
};
