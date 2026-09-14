import { getEngeneerName } from "@modules/triage/utils";
import { Paper, Box } from "@mui/material";
import { getRusRequestType, type RequestDTO } from "@shared/request";
import { SectionHeader, DataField } from "@shared/ui";
import { formatDateTime } from "@shared/utils";

interface Props {
  request: RequestDTO;
}
export const ContextPanel = (props: Props) => {
  const { request } = props;

  return (
    <Paper variant="outlined" sx={{ p: 1.5, m: 3, mb: 0 }}>
      <SectionHeader sx={{ mt: 0 }}>Контекст</SectionHeader>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        <DataField
          label="ЗНР/ЗНИ"
          value={`${request.businessId} · ${getRusRequestType(request.businessId)}`}
        />
        <DataField
          label="Инициатор"
          value={getEngeneerName(request.initiator)}
        />
        <DataField
          label="КС корневого обращения"
          value={formatDateTime(request.targetDate)}
        />
        <DataField label="Объект" value={request.itService.label} />
        <DataField
          label="Текущая рабочая группа"
          value={request.workGroup.workGroupLabel}
        />
      </Box>
    </Paper>
  );
};
