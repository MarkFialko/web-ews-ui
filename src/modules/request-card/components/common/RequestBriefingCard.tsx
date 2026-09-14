import { Box, Chip, Stack, Typography, Paper } from "@mui/material";
import { useVipVerifyQuery } from "../../api";

import type { RequestDTO } from "@shared/request";
import { getTerrbankFullName } from "@shared/utils";
import { CopyButton, OpenInEsmButton } from "@shared/ui";

export type RequestBriefingCardProps = {
  incident: RequestDTO;
};

export function RequestBriefingCard({ incident }: RequestBriefingCardProps) {
  const {
    personalNumber,
    firstName,
    lastName,
    middleName,
    position,
    subdivision,
  } = incident.initiator ?? {};
  const { terbank, subbranch } = subdivision ?? {};
  const { title } = incident;

  const { data: vipInfo, isSuccess: isVipSuccess } = useVipVerifyQuery(
    personalNumber ?? "",
    { skip: !personalNumber },
  );

  const fullName =
    lastName +
    (firstName == null ? "" : " " + firstName) +
    (middleName == null ? "" : " " + middleName);

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "50% 50%" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Stack spacing={0.35} sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ overflowWrap: "anywhere" }}>
            {title}
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            <OpenInEsmButton businessId={incident.businessId} />
          </Box>
          <Typography variant="metaTiny">{incident.itService.label}</Typography>
        </Stack>

        {personalNumber ? (
          <Stack spacing={0.6} sx={{ minWidth: 0, alignItems: "flex-start" }}>
            <Typography variant="bodyAccent" sx={{ overflowWrap: "anywhere" }}>
              {fullName}
              <CopyButton value={fullName} message="ФИО скопировано" />
            </Typography>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Typography variant="metaTiny">{position?.name}</Typography>
              {isVipSuccess && vipInfo?.isVip ? (
                <Chip
                  label="VIP"
                  color="vip"
                  sx={{
                    height: 18,
                    "& .MuiChip-label": {
                      px: 0.75,
                      fontSize: 11,
                      lineHeight: "18px",
                    },
                  }}
                />
              ) : null}
            </Stack>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <Typography variant="metaTiny">{personalNumber}</Typography>
              <CopyButton
                value={personalNumber}
                message="Табельный номер скопирован"
              />
            </Stack>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip label={getTerrbankFullName(terbank)} variant="outlined" />
              {subbranch ? (
                <Chip label={`ВСП ${subbranch}`} variant="outlined" />
              ) : null}
            </Stack>
          </Stack>
        ) : null}
      </Box>
    </Paper>
  );
}
