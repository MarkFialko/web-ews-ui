import type { ReactNode } from "react";
import {
  AutoAwesomeOutlined,
  CloseRounded,
  type SvgIconComponent,
} from "@mui/icons-material";
import {
  Box,
  Paper,
  alpha,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  type Theme,
} from "@mui/material";

import { useUser } from "@shared/user";

import { useOptimisticTaskCache } from "@modules/request-card";
import { getStateCodeFormat } from "@modules/triage/utils";

import { ToolPanelSkeleton } from "./ToolPanelSkeleton";
import { PanelSurface } from "./PanelSurface";

const getWorkspaceControlSx = (theme: Theme) => ({
  borderRadius: `${theme.shape.borderRadius}px !important`,
  "&.Mui-disabled": {
    opacity: 0.45,
    cursor: "default",
  },
});

interface ToolPanelShellProps<TToolId extends string> {
  tools: Array<{
    id: TToolId;
    label: string;
    description: string;
    icon: SvgIconComponent;
  }>;
  activeToolId: TToolId | null;
  onClose: () => void;
  onToolClick: (toolId: TToolId) => void;
  onPaletteClick: () => void;
  children: ReactNode;
  activeRequestId: string;
}

export function ToolPanelShell<TToolId extends string>({
  tools,
  activeToolId,
  onClose,
  onToolClick,
  onPaletteClick,
  children,
  activeRequestId,
}: ToolPanelShellProps<TToolId>) {
  const { taskData: request, isLoading } =
    useOptimisticTaskCache(activeRequestId);
  const { user } = useUser();

  const isReady = !isLoading && !!request;

  const activeTool = tools.find((tool) => tool.id === activeToolId) ?? null;

  return (
    <PanelSurface>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          height: "100%",
          display: "grid",
          gridTemplateColumns: "72px minmax(0, 1fr)",
          overflow: "hidden",
          borderRadius: `${theme.shape.borderRadius}px`,
          backgroundColor: alpha(theme.palette.background.paper, 0.82),
          backdropFilter: "blur(12px)",
        })}
      >
        <Stack
          alignItems="center"
          spacing={0.75}
          sx={{ p: 0.75, borderRight: 1, borderColor: "divider" }}
        >
          <Tooltip
            title="Command Pallete (Ctrl+Shift+P)"
            placement="left"
            arrow
            enterDelay={300}
          >
            <IconButton
              onClick={onPaletteClick}
              sx={(theme) => ({
                width: 48,
                height: 48,
                ...getWorkspaceControlSx(theme),
                border: `1px solid ${theme.palette.divider}`,
              })}
            >
              <AutoAwesomeOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          {tools.map((tool) => {
            const Icon = tool.icon;
            const active = tool.id === activeToolId;
            const disabled =
              !isReady ||
              (tool.id === "local-support" &&
                (getStateCodeFormat(request?.stateCode) || "") !== "В работе");

            if (
              tool.id === "chat" &&
              (activeRequestId?.startsWith("INCT") ||
                activeRequestId?.startsWith("SRT"))
            )
              return null;

            if (
              tool.id === "local-support" &&
              user &&
              !["Центр ИТ поддержки рабочих мест пользователей", "УПАРМ"].includes(
                user?.department ?? "",
              )
            )
              return null;

            return (
              <Tooltip
                key={tool.id}
                title={tool.label}
                placement="left"
                arrow
                enterDelay={300}
              >
                <IconButton
                  disabled={disabled}
                  onClick={() => onToolClick(tool.id)}
                  sx={(theme) => ({
                    width: 48,
                    height: 48,
                    ...getWorkspaceControlSx(theme),
                    border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
                    backgroundColor: active
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent",
                  })}
                >
                  <Icon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          })}
        </Stack>

        <Stack spacing={0} sx={{ minWidth: 0, minHeight: 0 }}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{ px: 1.5, py: 1.25, borderBottom: 1, borderColor: "divider" }}
          >
            <Stack spacing={0.25}>
              <Typography variant="subtitle2">{activeTool?.label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {activeTool?.description}
              </Typography>
            </Stack>
            <IconButton
              onClick={onClose}
              sx={(theme) => ({
                ...getWorkspaceControlSx(theme),
                mt: 0.125,
              })}
            >
              <CloseRounded fontSize="small" />
            </IconButton>
          </Stack>
          <Box sx={{ minHeight: 0, flex: 1, overflow: "auto", p: 1 }}>
            {isReady ? children : <ToolPanelSkeleton />}
          </Box>
        </Stack>
      </Paper>
    </PanelSurface>
  );
}
