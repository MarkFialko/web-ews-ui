import { Stack, Typography } from "@mui/material";
import { CopyIconButton } from "./CopyIconButton";

export type CopyRowProps = {
  value: string;
  onCopy: () => void;
  prefixIcon?: React.ReactNode;
};

export function CopyRow({ value, onCopy, prefixIcon }: CopyRowProps) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{ minWidth: 0 }}
    >
      {prefixIcon}
      <Typography
        variant="body2"
        sx={{ minWidth: 0, overflowWrap: "anywhere" }}
      >
        {value}
      </Typography>
      <CopyIconButton onClick={onCopy} />
    </Stack>
  );
}
