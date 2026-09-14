import { useAgentAction } from "@modules/cti/model";
import { CallEndOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { WORKLOG_ACTIONS } from "@shared/worklog-logger";

export const EndConference = () => {
  const endConference = useAgentAction(
    "interaction",
    (interaction) => {
      return interaction.closeConference();
    },
    "Не удалось завершить конференцию",
    WORKLOG_ACTIONS.CTI_CALL_END,
  );

  return (
    <Tooltip title="Завершить конференцию">
      <span>
        <IconButton
          color="error"
          onClick={endConference.execute}
          sx={{
            width: 40,
            height: 40,
            border: 1,
            borderColor: "divider",
          }}
        >
          <CallEndOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
};
