import { Typography, Box, Stack } from "@mui/material";

export type InfoPanelProps = {
  title: string;
  children: React.ReactNode;
};

export function InfoPanel({ title, children }: InfoPanelProps) {
  return (
    <Box
      sx={(theme) => ({
        p: 1.25,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      })}
    >
      <Stack spacing={0.55}>
        <Typography variant="fieldLabel">{title}</Typography>
        {children}
      </Stack>
    </Box>
  );
}
