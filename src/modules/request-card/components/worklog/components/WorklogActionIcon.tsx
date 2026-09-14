import { memo } from "react";
import { Chip, Tooltip } from "@mui/material";
import { MessageSquare, PenLine } from "lucide-react";

import type { WorklogAction } from "@shared/worklog-logger";
import { WORKLOG_ACTIONS } from "@shared/worklog-logger";

import { ACTION_ICON_TEXTS } from "../constants";
import { useRequestsRouter } from "@shared/routing";

interface Props {
  action: WorklogAction;
  businessId: string;
}

const SOURCE_LINK_CONFIG: Record<
  WorklogAction,
  { icon: React.ReactElement; toolId: "chat" | "protocol" } | null
> = {
  [WORKLOG_ACTIONS.WRITE_CHAT]: {
    icon: <MessageSquare size={14} />,
    toolId: "chat",
  },
  [WORKLOG_ACTIONS.WRITE_INFO_PROTOCOL]: {
    icon: <PenLine size={14} />,
    toolId: "protocol",
  },
  [WORKLOG_ACTIONS.APP_START]: null,
  [WORKLOG_ACTIONS.APP_INACTIVE_END]: null,
  [WORKLOG_ACTIONS.LIST_OPEN]: null,
  [WORKLOG_ACTIONS.OPEN_TASK]: null,
  [WORKLOG_ACTIONS.OPEN_TASK_BIG]: null,
  [WORKLOG_ACTIONS.TASK_LOCAL]: null,
  [WORKLOG_ACTIONS.TASK_OUT]: null,
  [WORKLOG_ACTIONS.TASK_IN_WORK]: null,
  [WORKLOG_ACTIONS.CLOSE_TASK]: null,
  [WORKLOG_ACTIONS.TASK_REAZON]: null,
  [WORKLOG_ACTIONS.WRITE_INFO_DECISION]: null,
  [WORKLOG_ACTIONS.WRITE_HASHTAG_DIR]: null,
  [WORKLOG_ACTIONS.WRITE_HASHTAG]: null,
  [WORKLOG_ACTIONS.DELETE_HASHTAG]: null,
  [WORKLOG_ACTIONS.CREATE_ZNR]: null,
  [WORKLOG_ACTIONS.REDIRECT_TASK_ON_GROUP]: null,
  [WORKLOG_ACTIONS.REDIRECT_TASK_ON_USER]: null,
  [WORKLOG_ACTIONS.REDIRECT_TASK_ON_SBS]: null,
  [WORKLOG_ACTIONS.CALL_DIAL]: null,
  [WORKLOG_ACTIONS.CALL_SUCCESS]: null,
  [WORKLOG_ACTIONS.NO_CALL]: null,
  [WORKLOG_ACTIONS.CALL_LATER]: null,
};

export const WorklogActionIcon = memo((props: Props) => {
  const { action, businessId } = props;
  const { openTicket } = useRequestsRouter();
  const config = SOURCE_LINK_CONFIG[action];

  if (!config) {
    return null;
  }

  const label =
    config.toolId === "chat"
      ? ACTION_ICON_TEXTS.chat
      : ACTION_ICON_TEXTS.protocol;

  const handleClick = () => {
    openTicket(businessId, config.toolId);
  };

  return (
    <Tooltip title={`Перейти в ${label}`}>
      <Chip
        icon={config.icon}
        label={label}
        size="small"
        clickable
        onClick={handleClick}
        sx={{ minWidth: 0 }}
      />
    </Tooltip>
  );
});

export default WorklogActionIcon;
