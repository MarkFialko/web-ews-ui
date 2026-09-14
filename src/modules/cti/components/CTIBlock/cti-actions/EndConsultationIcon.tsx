import { useAgentAction } from "@modules/cti/model";
import { CallEndOutlined } from "@mui/icons-material";
import { IconButton, Tooltip, type Theme } from "@mui/material";
import { useAppNotifications } from "@shared/notifications";
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

export const EndConsultationIcon = (props: Props) => {
  const { disabled } = props;

  const endConsultation = useAgentAction(
    "interaction",
    (interaction) => {
      return interaction.cancelTransfer();
    },
    "Не удалось завершить консультацию",
    WORKLOG_ACTIONS.CTI_TRANSFER_CANCEL,
    {
      onSuccess: () => {
        notifySuccess("Консультация завершена");
      },
    },
  );

  const { notifySuccess } = useAppNotifications();

  const isDisabled = disabled;

  return (
    <Tooltip title="Завершить консультацию">
      <span>
        <IconButton
          color="primary"
          disabled={isDisabled}
          onClick={endConsultation.execute}
          sx={SX}
        >
          <CallEndOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
};
