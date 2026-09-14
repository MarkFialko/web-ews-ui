import { Typography } from "@mui/material";
import { useEmployeeArmsQuery } from "@modules/request-card";
import ClientWorkstationsSection from "@modules/client-card/components/ClientWorkstationsSection";

export type WorkstationTabPanelProps = {
  employeeNumber?: string | null;
  isActive?: boolean;
  highlightedWorkstationName?: string;
  workstations?: EmployeeArmsInfo | null;
};

function WorkstationTabPanel({
  employeeNumber,
  isActive,
  highlightedWorkstationName,
  workstations: propWorkstations,
}: WorkstationTabPanelProps) {
  const { data: fetchedWorkstations, isLoading } = useEmployeeArmsQuery(
    employeeNumber ?? "",
    { skip: !!propWorkstations || !employeeNumber || !isActive },
  );
  const workstations = propWorkstations ?? fetchedWorkstations;

  if (!employeeNumber) {
    return (
      <Typography variant="body2" color="text.secondary">
        Данные об АРМ недоступны.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Загрузка данных об АРМ...
      </Typography>
    );
  }

  return (
    <ClientWorkstationsSection
      workstations={workstations}
      highlightedWorkstationName={highlightedWorkstationName}
    />
  );
}

export default WorkstationTabPanel;
