import { useEffect } from "react";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  alpha,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";

import { InfoLine } from "../common";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";
import {
  useActiveVoiceInteraction,
  useCTI,
  useAgentAction,
  getContext,
} from "@modules/cti/model";
import { getIsEWSBrowser } from "@shared/utils";

export const IncomingCallDialog = () => {
  const interaction = useActiveVoiceInteraction();
  const { interactionData, workitemState, firstLine } = useCTI();
  const log = useWorklogLogger();

  useEffect(() => {
    if (interactionData?.direction === "inbound") {
      if (getIsEWSBrowser()) {
        getContext(interaction).then((context) => {
          alert(
            JSON.stringify({
              employeeNumber: Number(context.employeeNumber ?? ""),
              interactionId: context.classinf2 ?? interaction?.id ?? "",
            }),
          );
        });
      }

      log({
        action: WORKLOG_ACTIONS.CTI_CALL_START,
        task: "Information",
        commentParams: { phone: firstLine },
      });
    }
  }, [interactionData?.direction, firstLine, log]);

  const acceptAction = useAgentAction(
    "interaction",
    (interaction) => interaction.accept(),
    "Не удалось принять вызов",
    WORKLOG_ACTIONS.CTI_CALL_ACCEPT,
  );

  const handleAccept = () => {
    acceptAction.execute();
  };

  return (
    <Dialog
      open={
        interactionData?.direction === "inbound" &&
        workitemState?.workitemStateID === "Ringing"
      }
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Входящий вызов</DialogTitle>
      <DialogContent>
        <Stack spacing={1.25} sx={{ pt: 0.5 }}>
          <Box
            sx={(theme) => ({
              borderRadius: 1.5,
              px: 1.25,
              py: 1,
              bgcolor: alpha(theme.palette.success.main, 0.14),
              border: 1,
              borderColor: alpha(theme.palette.success.main, 0.35),
            })}
          >
            <Typography variant="caption" color="text.secondary">
              Номер телефона
            </Typography>
            <Typography
              variant="h6"
              color="success.main"
              sx={{ fontWeight: 800 }}
            >
              {firstLine}
            </Typography>
          </Box>
          <InfoLine label="ФИО звонящего" value={""} />
          <InfoLine label="Сервис" value={interactionData?.service?.name} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleAccept}
          variant="contained"
          color="success"
          onClick={handleAccept}
        >
          Принять
        </Button>
      </DialogActions>
    </Dialog>
  );
};
