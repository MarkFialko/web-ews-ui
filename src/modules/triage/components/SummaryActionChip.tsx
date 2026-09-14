import { Button } from "@mui/material";

type SummaryActionChipProps = {
  label: string;
  value: number;
  tone: "default" | "error" | "warning" | "info";
  active: boolean;
  onClick: () => void;
};

export function SummaryActionChip({
  label,
  value,
  tone,
  active,
  onClick,
}: SummaryActionChipProps) {
  return (
    <Button
      variant={active ? "contained" : "outlined"}
      color={tone === "default" ? "inherit" : tone}
      size="small"
      onClick={onClick}
      sx={{ minWidth: "auto" }}
    >
      {label}: {value}
    </Button>
  );
}
