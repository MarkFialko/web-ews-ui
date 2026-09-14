import { Box, Skeleton, Stack, Typography } from "@mui/material";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";

const SLA_STRIP_SX: SxProps<Theme> = (theme) => ({
  position: "absolute" as const,
  left: 10,
  top: 10,
  bottom: 10,
  width: 4,
  borderRadius: 999,
  backgroundColor: theme.palette.primary.main,
  opacity: 0.24,
});

const TITLE_SKELETON_SX = { width: "60%" };

export function TriageRowSkeleton() {
  return (
    <Box
      sx={{
        height: 96,
        display: "flex",
        flexDirection: "column",
        gap: 0.8,
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          p: 1.2,
          pl: 3,
          pr: 1.25,
          boxSizing: "border-box",
        }}
      >
        <Box sx={SLA_STRIP_SX} />
        <Stack spacing={0.6}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="body1"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: "inherit",
                lineHeight: 1.35,
                color: "inherit",
              }}
            >
              <Skeleton
                variant="text"
                width={140}
                height={20}
                animation="wave"
              />
            </Typography>
            <Skeleton variant="text" width={70} height={18} animation="wave" />
          </Stack>
          <Skeleton
            variant="text"
            sx={TITLE_SKELETON_SX}
            height={20}
            animation="wave"
          />
          <Skeleton variant="rounded" height={20} animation="wave" />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Skeleton variant="text" width={40} height={14} animation="wave" />
            <Skeleton variant="text" width={50} height={14} animation="wave" />
            <Skeleton variant="text" width={40} height={14} animation="wave" />
            <Skeleton variant="text" width={60} height={14} animation="wave" />
            <Skeleton variant="text" width={50} height={14} animation="wave" />
            <Skeleton variant="text" width={50} height={14} animation="wave" />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
