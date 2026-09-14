import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useState, useEffect, useRef } from "react";
import { useEmployeeArmsQuery } from "@modules/request-card/api";
import {
  useGetNewTaskQuery,
  useCompleteTaskMutation,
} from "./api/localSupportApi";
import type { SberEsmSbsRequest } from "./types/sberEsmSbsRequest";

import { useAppNotifications } from "@shared/notifications/useAppNotifications";
import { useOptimisticTaskCache } from "@modules/request-card";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";
import { useUser } from "@shared/user";

type LocalSupportDraft = {
  key: string;
  vsp: boolean;
  address: string;
  territorialBank: string;
  serviceId: string;
  pcName: string;
  telephone: string;
  requiredWork: string;
  routing: boolean;
};

const LOCAL_SUPPORT_GROUP_BANK_CODES = {
  МБ: "Московский банк",
  СЗБ: "Северо-Западный банк",
  ДВБ: "Дальневосточный банк",
  УРБ: "Уральский банк",
  ПВБ: "Поволжский банк",
  СИБ: "Сибирский банк",
  СРБ: "Среднерусский банк",
  ЮЗБ: "Юго-Западный банк",
  ВВБ: "Волго-Вятский банк",
  ЦЧБ: "Центрально-Черноземный банк",
  ББ: "Байкальский банк",
  ЦА: "ЦА",
} as const;

export type LocalSupportToolPanelProps = {
  ticketId: string;
  draft: LocalSupportDraft;
  onResetDraft: () => void;
  onCreate: () => void;
  onCloseRequest: (ticketId: string) => void;
};

