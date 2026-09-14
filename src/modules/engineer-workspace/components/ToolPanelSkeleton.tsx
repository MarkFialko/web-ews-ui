import { Skeleton, Stack } from "@mui/material";

export function ToolPanelSkeleton() {
  return (
    <Stack spacing={2} sx={{ p: 2, height: "100%" }}>
      <Skeleton variant="text" animation="wave" />

      <Stack spacing={1.5}>
        <Skeleton variant="rounded" height={48} animation="wave" />
        <Skeleton variant="rounded" height={80} animation="wave" />
        <Skeleton variant="rounded" height={48} animation="wave" />
        <Skeleton variant="rounded" height={120} animation="wave" />
        <Skeleton variant="rounded" height={48} animation="wave" />
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Skeleton variant="rounded" width={80} height={32} animation="wave" />
        <Skeleton variant="rounded" width={80} height={32} animation="wave" />
        <Skeleton variant="rounded" width={80} height={32} animation="wave" />
      </Stack>
    </Stack>
  );
}
