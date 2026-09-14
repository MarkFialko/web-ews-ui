import { Paper, Stack } from "@mui/material";
import {
  PhoneNumberSelect,
  type PhoneNumberSelectProps,
} from "./PhoneNumberSelect";
import type { ReactNode } from "react";

interface Props extends PhoneNumberSelectProps {
  actionIcon: ReactNode;
  extraActions?: ReactNode;
}

export const ParticipantLine = (props: Props) => {
  const { actionIcon, extraActions, ...phoneProps } = props;
  return (
    <Paper variant="outlined" sx={{ p: 0.75, borderRadius: 2 }}>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <PhoneNumberSelect {...phoneProps} />
          {actionIcon}
        </Stack>

        <Stack direction="row" spacing={0.75} alignSelf="flex-end" pt={1}>
        {extraActions}
        </Stack>
      </Stack>
    </Paper>
  );
};
