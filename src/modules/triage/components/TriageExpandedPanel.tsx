import { Box, Chip, Stack, Typography } from "@mui/material";
import { formatDateTime } from "@shared/utils";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";
import type { RequestDTO } from "@shared/request";

import { getEngeneerName } from "../utils";
import { getRusPriorityCode } from "@shared/request";
import { getTerrbankFullName } from "@shared/utils";

const PANEL_SX: SxProps<Theme> = (theme) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderRadius: "0 0 20px 20px",
  px: 1,
  py: 1.25,
  backgroundColor: theme.palette.background.paper,
});

const GRID_SX: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, minmax(0, 1fr))",
    xl: "repeat(4, minmax(0, 1fr))",
  },
  gap: 1.25,
  alignItems: "start",
};

const TAGS_STACK_SX = {
  flexDirection: "row" as const,
  gap: 0.5,
  flexWrap: "wrap",
  useFlexGap: true,
  minWidth: 0,
};

interface Props {
  request: RequestDTO;
  isDraft: boolean;
  hasKnowledgeBase: boolean;
  workDurationText?: string;
}

export const TriageExpandedPanel = (props: Props) => {
  const { request, isDraft, hasKnowledgeBase, workDurationText } = props;

  const metadataTags = request.tags
    ? request.tags.split(", ")
    : ([] as string[]);

  return (
    <Box sx={PANEL_SX}>
      <Stack spacing={1.25}>
        <Stack spacing={0.35}>
          <Typography variant="caption" color="text.secondary">
            Описание
          </Typography>
          <Typography variant="body2" whiteSpace="pre-wrap">
            {request.description}
          </Typography>
        </Stack>

        <Box sx={GRID_SX}>
          <DetailBlock
            label="Инициатор"
            value={`${getEngeneerName(request.initiator)} (${request?.initiator?.personalNumber ?? ""})`}
          />
          <DetailBlock
            label="ТБ"
            value={getTerrbankFullName(
              request?.initiator?.subdivision?.terbank,
            )}
          />
          <DetailBlock
            label="Приоритет"
            value={getRusPriorityCode(request.priorityCode)}
          />
          <DetailBlock label="В работе" value={workDurationText ?? "—"} />
          <DetailBlock
            label="Дата создания"
            value={formatDateTime(request.createdAt)}
          />
          <DetailBlock
            label="Контрольный срок"
            value={formatDateTime(request.targetDate)}
          />
          <DetailBlock label="КЭ" value={request?.configurationElement ?? ""} />
          <Stack spacing={0.35}>
            <Typography variant="caption" color="text.secondary">
              Теги
            </Typography>
            {metadataTags.length > 0 ? (
              <Stack sx={TAGS_STACK_SX}>
                {metadataTags.map((tag) => (
                  <Chip
                    key={`${request.businessId}-${tag}`}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ flexShrink: 0 }}
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                —
              </Typography>
            )}
            {isDraft ? (
              <Typography variant="caption" color="text.secondary">
                Черновик не сохранен
              </Typography>
            ) : hasKnowledgeBase ? (
              <Typography variant="caption" color="text.secondary">
                Заполнен SH-ID
              </Typography>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

function DetailBlock({
  label,
  value,
  secondaryValue,
  align = "left",
}: {
  label: string;
  value: string;
  secondaryValue?: string;
  align?: "left" | "right";
}) {
  return (
    <Stack spacing={0.15} sx={{ textAlign: align }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      {secondaryValue ? (
        <Typography variant="caption" color="text.secondary">
          {secondaryValue}
        </Typography>
      ) : null}
    </Stack>
  );
}
