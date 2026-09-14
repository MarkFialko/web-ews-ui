import { Stack, Typography } from "@mui/material";
import { SectionHeader } from "@shared/ui";

interface Props {
  title: string;
  value: string | null;
}

export const TextInfoBlock = (props: Props) => {
  const { title, value } = props;

  if (!value) return null;

  return (
    <Stack spacing={0.5}>
      <SectionHeader sx={{ mt: 0, mb: 0 }}>{title}</SectionHeader>
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
      >
        {value}
      </Typography>
    </Stack>
  );
};
