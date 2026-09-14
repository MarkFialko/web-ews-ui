import { Typography } from "@mui/material";
import { useAccessInfoQuery } from "@modules/request-card";
import ClientAccessesSection from "@modules/client-card/components/ClientAccessesSection";

export type AccessTabPanelProps = {
  employeeNumber?: string | null;
  isActive?: boolean;
  highlightedAccessName?: string;
  accessData?: UserAccessDto[] | null;
};

function AccessTabPanel({
  employeeNumber,
  isActive,
  highlightedAccessName,
  accessData: propAccessData,
}: AccessTabPanelProps) {
  const { data: fetchedAccesses, isLoading } = useAccessInfoQuery(
    employeeNumber ?? "",
    { skip: !!propAccessData || !employeeNumber || !isActive },
  );
  const accesses = propAccessData ?? fetchedAccesses;

  if (!employeeNumber) {
    return (
      <Typography variant="body2" color="text.secondary">
        Данные о доступах недоступны.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Загрузка данных о доступах...
      </Typography>
    );
  }

  return (
    <ClientAccessesSection
      accesses={accesses ?? []}
      highlightedAccessName={highlightedAccessName}
    />
  );
}

export default AccessTabPanel;
