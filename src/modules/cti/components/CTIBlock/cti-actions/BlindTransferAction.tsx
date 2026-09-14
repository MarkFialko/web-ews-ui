import { useAgentAction, useCallHistory } from "@modules/cti/model";
import { PhoneForwarded } from "@mui/icons-material";
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
  value: string;
}

export const BlindTransferAction = (props: Props) => {
  const { value, disabled } = props;

  const { notifySuccess } = useAppNotifications();

  const [, addCall] = useCallHistory();

  const blindTransferAction = useAgentAction(
    "interaction",
    (interaction) => {
      return interaction.transfer({
        destination: value,
        transferTo: "destinationNumber",
        transferType: "blind",
      });
    },
    "Не удалось выполнить перевод",
    WORKLOG_ACTIONS.CTI_TRANSFER_BLIND,
    {
      onSuccess: () => {
        notifySuccess("Перевод звонка успешно выполнен");
        addCall("outbound", value);
      },
    },
  );

  const isDisabled = disabled || value.trim().length === 0;

  return (
    <Tooltip title="Перевод звонка">
      <span>
        <IconButton
          color="primary"
          disabled={isDisabled}
          onClick={blindTransferAction.execute}
          sx={SX}
        >
          <PhoneForwarded />
        </IconButton>
      </span>
    </Tooltip>
  );
};
