import { Stack, Typography, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

export type DataFieldProps = {
  label: ReactNode;
  value?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  accent?: boolean;
  emptyValue?: ReactNode;
  stackSx?: SxProps<Theme>;
  valueSx?: SxProps<Theme>;
};

function DataField({
  label,
  value,
  children,
  action,
  accent = false,
  emptyValue = "—",
  stackSx,
  valueSx,
}: DataFieldProps) {
  const resolvedValue = value ?? emptyValue;

  return (
    <Stack spacing={0.25} sx={{ minWidth: 0, ...stackSx }}>
      <Typography variant="fieldLabel">{label}</Typography>
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ minWidth: 0 }}
      >
        {children ?? (
          <Typography
            variant={accent ? "bodyAccent" : "body2"}
            sx={{
              minWidth: 0,
              overflowWrap: "anywhere",
              ...valueSx,
            }}
          >
            {resolvedValue}
          </Typography>
        )}
        {action}
      </Stack>
    </Stack>
  );
}

export default DataField;