function LocalSupportToolPanel({
  ticketId,
  draft,
  onResetDraft,
  onCreate,
  onCloseRequest,
}: LocalSupportToolPanelProps) {
  const { taskData: request, isLoading } = useOptimisticTaskCache(ticketId);

  const { data: newTaskData, isLoading: isNewTaskLoading } = useGetNewTaskQuery(
    request?.businessId || "",
    {
      skip: !request?.businessId,
    },
  );

  const initiatorPersonalNumber = request?.initiator?.personalNumber;

  const { data: employeeArmsData } = useEmployeeArmsQuery(
    initiatorPersonalNumber || "",
    {
      skip: !initiatorPersonalNumber,
    },
  );

  // Get engineer user info
  const { user } = useUser();

  const { notifyError } = useAppNotifications();

  const log = useWorklogLogger();

  // useRef-флаг: защищает от повторной отправки при ре-рендере внутри одной
  // сессии открытия, при закрытии компонент размонтируется и флаг сбрасывается.
  const hasLoggedLocalSupportOpenRef = useRef(false);

  useEffect(() => {
    if (!hasLoggedLocalSupportOpenRef.current) {
      hasLoggedLocalSupportOpenRef.current = true;
      log({
        task: ticketId,
        action: WORKLOG_ACTIONS.TASK_LOCAL,
      });
    }
  }, [ticketId, log]);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [completeTask, { isLoading: isSubmitting }] = useCompleteTaskMutation();

  // Fallback service from request or draft
  const [draftLocal, setDraftLocal] = useState<LocalSupportDraft>({
    key: draft?.key ?? "",
    vsp: draft?.vsp ?? false,
    address: draft?.address ?? "",
    territorialBank: draft?.territorialBank ?? "",
    serviceId: draft?.serviceId ?? "",
    pcName: draft?.pcName ?? "",
    telephone: draft?.telephone ?? "",
    requiredWork: draft?.requiredWork ?? "",
    routing: draft?.routing ?? false,
  });

  useEffect(() => {
    if (!newTaskData || !user?.department) return;

    setDraftLocal((prev) => ({
      ...prev,
      key: newTaskData.key,
      address: newTaskData.address || "",
      vsp: newTaskData.vsp,
      territorialBank: newTaskData.territorialBank,
      serviceId: newTaskData.serviceId,
      pcName: newTaskData.pcName || "",
      telephone: newTaskData.telephone || "",
      requiredWork: prev?.requiredWork || "",
      routing: user?.department === "УПАРМ",
    }));
  }, [newTaskData, user?.department, ticketId]);

  function isPhoneInvalid(phone: string): boolean {
    const digits = phone?.replace(/\D/g, "") || "";
    return digits.length < 5;
  }

  const validation = {
    address: draftLocal?.address.trim().length < 10,
    territorialBank: draftLocal?.territorialBank.trim().length === 0,
    serviceId: draftLocal?.serviceId.trim().length === 0,
    pcName: draftLocal?.pcName.trim().length < 5,
    telephone: isPhoneInvalid(draftLocal?.telephone.trim()),
    requiredWork: draftLocal?.requiredWork.trim().length < 10,
  };
  const isValid = (() => {
    if (!draftLocal) return false;
    return (
      draftLocal.address.trim().length >= 10 &&
      draftLocal.territorialBank.trim().length > 0 &&
      draftLocal.serviceId.trim().length > 0 &&
      draftLocal.pcName.trim().length >= 5 &&
      !isPhoneInvalid(draftLocal.telephone.trim()) &&
      draftLocal.requiredWork.trim().length >= 10
    );
  })();

  const workstationOptions = Array.from(
    new Set(
      [
        ...(employeeArmsData?.map((workstation) => workstation.NetBIOSName) ??
          []),
        draftLocal?.pcName,
      ].filter(Boolean),
    ),
  ) as string[];

  // Loading state
  const isLoadingAll = isLoading || isNewTaskLoading;
  if (isLoadingAll) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Загрузка данных...
        </Typography>
      </Box>
    );
  }
  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (!isValid) {
      return;
    }

    // Проверяем, что получен UUID запроса из SberESM (поле key)
    if (!newTaskData?.key) {
      notifyError(
        "Не удалось отправить запрос: не получен идентификатор задачи из SberESM. " +
          "Попробуйте перезагрузить страницу или обратитесь к администратору.",
      );
      return;
    }

    // Create SberEsmSbsRequest payload
    const payload: SberEsmSbsRequest = {
      key: newTaskData?.key,
      serviceId: draftLocal?.serviceId,
      territorialBank: draftLocal?.territorialBank,
      address: draftLocal?.address,
      vsp: draftLocal?.vsp,
      routing: draftLocal?.routing,
      requiredWork: draftLocal?.requiredWork,
      pcName: draftLocal?.pcName,
      telephone: draftLocal?.telephone,
    };

    try {
      await completeTask(payload).unwrap();

      // Фактический перевод запроса на локальную поддержку — попадает в ленту.
      log({
        task: ticketId,
        action: WORKLOG_ACTIONS.REDIRECT_TASK_ON_SBS,
      });

      // Call onCreate after successful completion
      onCreate();
      setSubmitAttempted(false);
      onCloseRequest?.(ticketId);
    } catch (error) {
      notifyError(
        "Не удалось отправить запрос на локальную поддержку. " +
          "Попробуйте ещё раз или обратитесь к администратору.",
      );
    }
  };

  const handleCancel = () => {
    onResetDraft();
    setSubmitAttempted(false);
  };

  if (draftLocal) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Stack spacing={1.5}>
            <FormControl>
              <RadioGroup
                row
                value={draftLocal?.vsp ? "vsp" : "admin"}
                onChange={(event) =>
                  setDraftLocal({
                    ...draftLocal,
                    vsp: event.target.value === "vsp" ? true : false,
                  })
                }
              >
                <FormControlLabel
                  value="vsp"
                  control={<Radio size="small" />}
                  label="ВСП"
                />
                <FormControlLabel
                  value="admin"
                  control={<Radio size="small" />}
                  label="Админ. здание"
                />
              </RadioGroup>
            </FormControl>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  xl: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.25,
              }}
            >
              <TextField
                size="small"
                label="Адрес"
                value={draftLocal?.address}
                onChange={(event) =>
                  setDraftLocal({ ...draftLocal, address: event.target.value })
                }
                required
                error={validation.address && submitAttempted}
                helperText={
                  validation.address
                    ? "Укажите адрес (не менее 10 символов)"
                    : " "
                }
              />

              <FormControl
                size="small"
                error={validation.territorialBank && submitAttempted}
              >
                <InputLabel id={`local-support-tb-${ticketId}`} required>
                  Тер. банк
                </InputLabel>
                <Select
                  labelId={`local-support-tb-${ticketId}`}
                  label="Тер. банк"
                  value={draftLocal?.territorialBank}
                  onChange={(event: SelectChangeEvent) =>
                    setDraftLocal({
                      ...draftLocal,
                      territorialBank: event.target.value,
                    })
                  }
                >
                  {Object.keys(LOCAL_SUPPORT_GROUP_BANK_CODES).map(
                    (tbOption) => (
                      <MenuItem
                        key={tbOption}
                        value={LOCAL_SUPPORT_GROUP_BANK_CODES[tbOption]}
                      >
                        {tbOption}
                      </MenuItem>
                    ),
                  )}
                </Select>
                <FormHelperText>
                  {validation.territorialBank ? "Укажите тер. банк" : " "}
                </FormHelperText>
              </FormControl>
              <TextField
                size="small"
                label="Сервис"
                value={draftLocal?.serviceId}
                onChange={(event) =>
                  setDraftLocal({
                    ...draftLocal,
                    serviceId: event.target.value,
                  })
                }
                required
                error={validation.serviceId && submitAttempted}
                helperText={validation.serviceId ? "Укажите сервис" : " "}
              />

              <Autocomplete
                freeSolo
                options={workstationOptions}
                value={draftLocal?.pcName}
                onInputChange={(_, value) =>
                  setDraftLocal({ ...draftLocal, pcName: value })
                }
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    size="small"
                    label="Имя АРМ"
                    error={validation.pcName && submitAttempted}
                    helperText={
                      validation.pcName
                        ? "Укажите имя АРМ (не менее 5 символов)"
                        : " "
                    }
                  />
                )}
              />

              <TextField
                size="small"
                label="Контактный телефон"
                value={draftLocal?.telephone}
                onChange={(event) =>
                  setDraftLocal({
                    ...draftLocal,
                    telephone: event.target.value,
                  })
                }
                required
                error={validation.telephone && submitAttempted}
                helperText={
                  validation.telephone
                    ? "Укажите контактный телефон (не менее 5 цифр)"
                    : " "
                }
              />
            </Box>

            <TextField
              size="small"
              fullWidth
              multiline
              minRows={4}
              label="Необходимые работы"
              value={draftLocal?.requiredWork}
              onChange={(event) =>
                setDraftLocal({
                  ...draftLocal,
                  requiredWork: event.target.value,
                })
              }
              required
              error={validation.requiredWork && submitAttempted}
              helperText={
                validation.requiredWork
                  ? "Опишите необходимые работы (не менее 10 символов)"
                  : " "
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={draftLocal?.routing}
                  onChange={(event) =>
                    setDraftLocal({
                      ...draftLocal,
                      routing: event.target.checked,
                    })
                  }
                />
              }
              label="Маршрутизация"
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCancel}>
                Отмена
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Divider />
      </Box>
    );
  }

  return null;
}

export default LocalSupportToolPanel;
