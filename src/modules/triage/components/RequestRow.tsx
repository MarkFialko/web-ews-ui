import { memo, type MouseEvent } from "react";
import {
  alpha,
  Box,
  Button,
  Collapse,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import { getRusStateCode } from "@shared/request";
import type {
  LabelDto,
  RequestDTO,
  RequestInitiatorDTO,
  StateCode,
} from "@shared/request";
import type { SlaState } from "@shared/utils";
import type { TriageLaneKey } from "../model/triageSelectors";
import { LaneHeader } from "./LaneHeader";
import { LabelChip } from "./LabelChip";
import { MetaText } from "./MetaText";
import { SecondarySeparator } from "./SecondarySeparator";
import { TriageExpandedPanel } from "./TriageExpandedPanel";
import { TagsView } from "./TagsView";
import { OpenInEsmButton } from "@shared/ui";
import { serializeTags } from "@modules/request-card/utils";
import { getEngeneerName } from "../utils";
import { getTerrbankFullName, getTerrbankShortName } from "@shared/utils";
import { getStatusColor } from "./triageVisuals";
import { CHAT_TOOLTIP, chatIconSx, chatIconSvgSx } from "../constants";

type RequestRowProps = {
  businessId: string;
  title: string | null;
  stateCode: StateCode;
  slaState: SlaState;
  isHighlighted: boolean;
  compactSlaLabel: string;
  compactAgeValue: string;
  compactSlaColor: string;
  compactSlaFontWeight: number;
  itServiceName: string;
  configurationElement: string | null;
  initiator: RequestInitiatorDTO | null;
  labels: LabelDto[] | undefined;
  tags: string | null;
  active: boolean;
  isDraft: boolean;
  hasKnowledgeBase: boolean;
  expanded: boolean;
  onToggle: (businessId: string) => void;
  onOpenRequest?: (businessId: string) => void;
  isFirstInLane: boolean;
  lane: TriageLaneKey;
  laneCount: number;
  request: RequestDTO;
  workDurationText?: string;
  onChat?: (businessId: string) => void;
  activeChatIds?: ReadonlySet<string>;
  backlogLabel: { name: string; color: string; tooltip: string } | null;
};

const PAPER_BASE_SX = {
  position: "relative" as const,
  overflow: "hidden" as const,
  cursor: "pointer" as const,
  transition:
    "background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
};

const SLA_STRIP_SX = {
  position: "absolute" as const,
  left: 10,
  top: 10,
  bottom: 10,
  width: 4,
  borderRadius: 999,
};

const TITLE_BOX_SX = { minWidth: 0, flex: 1 };

const LABELS_STACK_SX = {
  flexShrink: 0,
} as const;

const META_ROW_SX = { minWidth: 0 };

const META_COL_SX = { minWidth: 0, flex: 1, overflow: "hidden" as const };

const BUTTONS_ROW_SX = {
  whiteSpace: "nowrap" as const,
} as const;

function RequestRowInner({
  businessId,
  title,
  stateCode,
  slaState,
  isHighlighted,
  compactSlaLabel,
  compactAgeValue,
  compactSlaColor,
  compactSlaFontWeight,
  itServiceName,
  configurationElement,
  initiator,
  labels,
  tags,
  isDraft,
  hasKnowledgeBase,
  expanded,
  onToggle,
  onOpenRequest,
  isFirstInLane,
  lane,
  laneCount,
  request,
  workDurationText,
  onChat,
  activeChatIds,
  backlogLabel,
}: RequestRowProps) {
  const showChatIcon = onChat && activeChatIds?.has(businessId);

  const handleToggleExpand = () => {
    onToggle(businessId);
  };

  const handleOpenRequest = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onOpenRequest?.(businessId);
  };

  const handleChatIconClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onChat?.(businessId);
  };

  return (
    <Box>
      {isFirstInLane && <LaneHeader lane={lane} count={laneCount} />}
      <Paper
        variant="outlined"
        onClick={handleToggleExpand}
        role="button"
        tabIndex={0}
        sx={(theme) => ({
          ...PAPER_BASE_SX,
          borderColor: isHighlighted
            ? theme.palette.primary.main
            : theme.palette.divider,
          backgroundColor: isHighlighted
            ? alpha(theme.palette.primary.main, 0.06)
            : theme.palette.background.paper,
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            boxShadow: theme.shadows[1],
          },
        })}
      >
        <Box
          sx={(theme) => ({
            ...SLA_STRIP_SX,
            bgcolor: theme.palette[getSlaPaletteKey(slaState)].main,
          })}
        />
        <Stack spacing={0.8} sx={{ minWidth: 0, pl: 3, pr: 1.25, py: 1.2 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={TITLE_BOX_SX}>
              <Tooltip title={title ?? ""}>
                <Typography
                  component="button"
                  type="button"
                  onClick={handleOpenRequest}
                  variant="body1"
                  sx={{
                    display: "block",
                    minWidth: 0,
                    maxWidth: "100%",
                    fontWeight: 700,
                    lineHeight: 1.35,
                    textAlign: "left",
                    background: "transparent",
                    border: 0,
                    padding: 0,
                    color: "inherit",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                  noWrap
                >
                  {title}
                </Typography>
              </Tooltip>
            </Box>

            <Stack
              direction="row"
              spacing={0.4}
              useFlexGap
              alignItems="center"
              sx={LABELS_STACK_SX}
            >
              {labels?.map((label) => (
                <LabelChip key={label.name} label={label} />
              ))}
              {showChatIcon && (
                <Tooltip title={CHAT_TOOLTIP} placement="top">
                  <Box sx={chatIconSx(true)} onClick={handleChatIconClick}>
                    <MarkChatUnreadOutlinedIcon sx={chatIconSvgSx} />
                  </Box>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          {tags && (
            <Stack sx={{ py: 0.5 }}>
              <TagsView tags={serializeTags(tags)} />
            </Stack>
          )}

          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={META_ROW_SX}
          >
            <Stack
              direction="row"
              spacing={0.45}
              alignItems="center"
              sx={META_COL_SX}
            >
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {businessId}
              </Typography>
              <SecondarySeparator />
              <MetaText color={`${getStatusColor(stateCode)}.main`}>
                {getRusStateCode(stateCode)}
              </MetaText>
              <SecondarySeparator />
              <MetaText
                color={compactSlaColor}
                fontWeight={compactSlaFontWeight}
                title={`Контрольный срок: `}
              >
                {compactSlaLabel}
              </MetaText>
              <SecondarySeparator />
              {backlogLabel && (
                <>
                  <MetaText
                    color={backlogLabel.color}
                    fontWeight={500}
                    title={backlogLabel.tooltip}
                  >
                    {backlogLabel.name}
                  </MetaText>
                  <SecondarySeparator />
                </>
              )}
              <MetaText title={configurationElement ?? ""}>
                {itServiceName}
              </MetaText>
              <SecondarySeparator />
              <MetaText title={getEngeneerName(initiator)}>
                {getEngeneerName(initiator, "short")}
              </MetaText>
              <SecondarySeparator />
              <MetaText
                title={getTerrbankFullName(initiator?.subdivision?.terbank)}
              >
                {getTerrbankShortName(initiator?.subdivision?.terbank)}
              </MetaText>
              <SecondarySeparator />
              <MetaText title="Дата создания:">
                <>
                  В работе{" "}
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    {compactAgeValue}
                  </Box>
                </>
              </MetaText>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexShrink={0}
              sx={BUTTONS_ROW_SX}
            >
              <OpenInEsmButton businessId={businessId} />
              <Button
                size="small"
                variant="outlined"
                onClick={handleToggleExpand}
                color="secondary"
              >
                Открыть
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Collapse
        in={expanded}
        timeout={200}
        unmountOnExit
        sx={{ overflow: "hidden" }}
      >
        <TriageExpandedPanel
          request={request}
          isDraft={isDraft}
          hasKnowledgeBase={hasKnowledgeBase}
          workDurationText={workDurationText}
        />
      </Collapse>
    </Box>
  );
}

function getSlaPaletteKey(slaState: SlaState): "error" | "warning" | "success" {
  if (slaState === "overdue") return "error";
  if (slaState === "risk") return "warning";
  return "success";
}

export const RequestRow = memo(RequestRowInner);
