import { Box, Skeleton, Stack } from "@mui/material";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";

const PAPER_SX: SxProps<Theme> = (theme) => ({
  position: "relative",
  overflow: "hidden",
  p: 1,
  pl: "12px",
  boxSizing: "border-box",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    borderRadius: "2px 0 0 2px",
    backgroundColor: theme.palette.primary.main,
    opacity: 0.24,
  },
});

const TITLE_SKELETON_SX = { width: "65%" };
const META_SKELETON_SX = { width: "80%" };
const LABELS_SKELETON_SX = { width: "50%", height: 20 };

export function CompactTriageRowSkeleton() {
  return (
    <Box
      sx={{
        height: 82,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Box sx={PAPER_SX}>
        <Stack spacing={0.5}>
          <Skeleton
            variant="rounded"
            height={14}
            sx={TITLE_SKELETON_SX}
            animation="wave"
          />
          <Skeleton
            variant="rounded"
            height={14}
            sx={META_SKELETON_SX}
            animation="wave"
          />
          <Skeleton
            variant="rounded"
            height={20}
            sx={LABELS_SKELETON_SX}
            animation="wave"
          />
        </Stack>
      </Box>
    </Box>
  );
}
