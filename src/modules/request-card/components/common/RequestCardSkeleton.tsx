import { Box, Paper, Skeleton, Stack, Tab, Tabs } from "@mui/material";

export function RequestCardSkeleton() {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: { lg: "calc(100vh - 32px)" },
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          flexShrink: 0,
          borderBottom: 1,
          borderColor: "divider",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.25,
            py: 0.9,
            whiteSpace: "nowrap",
          }}
        >
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.875rem", width: 170, flexShrink: 0 }}
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.875rem", width: 150, flexShrink: 0 }}
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.875rem", width: 176, flexShrink: 0 }}
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.875rem", width: 132, flexShrink: 0 }}
          />
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
        <Stack spacing={1.75}>
          <Skeleton
            variant="outlined"
            sx={{
              borderRadius: 2,
              width: "100%",
              minHeight: 80,
            }}
          />

          <Skeleton
            variant="rectangular"
            sx={{
              height: 48,
              borderRadius: 0,
              borderBottom: "none",
            }}
          />

          <Stack spacing={1.75}>
            <Stack spacing={1}>
              <Skeleton variant="text" sx={{ fontSize: "1rem", width: "90%" }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", width: "95%" }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", width: "80%" }} />
            </Stack>

            <Stack direction="row" spacing={0.75} flexWrap="wrap">
              <Skeleton
                variant="rounded"
                sx={{ borderRadius: "16px", width: 72, height: 26 }}
              />
              <Skeleton
                variant="rounded"
                sx={{ borderRadius: "16px", width: 56, height: 26 }}
              />
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <Skeleton
                variant="outlined"
                sx={{ borderRadius: 2, minHeight: 44 }}
              />
              <Skeleton
                variant="outlined"
                sx={{ borderRadius: 2, minHeight: 44 }}
              />
              <Skeleton
                variant="outlined"
                sx={{ borderRadius: 2, minHeight: 44 }}
              />
              <Skeleton
                variant="outlined"
                sx={{ borderRadius: 2, minHeight: 44 }}
              />
              <Skeleton
                variant="outlined"
                sx={{ borderRadius: 2, minHeight: 44 }}
              />
              <Skeleton
                variant="outlined"
                sx={{ borderRadius: 2, minHeight: 44 }}
              />
            </Box>

            <Skeleton
              variant="outlined"
              sx={{ borderRadius: 2, minHeight: 72 }}
            />
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
