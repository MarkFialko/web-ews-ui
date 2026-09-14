import type { RequestDTO } from "@shared/request";
import TransferToWorkgroupPanel from "./TransferToWorkgroupPanel";
import ChangeAssigneePanel from "./ChangeAssigneePanel";
import {
  getActionVisibility,
  resolveAction,
  type RelatedRequestType,
} from "./types";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextPanel } from "./ContextPanel";
import { useRelatedRequests } from "./model/useRelatedRequests";
import { CreateZpiZnr } from "./CreateZpiZnrPanel";

interface RelatedRequestsToolPanelProps {
  request: RequestDTO;
}

export default function RelatedRequestsToolPanel({
  request,
}: RelatedRequestsToolPanelProps) {
  const navigate = useNavigate();

  const { form, isFetching } = useRelatedRequests({ request });

  const visibility = getActionVisibility({
    businessId: request.businessId,
    stateCode: request.stateCode,
  });

  const [activeAction, setActiveAction] = useState<RelatedRequestType | null>(
    resolveAction(request),
  );

  const handleClose = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  // Если ни одно действие не доступно -- пустая панель
  if (Object.values(visibility).every((v) => !v)) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Действия недоступны для текущего типа и статуса обращения
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: "100%", overflow: "auto", m: -1 }}>
      <ContextPanel request={request} />

      <Box
        sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <FormControl>
          <RadioGroup
            value={activeAction}
            onChange={(e) =>
              setActiveAction(e.target.value as RelatedRequestType)
            }
            row
          >
            {visibility.showTransfer && (
              <FormControlLabel
                value="TRANSFER"
                control={<Radio size="small" />}
                label="Перевести на смежную РГ"
              />
            )}
            {visibility.createZpiZnr && (
              <FormControlLabel
                value="CREATE_ZPI_ZNR"
                control={<Radio size="small" />}
                label="Создать ЗПИ/ЗНР"
              />
            )}
            {visibility.showChangeAssignee && (
              <FormControlLabel
                value="CHANGE_ASSIGNEE"
                control={<Radio size="small" />}
                label="Сменить исполнителя"
              />
            )}
          </RadioGroup>
        </FormControl>
      </Box>

      {activeAction === "TRANSFER" && (
        <TransferToWorkgroupPanel
          isFetching={isFetching}
          form={form}
          request={request}
          onClose={handleClose}
        />
      )}

      {activeAction === "CREATE_ZPI_ZNR" && (
        <CreateZpiZnr
          isFetching={isFetching}
          form={form}
          request={request}
          onClose={handleClose}
        />
      )}

      {activeAction === "CHANGE_ASSIGNEE" && (
        <ChangeAssigneePanel
          form={form}
          request={request}
          onClose={handleClose}
        />
      )}
    </Box>
  );
}
