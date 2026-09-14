import { Typography, Box } from "@mui/material";

export type InfoRowProps = {
  label: string;
  value: string;
  action?: React.ReactNode;
  accent?: boolean;
};

export function InfoRow({ label, value, action }: InfoRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        minWidth: 0,
        flexWrap: "wrap",
      }}
    >
      <Typography variant="fieldLabel">{label}</Typography>
      <Typography variant="body2">{value}</Typography>
      {action}
    </Box>
  );
}
