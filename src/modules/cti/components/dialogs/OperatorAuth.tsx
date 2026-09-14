import { type DialogProps, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { useTelephonyService } from "@modules/cti/model";
import { ConnectionNumberDialog } from "./ConnectionNumberDialog";
import { NumberIsBusyDialog } from "./NumberIsBusyDialog";
import { WrongNumberDialog } from "./WrongNumberDialog";

enum ConnectionDialogsEnum {
  CONNECTION = "CONNECTION",
  WRONG_NUMBER = "WRONG_NUMBER",
  NUMBER_IS_BUSY = "NUMBER_IS_BUSY",
}

export interface FormValues {
  phone: string;
}

enum AssignPhoneDescriptionsEnum {
  ALREADY_ASSIGNED = "phone number is already assigned",
  NUMBER_IS_BUSY = "phone number is already assigned to another agent",
}

const useConnectionDialogs = () => {
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(true);
  const [isWrongDialogOpen, setIsWrongDialogOpen] = useState(false);
  const [isBusyDialogOpen, setIsBusyDialogOpen] = useState(false);

  const handleClose = (dialog: ConnectionDialogsEnum) => {
    switch (dialog) {
      case ConnectionDialogsEnum.CONNECTION:
        setIsConnectionDialogOpen(false);
        break;
      case ConnectionDialogsEnum.WRONG_NUMBER:
        setIsWrongDialogOpen(false);
        break;
      case ConnectionDialogsEnum.NUMBER_IS_BUSY:
        setIsBusyDialogOpen(false);
        break;
    }
  };

  const handleOpen = (dialog: ConnectionDialogsEnum) => {
    switch (dialog) {
      case ConnectionDialogsEnum.CONNECTION:
        setIsConnectionDialogOpen(true);
        break;
      case ConnectionDialogsEnum.WRONG_NUMBER:
        setIsWrongDialogOpen(true);
        break;
      case ConnectionDialogsEnum.NUMBER_IS_BUSY:
        setIsBusyDialogOpen(true);
        break;
    }
  };

  const handleBackToConnection = () => {
    handleClose(ConnectionDialogsEnum.WRONG_NUMBER);
    handleClose(ConnectionDialogsEnum.NUMBER_IS_BUSY);

    handleOpen(ConnectionDialogsEnum.CONNECTION);
  };

  return {
    isConnectionDialogOpen,
    isWrongDialogOpen,
    isBusyDialogOpen,
    handleOpen,
    handleClose,
    handleBackToConnection,
  };
};

interface Props extends Pick<DialogProps, "open" | "onClose"> {
  onConnect: () => void;
}

export const OperatorAuth = (props: Props) => {
  const {
    isConnectionDialogOpen,
    isWrongDialogOpen,
    isBusyDialogOpen,
    handleBackToConnection,
    handleOpen,
    handleClose,
  } = useConnectionDialogs();

  const service = useTelephonyService();

  const [phoneToAssign, setPhoneToAssign] = useState("");

  useEffect(() => {
    props.open && handleOpen(ConnectionDialogsEnum.CONNECTION);
  }, [props.open]);

  const handleCloseConnectionDialog = () => {
    props.onClose && props.onClose({}, "backdropClick");
    handleClose(ConnectionDialogsEnum.CONNECTION);
  };

  const handleCloseNumberIsBusyDialog = () => {
    props.onClose && props.onClose({}, "backdropClick");
    handleClose(ConnectionDialogsEnum.NUMBER_IS_BUSY);
  };

  const methods = useForm<FormValues>({
    mode: "all",
    defaultValues: { phone: "" },
  });

  const handleIncorrectAssign = () => {
    handleClose(ConnectionDialogsEnum.CONNECTION);

    handleOpen(ConnectionDialogsEnum.WRONG_NUMBER);
  };

  const handleNumberIsBusyAssign = () => {
    handleClose(ConnectionDialogsEnum.CONNECTION);

    handleOpen(ConnectionDialogsEnum.NUMBER_IS_BUSY);
  };

  const handleConnect = async (phone: string, isForceAssign = false) => {
    setPhoneToAssign(phone);

    const agent = service.getAgent();
    if (!agent) return;
    const assignResult = await agent.assignPhoneNumber(phone, isForceAssign);

    if (
      assignResult?.resultDesc
        ?.toLowerCase()
        .includes(AssignPhoneDescriptionsEnum.NUMBER_IS_BUSY)
    ) {
      handleNumberIsBusyAssign();
      return;
    }

    if (
      assignResult?.ok ||
      assignResult?.resultDesc
        ?.toLowerCase()
        .includes(AssignPhoneDescriptionsEnum.ALREADY_ASSIGNED)
    ) {
      handleCloseConnectionDialog();
      handleCloseNumberIsBusyDialog();
      props.onConnect();
      return;
    }

    handleIncorrectAssign();
  };

  return (
    <Stack direction="row">
      <FormProvider {...methods}>
        <ConnectionNumberDialog
          open={isConnectionDialogOpen && props.open}
          onClose={handleCloseConnectionDialog}
          onConnect={handleConnect}
        />
      </FormProvider>
      <WrongNumberDialog
        open={isWrongDialogOpen}
        onApply={handleBackToConnection}
      />
      <NumberIsBusyDialog
        open={isBusyDialogOpen}
        onCancel={handleBackToConnection}
        phone={phoneToAssign}
        onConnect={handleConnect}
      />
    </Stack>
  );
};
