import { Paper, Typography, Box } from "@mui/material";
import { CopyButton, SectionHeader } from "@shared/ui";

interface Props {
  title: string;
  solution: string | null;
}

export const SolutionBlock = (props: Props) => {
  const { title, solution } = props;

  if (!solution) return null;

  return (
    <Paper variant="outlined" sx={{ userSelect: "text" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          pt: 1.5,
        }}
      >
        <SectionHeader sx={{ mt: 0, mb: 0 }}>{title}</SectionHeader>
        <CopyButton value={solution ?? ""} message="Решение скопировано" />
      </Box>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
        >
          {solution}
        </Typography>
      </Box>
    </Paper>
  );
};
