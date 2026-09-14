import { Stack, Typography, type StackProps } from "@mui/material";

export type ToolPanelHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  stackProps?: StackProps;
};

function ToolPanelHeader({
  eyebrow,
  title,
  description,
  stackProps,
}: ToolPanelHeaderProps) {
  return (
    <Stack spacing={0.5} {...stackProps}>
      <Typography variant="panelEyebrow">{eyebrow}</Typography>
      <Typography variant="bodyAccent">{title}</Typography>
      <Typography variant="fieldLabel">{description}</Typography>
    </Stack>
  );
}

export default ToolPanelHeader;
