import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import { BackspaceOutlined, RotateLeft } from "@mui/icons-material";
import { StartCall } from "../../cti-actions";
import { useCTI } from "@modules/cti/model";

interface Props {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onRedial: () => void;
  onCall: () => void;
  disabled: boolean;
  value: string;
}

export const DialpadPanel = (props: Props) => {
  const { isPostProcessing, isCalActive } = useCTI();
  const { onDigit, onBackspace, onRedial, disabled, value } = props;

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  return (
    <Box sx={{ p: 0.75 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0.45,
        }}
      >
        {keys.map((key) => (
          <Button
            key={key}
            variant="outlined"
            disabled={disabled}
            onClick={() => {
              if (!disabled) onDigit(key);
            }}
            sx={{ minHeight: 30 }}
          >
            {key}
          </Button>
        ))}
      </Box>
      <Stack direction="row" spacing={0.75} sx={{ mt: 0.75 }}>
        <Tooltip title="Стереть последнюю цифру">
          <IconButton
            disabled={disabled}
            onClick={() => {
              if (!disabled) onBackspace();
            }}
            sx={{ width: 40, height: 40, border: 1, borderColor: "divider" }}
          >
            <BackspaceOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Повтор набора последнего номера">
          <IconButton
            disabled={disabled}
            onClick={() => {
              if (!disabled) onRedial();
            }}
            sx={{ width: 40, height: 40, border: 1, borderColor: "divider" }}
          >
            <RotateLeft fontSize="small" />
          </IconButton>
        </Tooltip>
        <StartCall
          disabled={
            value.trim().length === 0 || isCalActive || isPostProcessing
          }
          phoneNumber={value}
        />
      </Stack>
    </Box>
  );
};
