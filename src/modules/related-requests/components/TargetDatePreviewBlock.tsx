import { useWatch, type UseFormReturn } from "react-hook-form";
import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import { DataField } from "@shared/ui";
import type { WorkgroupSettingsDto } from "@modules/ticket-actions";
import type { FormValues } from "../model/useRelatedRequests";
import { FormInputDateTimePicker } from "@shared/ui/rhf/FormInputDateTimePicker";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef } from "react";
import type { RequestDTO } from "@shared/request";
import { getEngineerRequestSlaState } from "@shared/utils";

interface Props {
  request: RequestDTO;
  form: UseFormReturn<FormValues>;
}

const DEFAULT_PERCENT = 80;
const MINUTES_THRESHOLD = 30;

/**
 * Рассчитывает КС на основе настроек и состояния КС корневого обращения.
 */
function calculateTargetDate(
  request: RequestDTO,
  time_breach: number = 0,
  ks_percent: number = DEFAULT_PERCENT,
): dayjs.Dayjs {
  const rootTargetDate = request.targetDate ? dayjs(request.targetDate) : null;
  const now = dayjs();
  const settingHours = time_breach;

  // Если КС корневого обращения истёк — используем время из справочника
  if (rootTargetDate && rootTargetDate.isBefore(now)) {
    return now.add(settingHours, "hours");
  }

  // КС корневого обращения не истёк
  let newKs = now.add(settingHours, "hours");

  // Если calculated КС выходит за рамки КС корневого обращения
  // или ks_percent не заполнен — применяем % от КС корневого обращения
  if (rootTargetDate && newKs.isAfter(rootTargetDate)) {
    const percentToUse = ks_percent ?? DEFAULT_PERCENT;
    const rootDurationMinutes = rootTargetDate.diff(now, "minutes");
    const targetMinutes = (rootDurationMinutes * percentToUse) / 100;
    newKs = now.add(targetMinutes, "minutes");
  }

  return newKs;
}

/**
 * Проверяет, осталось ли до окончания КС корневого обращения ≤ 30 минут.
 */
function hasLessOrEqual30MinutesLeft(request: RequestDTO): boolean {
  if (!request.targetDate) return false;
  const rootTargetDate = dayjs(request.targetDate);
  const remainingMinutes = rootTargetDate.diff(dayjs(), "minutes");
  return remainingMinutes <= MINUTES_THRESHOLD;
}

export const TargetDatePreviewBlock = (props: Props) => {
  const { request, form } = props;

  const setting = useWatch({
    control: form.control,
    name: "workgroupWithService.setting",
  }) as WorkgroupSettingsDto | null;

  const ks = useWatch({ control: form.control, name: "ks" });

  const isExpired = useMemo(
    () => getEngineerRequestSlaState(request.targetDate) === "overdue",
    [request.targetDate],
  );

  const isNearDeadline = useMemo(
    () => hasLessOrEqual30MinutesLeft(request),
    [request],
  );

  const prevBreachRef = useRef<number | undefined>();
  const prevPercentRef = useRef<number | undefined>();

  useEffect(() => {
    if (!setting) return;

    const timeBreach = setting?.time_breach;
    const ksPercent = setting?.ks_percent;

    if (
      prevBreachRef.current === timeBreach &&
      prevPercentRef.current === ksPercent
    ) {
      return;
    }
    prevBreachRef.current = timeBreach;
    prevPercentRef.current = ksPercent;

    form.setValue("ks", calculateTargetDate(request, timeBreach, ksPercent), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setting, request, form]);

  if (!setting) return null;

  return (
    <Paper variant="outlined" sx={{ p: 1.25 }}>
      <Stack spacing={1}>
        <Typography variant="bodyAccent">Предпросмотр КС</Typography>

        {isNearDeadline && !isExpired && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            До окончания КС корневого обращения осталось 30 минут и меньше.
            Рекомендуется дождаться окончания КС перед созданием ЗПИ/ЗНР.
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gap: 1.25,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          <DataField
            label="КС нового обращения"
            value={ks.format("DD.MM.YYYY HH:mm")}
            action={
              <FormInputDateTimePicker
                control={form.control}
                name="ks"
                sx={{
                  width: 40,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiInputBase-input": { width: 0, padding: 0 },
                }}
                minDate={dayjs()}
                rules={{
                  validate: () => {
                    if (!isExpired && isNearDeadline) {
                      return "Дождитесь окончания КС";
                    }
                    return true;
                  },
                }}
              />
            }
          />
          <DataField
            label="КС согласования"
            value={setting.ks_in_agreement ? `${setting.time_breach} ч` : "—"}
          />
          <DataField
            label="Базовое время"
            value={setting.time_breach ? `${setting.time_breach} ч` : "—"}
          />
          <DataField
            label="Особенности расчёта"
            value={[
              setting.ks_in_weekend ? "выходные учитываются" : "без выходных",
              setting.time_zone ? "с TZ инициатора" : "серверный TZ",
            ].join(" · ")}
          />
        </Box>
      </Stack>
    </Paper>
  );
};
