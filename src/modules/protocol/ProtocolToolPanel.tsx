import { Box, Button, Divider, Stack } from "@mui/material";

import { FormInputText, FormTabs } from "@shared/ui";
import { STORE_NAMES } from "@shared/cache";

import { ProtocolList } from "./components";
import { useProtocolPanel } from "./useProtocolPanel";
import { TABS } from "./constants";

export type ProtocolToolPanelProps = {
  ticketId: string;
};

function ProtocolToolPanel(props: ProtocolToolPanelProps) {
  const { ticketId } = props;

  const { control, onSubmit, isSubmitting } = useProtocolPanel(ticketId);

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Stack spacing={1.25} sx={{ flex: 1, minHeight: 0 }}>
        <ProtocolList />

        <Divider />

        <Stack spacing={2} component="form" noValidate onSubmit={onSubmit}>
          <FormTabs
            name="typeCode"
            control={control}
            persistScope={ticketId}
            draftStoreName={STORE_NAMES.PROTOCOL_DRAFTS}
            saveOnInput
            tabs={TABS}
            sx={{
              minHeight: 40,
              borderBottom: 1,
              borderColor: "divider",
              alignSelf: "flex-start",
            }}
          />

          <FormInputText
            name="message"
            control={control}
            label="Текст записи"
            persistScope={ticketId}
            draftStoreName={STORE_NAMES.PROTOCOL_DRAFTS}
            saveOnInput
            disabled={isSubmitting}
            rules={{
              required: "Обязательное поле",
              maxLength: { value: 4000, message: "Не более 4000 символов" },
            }}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                multiline: true,
                minRows: 3,
              },
            }}
          />

          <Button variant="contained" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Отправить запись"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ProtocolToolPanel;
