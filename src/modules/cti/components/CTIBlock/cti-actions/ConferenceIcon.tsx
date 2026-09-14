import { useAgentAction } from "@modules/cti/model";
import { AddCall } from "@mui/icons-material";
import { IconButton, Tooltip, type Theme } from "@mui/material";
import { WORKLOG_ACTIONS } from "@shared/worklog-logger";

const SX = (theme: Theme) => ({
  width: 40,
  height: 40,
  border: 1,
  borderColor: "divider",
  "&.Mui-disabled": {
    bgcolor: theme.palette.action.disabledBackground,
    borderColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
});

interface Props {
  disabled: boolean;
}

export const ConferenceIcon = (props: Props) => {
  const { disabled } = props;

  const isDisabled = disabled;

  const joinAction = useAgentAction(
    "interaction",
    (interaction) => {
      const partyList = interaction.getWorkitemPartyList() ?? [];
      return interaction.joinToConference(partyList.map((p) => p.callID));
    },
    "Не удалось создать конференцию",
    WORKLOG_ACTIONS.CTI_CONFERENCE_JOIN,
  );

  return (
    <Tooltip title="Объединить в конференцию">
      <span>
        <IconButton
          color="primary"
          disabled={isDisabled}
          onClick={joinAction.execute}
          sx={SX}
        >
          <AddCall />
        </IconButton>
      </span>
    </Tooltip>
  );
};
