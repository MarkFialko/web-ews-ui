import { Stack, Typography } from "@mui/material";

export type EmptyRowProps = {
  prefixIcon?: React.ReactNode;
};

export function EmptyRow({ prefixIcon }: EmptyRowProps) {
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
        {"—"}
      </Typography>
    </Stack>
  );
}
