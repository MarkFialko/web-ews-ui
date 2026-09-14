import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronDown } from "lucide-react";
import type { EmployeeArmsInfo } from "@modules/request-card/types/EmployeeArmsInfo";

export type ClientWorkstationsSectionProps = {
  workstations: EmployeeArmsInfo[];
  highlightedWorkstationName?: string | null;
};

/**
 * Workstation list with expandable details for the Client Card module.
 */
function ClientWorkstationsSection({
  workstations,
  highlightedWorkstationName = null,
}: ClientWorkstationsSectionProps) {
  const [expandedPc, setExpandedPc] = useState<string | false>(
    workstations?.[0]?.NetBIOSName,
  );
  const highlightedWorkstationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!highlightedWorkstationName) return;

    const frameId = requestAnimationFrame(() => {
      highlightedWorkstationRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [highlightedWorkstationName]);

  return (
    <Stack spacing={1}>
      {workstations.map((pc) => {
        const isHighlighted =
          Boolean(highlightedWorkstationName) &&
          pc?.NetBIOSName === highlightedWorkstationName;

        return (
          <Accordion
            key={pc?.NetBIOSName}
            ref={isHighlighted ? highlightedWorkstationRef : undefined}
            expanded={
              (highlightedWorkstationName ?? expandedPc) === pc?.NetBIOSName
            }
            onChange={(_, expanded) =>
              setExpandedPc(expanded ? pc?.NetBIOSName : false)
            }
            sx={(theme) => ({
              border: "1px solid",
              borderColor: isHighlighted
                ? theme.palette.primary.main
                : theme.palette.divider,
              backgroundColor: isHighlighted
                ? alpha(theme.palette.primary.main, 0.08)
                : theme.palette.background.paper,
              boxShadow: isHighlighted
                ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`
                : "none",
            })}
          >
            <AccordionSummary
              expandIcon={<ChevronDown size={18} />}
              sx={{
                px: 1.5,
                py: 0.5,
                cursor: "pointer",
                "& .MuiAccordionSummary-content": { margin: 0 },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  marginLeft: "12px",
                },
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ width: "100%" }}
              >
                <Box>
                  <Typography variant="subtitle2">
                    {pc?.NetBIOSName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ОС: {pc?.OSName}
                  </Typography>
                </Box>
                <Box textAlign={{ xs: "left", sm: "right" }}>
                  <Typography variant="caption" color="text.secondary">
                    IP: {pc?.IPAddress}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Домен: {pc?.ARMDomain}
                  </Typography>
                </Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2">Подробно АРМ</Typography>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    gap={1}
                    mt={1}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Имя АРМ: {pc?.NetBIOSName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Сегмент сети: {pc?.sourceSegment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Имя домена/рабочей группы пользователя: {pc?.userDomain}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      NetBIOS имя: {pc?.NetBIOSName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Имя пользователя: {pc?.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Имя домена/рабочей группы компьютера: {pc?.ARMDomain}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Модель компьютера: {pc?.model}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Производитель компьютера: {pc?.manufacturer}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Операционная система: {pc?.OSName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Серийный номер BIOS: {pc?.serialBios}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Дата инсталляции ОС: {pc?.installDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Версия ОС: {pc?.OSVersion}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Процессор: {pc?.CPUName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Директория ОС: {pc?.OSDirectory}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Объем ОЗУ (по планкам), Мб: {pc?.ramVol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Частота процессора, МГц: {pc?.procFreq}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      MAC адрес: {pc?.MACAddress}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Суммарный объем HDD, Гб: {pc?.hddVol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      IP шлюз: {pc?.IPRoute}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      IP адрес: {pc?.IPAddress}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Физическое расположение ПК: {pc?.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Дата Heartbeat Discovery Data Record (MSK):{" "}
                      {pc?.heartBeatDiscoveryDataRecordDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      OU: {pc?.ou}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Статус пароля на BIOS: {pc?.biosPassStat}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
      {workstations.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Нет данных по рабочим станциям.
        </Typography>
      )}
    </Stack>
  );
}

export default ClientWorkstationsSection;
