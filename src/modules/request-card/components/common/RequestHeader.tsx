import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTakeInWorkMutation } from "@modules/request-card/api";
import { useUser } from "@shared/user";
import { getRusStateCode, type RequestDTO } from "@shared/request";
import { CopyButton } from "@shared/ui";
import { canTakeToWork } from "@modules/request-card/model/canTakeToWork";

import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

export type RequestHeaderProps = {
  incident: RequestDTO;
  createdAtLabel: string;
  slaLabel: string;
  slaTooltip?: string;
  slaTone?: "default" | "warning" | "error";
  onClose?: () => void;
};

function RequestHeader({
  incident,
  createdAtLabel,
  slaLabel,
  slaTooltip,
  slaTone = "default",
  onClose,
}: RequestHeaderProps) {
  const { user } = useUser();
  const [takeInWork] = useTakeInWorkMutation();

  const log = useWorklogLogger();

  const handleTakeInWork = async () => {
    if (incident.businessId && incident.taskId) {
      try {
        await takeInWork({
          businessId: incident.businessId,
          taskId: incident.taskId,
          employeeNumber: user?.employeeNumber ?? "",
        }).unwrap();

        log({
          task: incident.businessId,
          action: WORKLOG_ACTIONS.TASK_IN_WORK,
        });
      } catch {
        /* ошибка бизнес-операции — событие не создаём */
      }
    }
  };

  return (
    <Box
      sx={(theme) => ({
        position: "sticky",
        top: 0,
        zIndex: 2,
        flexShrink: 0,
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        overflow: "hidden",
        backgroundColor:
          slaTone === "error"
            ? "#d32f2f"
            : slaTone === "warning"
              ? "#ed6c02"
              : slaTone === "default"
                ? "#2e7d32"
                : theme.palette.background.default,
        color: theme.palette.common.white,
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          minWidth: 0,
          gap: "10px",
          px: 1.25,
          py: 0.9,
          "& > *": {
            minWidth: 0,
          },
        }}
      >
        <HeaderCell
          value={incident.businessId || ""}
          width={{ xs: 150, md: 170 }}
        >
          <CopyButton
            value={incident.businessId}
            message="Номер запроса скопирован"
          />
        </HeaderCell>
        {canTakeToWork(incident.stateCode) ? (
          <Box width={{ xs: 132, md: 150 }}>
            <Button
              sx={{ color: "white", backgroundColor: "rgb(91,155,213)" }}
              onClick={handleTakeInWork}
            >
              Взять в работу
            </Button>
          </Box>
        ) : (
          <HeaderCell
            value={getRusStateCode(incident.stateCode)}
            width={{ xs: 132, md: 150 }}
          />
        )}
        <HeaderCell value={createdAtLabel} width={{ xs: 160, md: 176 }} />
        <HeaderCell
          value={slaLabel}
          width={{ xs: 110, md: 132 }}
          tooltip={slaTooltip || ""}
        />
        {onClose ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: "auto",
            }}
          >
            <IconButton
              size="small"
              onClick={() => onClose()}
              sx={{
                color: "inherit",
                width: 28,
                height: 28,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.14)",
                },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box />
        )}
      </Box>
    </Box>
  );
}

function HeaderCell({
  value,
  width,
  tooltip,
  children,
}: {
  value: string;
  width: { xs: number; md: number };
  tooltip?: string;
  children?: React.ReactNode;
}) {
  const content = (
    <Stack
      spacing={0.2}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minWidth: 0,
        width,
        overflow: "hidden",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: 600,
          color: "inherit",
          fontSize: { xs: 13, md: 14 },
        }}
        noWrap
      >
        {value} {children}
      </Typography>
    </Stack>
  );

  if (!tooltip) return content;

  return (
    <Tooltip title={tooltip} enterDelay={200}>
      {content}
    </Tooltip>
  );
}

export default RequestHeader;
