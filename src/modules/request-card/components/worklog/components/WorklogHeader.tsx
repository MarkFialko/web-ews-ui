import { Stack } from "@mui/material";

import { OpenInEsmButton, SectionHeader } from "@shared/ui";
import { WORKLOG_HEADER_TEXTS } from "../constants";

interface Props {
  businessId: string;
}

export const WorklogHeader = (props: Props) => {
  const { businessId } = props;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <SectionHeader sx={{ mb: 0 }}>
          {WORKLOG_HEADER_TEXTS.sectionTitle}
        </SectionHeader>
      </Stack>
      <OpenInEsmButton
        businessId={businessId}
        title={WORKLOG_HEADER_TEXTS.viewInEsm}
      />
    </Stack>
  );
};
