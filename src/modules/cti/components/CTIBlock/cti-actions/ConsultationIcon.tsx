import { useAgentAction, useCallHistory } from "@modules/cti/model";
import { AddCall } from "@mui/icons-material";
import { IconButton, Tooltip, type Theme } from "@mui/material";
import { useAppNotifications } from "@shared/notifications";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

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
  value: string;
}

export const ConsultationIcon = (props: Props) => {
  const { value, disabled } = props;

  const { notifySuccess } = useAppNotifications();
  const log = useWorklogLogger();
  const [, addCall] = useCallHistory();

  const transfer = useAgentAction(
    "interaction",
    (interaction) => {
      return interaction.transfer({
        destination: value,
        transferTo: "destinationNumber",
        transferType: "consultation",
      });
    },
    "Не удалось выполнить запрос на консультацию",
    WORKLOG_ACTIONS.CTI_TRANSFER_CONSULTATION,
    {
      onSuccess: () => {
        notifySuccess("Запрос на консультацию успешно выполнен");
        addCall("outbound", value);
      },
    },
  );

  const isDisabled = disabled || value.trim().length === 0;

  return (
    <Tooltip title="Консультация">
      <span>
        <IconButton
          color="primary"
          disabled={isDisabled}
          onClick={transfer.execute}
          sx={SX}
        >
          <AddCall />
        </IconButton>
      </span>
    </Tooltip>
  );
};
