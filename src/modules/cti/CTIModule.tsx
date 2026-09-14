import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";

import { CTIBlock } from "./components/CTIBlock";
import { RequestContext } from "./components/RequestContext/RequestContext";
import { CTI_SX } from "./CTIModule.sx";

export const CTIModule = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={CTI_SX.CONTAINER}>
        <Box sx={CTI_SX.GRID}>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            sx={{ height: "100%", overflow: "hidden" }}
          >
            <Box sx={{ flex: 1, minWidth: 300, overflow: "hidden" }}>
              <CTIBlock />
            </Box>
            <Box
              sx={{
                flex: 1,
                minWidth: 300,
                display: isMobile ? "none" : "block",
              }}
            >
              <RequestContext activeCallUuid={null} />
            </Box>
          </Stack>
        </Box>
    </Box>
  );
};
