import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import BusinessIcon from "@mui/icons-material/Business";
import FaxIcon from "@mui/icons-material/Fax";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import DialpadIcon from "@mui/icons-material/Dialpad";
import { Phone, PhoneOff, X } from "lucide-react";
import { getModuleErrorStateProps, type DevErrorKind } from "@shared/dev";
import type {
  CallPanelDraftState,
  CallPanelFocusField,
} from "./types/CallPanelDraftState";
import {
  combineCallbackDateAndTime,
  formatCallbackDate,
  formatCallbackDateTime,
  formatCallbackTime,
  getMinCallbackDateTime,
  getRelativeCallbackDateTime,
  isCallbackDateTimeValid,
  parseCallbackDate,
  parseCallbackTime,
  parseStoredCallbackDateTime,
} from "./callbackDateTime";
import { useGetEmployeePhonesQuery, useMakeCallMutation } from "./api";
import { useAppNotifications } from "@shared/notifications";
import { extractErrorMessage } from "@shared/api";
import { PROTOCOL_TYPE_CODES, useProtocol } from "@shared/protocol";

import { useOptimisticTaskCache } from "@modules/request-card";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";
import type { EngeneerPhone } from "./types";
import { useUser } from "@shared/user";

// TODO: конец строки скрыт за краем фото — хвост шаблона восстановлен по
// смыслу (используется как BUSY_OUTCOME_TEMPLATE.replace("(Номер обращения)", ticketId!)),
// сверить с оригиналом при появлении более четкого фото.
const BUSY_OUTCOME_TEMPLATE =
  "Уважаемый коллега, мы связались с Вами по указанному номеру, однако не смогли получить необходимые ответы. Просим Вас предоставить обратную связь по заявке (Номер обращения).";

const CALLBACK_DELAY_OPTIONS = [
  { minutes: 15, label: "15 минут" },
  { minutes: 30, label: "30 минут" },
  { minutes: 45, label: "45 минут" },
  { minutes: 60, label: "1 час" },
  { minutes: 90, label: "1,5 часа" },
  { minutes: 120, label: "2 часа" },
  { minutes: 1440, label: "1 день" },
  { minutes: 2880, label: "2 дня" },
  { minutes: 4320, label: "3 дня" },
] as const;

type DialTargetId = "internal" | "city" | "mobile" | "self";

const buildDefaultDraftState = ({
  preselectedDialTarget,
}: {
  preselectedDialTarget: DialTargetId;
}): CallPanelDraftState => ({
  activeView: "call",
  selectedTarget: preselectedDialTarget,
  userChangedTarget: false,
  dialCustomPhoneActive: false,
  dialCustomPhone: "",
  selectedOutcome: null,
  messageDraft: BUSY_OUTCOME_TEMPLATE,
  messageDirty: false,
  callbackPreset: "",
  callbackDateText: "",
  callbackTimeText: "",
  callbackDateTimeText: "",
  lastFocusedField: `call-${preselectedDialTarget}` as CallPanelFocusField,
});

const areDraftStatesEqual = (
  left: CallPanelDraftState,
  right: CallPanelDraftState,
) =>
  left.activeView === right.activeView &&
  left.selectedTarget === right.selectedTarget &&
  left.userChangedTarget === right.userChangedTarget &&
  left.dialCustomPhoneActive === right.dialCustomPhoneActive &&
  left.dialCustomPhone === right.dialCustomPhone &&
  left.selectedOutcome === right.selectedOutcome &&
  left.messageDraft === right.messageDraft &&
  left.messageDirty === right.messageDirty &&
  left.callbackPreset === right.callbackPreset &&
  left.callbackDateText === right.callbackDateText &&
  left.callbackTimeText === right.callbackTimeText &&
  left.callbackDateTimeText === right.callbackDateTimeText &&
  left.lastFocusedField === right.lastFocusedField;

export type CallPanelProps = {
  ticketId?: string;
  errorMessage?: string;
  errorSeverity?: "info" | "warning" | "error";
  onErrorRetry?: () => void;
  devModuleErrorKind?: DevErrorKind;
  onDevModuleErrorRetry?: () => void;
  onClose?: () => void;
  onDraftStateChange?: (draftState: CallPanelDraftState) => void;
};

const getIconByPhoneType = (type?: EngeneerPhone["type"] | null) => {
  if (type === "WORK" || type === "City") return BusinessIcon;
  if (type === "HOME" || type === "Inner") return FaxIcon;
  if (type === "MOBILE" || type === "Mobile") return SmartphoneIcon;

  return DialpadIcon;
};

function CallPanel({
  ticketId,
  errorMessage,
  errorSeverity = "warning",
  onErrorRetry,
  devModuleErrorKind = "none",
  onDevModuleErrorRetry,
  onClose,
  onDraftStateChange,
}: CallPanelProps) {
  const showDevErrorNotice =
    devModuleErrorKind === "info" || devModuleErrorKind === "action";
  const devErrorStateProps = showDevErrorNotice
    ? getModuleErrorStateProps("Дозвон", devModuleErrorKind)
    : null;

  const { taskData: incident } = useOptimisticTaskCache(ticketId);

  const log = useWorklogLogger();

  const { data: phones = [] as EngeneerPhone[] } = useGetEmployeePhonesQuery(
    incident?.initiator.personalNumber!,
    { skip: !incident },
  );

  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  const isSelectedPhoneActive = useMemo(
    () => phones.some((p) => p.number === selectedPhone),
    [phones, selectedPhone],
  );

  const defaultDraftState = useMemo(
    () => buildDefaultDraftState({ preselectedDialTarget: "self" }),
    [],
  );

  const [activeView, setActiveView] = useState<"call" | "callHistory">(
    defaultDraftState.activeView,
  );
  const [selectedTarget, setSelectedTarget] = useState<DialTargetId | null>(
    defaultDraftState.selectedTarget,
  );
  const [userChangedTarget, setUserChangedTarget] = useState(
    defaultDraftState.userChangedTarget,
  );

  const [callPhase, setCallPhase] = useState<"idle" | "active" | "ended">(
    "idle",
  );
  const [callTimerSeconds, setCallTimerSeconds] = useState(0);
  const [showResultBlock, setShowResultBlock] = useState(false);

  const [selectedOutcome, setSelectedOutcome] = useState<
    "connected" | "busy" | "callback" | null
  >(defaultDraftState.selectedOutcome);
  const [messageDraft, setMessageDraft] = useState(
    defaultDraftState.messageDraft,
  );
  const [callbackPreset, setCallbackPreset] = useState(
    defaultDraftState.callbackPreset,
  );
  const [callbackDateText, setCallbackDateText] = useState(
    defaultDraftState.callbackDateText,
  );
  const [callbackTimeText, setCallbackTimeText] = useState(
    defaultDraftState.callbackTimeText,
  );
  const [isCallbackSliderFocused, setIsCallbackSliderFocused] =
    useState(false);
  const [resultFixed, setResultFixed] = useState(false);
  const [resultSkipped, setResultSkipped] = useState(false);

  const callMessageRef = useRef<HTMLInputElement | null>(null);
  const callbackDateRef = useRef<HTMLInputElement | null>(null);
  const skipNextDraftEmitRef = useRef(false);
  const hydratedTicketIdRef = useRef<string | null>(null);
  const lastKnownDraftRef = useRef<CallPanelDraftState | null>(null);
  const fixedOutcomeRef = useRef<"connected" | "busy" | "callback" | null>(
    null,
  );
  const minCallbackDateTime = getMinCallbackDateTime();
  const callbackDateValue = parseCallbackDate(callbackDateText);
  const callbackTimeValue = parseCallbackTime(
    callbackTimeText,
    callbackDateValue ?? minCallbackDateTime,
  );
  const callbackDateTimeValue = combineCallbackDateAndTime(
    callbackDateValue,
    callbackTimeValue,
  );
  const callbackDateTimeText = callbackDateTimeValue
    ? formatCallbackDateTime(callbackDateTimeValue)
    : "";
  const callbackDateTimeTouched =
    callbackDateText.length > 0 || callbackTimeText.length > 0;
  const callbackDateTimeSelectionValid = isCallbackDateTimeValid(
    callbackDateTimeValue,
    minCallbackDateTime,
  );
  const callbackDateTimeHelperText = !callbackDateTimeTouched
    ? " "
    : !callbackDateText || !callbackTimeText
      ? "Укажите дату и время."
      : !callbackDateValue || !callbackTimeValue
        ? "Проверьте дату и время."
        : !callbackDateTimeSelectionValid
          ? "Время должно быть не раньше чем через 15 минут."
          : " ";
  const hasCallbackDateTimeError = callbackDateTimeHelperText !== " ";
  const isMinCallbackDateSelected =
    !!callbackDateValue &&
    callbackDateValue.isSame(minCallbackDateTime, "day");
  const minCallbackTime = isMinCallbackDateSelected
    ? minCallbackDateTime
    : undefined;
  const selectedCallbackSliderIndex = CALLBACK_DELAY_OPTIONS.findIndex(
    (option) => option.minutes === Number(callbackPreset),
  );

  useEffect(() => {
    if (!ticketId) return;

    const nextDraftState = /* draftState ??*/ defaultDraftState;
    const ticketChanged = hydratedTicketIdRef.current !== ticketId;
    const sameAsLastKnown =
      lastKnownDraftRef.current &&
      areDraftStatesEqual(nextDraftState, lastKnownDraftRef.current);

    if (!ticketChanged && sameAsLastKnown) {
      return;
    }

    hydratedTicketIdRef.current = ticketId;
    lastKnownDraftRef.current = nextDraftState;
    skipNextDraftEmitRef.current = true;
    setActiveView(nextDraftState.activeView);
    setSelectedTarget(
      nextDraftState.selectedTarget === "self"
        ? null
        : nextDraftState.selectedTarget,
    );
    setUserChangedTarget(nextDraftState.userChangedTarget);
    setCallPhase("idle");
    setCallTimerSeconds(0);
    setShowResultBlock(false);
    setSelectedOutcome(nextDraftState.selectedOutcome);
    setMessageDraft(nextDraftState.messageDraft);
    setCallbackPreset(nextDraftState.callbackPreset);
    const fallbackCallbackDateTime = parseStoredCallbackDateTime(
      nextDraftState.callbackDateTimeText,
    );
    setCallbackDateText(
      nextDraftState.callbackDateText ||
        (fallbackCallbackDateTime
          ? formatCallbackDate(fallbackCallbackDateTime)
          : ""),
    );
    setCallbackTimeText(
      nextDraftState.callbackTimeText ||
        (fallbackCallbackDateTime
          ? formatCallbackTime(fallbackCallbackDateTime)
          : ""),
    );
    setResultFixed(false);
    setResultSkipped(false);
  }, [defaultDraftState, ticketId]);

  useEffect(() => {
    if (!onDraftStateChange) return;
    if (skipNextDraftEmitRef.current) {
      skipNextDraftEmitRef.current = false;
      return;
    }

    const nextDraftState = {
      activeView,
      selectedTarget,
      userChangedTarget,
      dialCustomPhoneActive: false,
      dialCustomPhone: "",
      selectedOutcome,
      messageDraft,
      messageDirty: false,
      callbackPreset,
      callbackDateText,
      callbackTimeText,
      callbackDateTimeText,
      lastFocusedField: null,
    };

    lastKnownDraftRef.current = nextDraftState;
    onDraftStateChange(nextDraftState);
  }, [
    activeView,
    callbackDateText,
    callbackDateTimeText,
    callbackPreset,
    callbackTimeText,
    messageDraft,
    onDraftStateChange,
    selectedOutcome,
    selectedTarget,
    userChangedTarget,
  ]);

  const handlePhoneChange =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value.replace(/\D/g, "");
      setter(nextValue);
    };

  const SelectedIcon = getIconByPhoneType(
    phones.find((phone) => phone.number === selectedPhone)?.type,
  );

  const canFixOutcome = (() => {
    if (selectedOutcome === "busy") return messageDraft.trim().length > 4;
    if (selectedOutcome === "callback") {
      if (!callbackDateTimeSelectionValid) return false;
      return messageDraft.trim().length > 4;
    }
    return false;
  })();

  const isAcwBlocked = callPhase === "ended";

  useEffect(() => {
    setResultFixed(false);
    setResultSkipped(false);
    if (selectedOutcome === "busy") {
      setMessageDraft(
        BUSY_OUTCOME_TEMPLATE.replace("(Номер обращения)", ticketId!),
      );
    }
  }, [selectedOutcome]);

  useEffect(() => {
    if (selectedOutcome !== "callback") return;

    const callbackTimeLabel = callbackDateTimeSelectionValid
      ? callbackDateTimeText
      : "на указанное время";

    setMessageDraft(
      `Запланирован звонок ${callbackTimeLabel} на номер телефона ${selectedPhone}`,
    );
  }, [
    callbackDateTimeSelectionValid,
    callbackDateTimeText,
    selectedPhone,
    selectedOutcome,
  ]);

  const canStartCall =
    (selectedPhone?.trim().replace(/\D/g, "").length ?? 0) > 2;

  useEffect(() => {
    if (callPhase !== "active") return;
    setCallTimerSeconds(0);
    const interval = window.setInterval(() => {
      setCallTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [callPhase]);

  useEffect(() => {
    if (callPhase === "idle") {
      setShowResultBlock(false);
      return;
    }
    if (callPhase === "active") {
      setShowResultBlock(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowResultBlock(true);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [callPhase]);

  useEffect(() => {
    if (!resultFixed) return;
    const timeout = window.setTimeout(() => {
      setCallPhase("idle");
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [resultFixed]);

  // Фиксация результата: NO_CALL (busy) и CALL_LATER (callback)
  useEffect(() => {
    if (!resultFixed) {
      fixedOutcomeRef.current = null;
      return;
    }
    const outcome = selectedOutcome;
    if (outcome === "busy" || outcome === "callback") {
      fixedOutcomeRef.current = outcome;
    }
  }, [resultFixed, selectedOutcome]);

  useEffect(() => {
    const outcome = fixedOutcomeRef.current;
    if (!outcome) return;
    if (outcome === "busy") {
      log({
        action: WORKLOG_ACTIONS.NO_CALL,
        task: ticketId ?? "Information",
        commentParams: { phone: selectedPhone ?? "" },
      });
    } else if (outcome === "callback") {
      log({
        action: WORKLOG_ACTIONS.CALL_LATER,
        task: ticketId ?? "Information",
        commentParams: { phone: selectedPhone ?? "" },
      });
    }
    fixedOutcomeRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultFixed]);

  const { notifyError, notifySuccess } = useAppNotifications();

  const { user } = useUser();

  const [makeCall, { isLoading: isMakeCallLoading }] = useMakeCallMutation();

  const { sendToProtocol, isLoading: isSendToProtocolLoading } = useProtocol();

  // На связи, продолжаем
  useEffect(() => {
    const message = `Успешно осуществлен звонок на номер "${selectedPhone}"`;
    if (callPhase === "ended" && selectedOutcome === "connected") {
      sendToProtocol(incident!, message, PROTOCOL_TYPE_CODES.ENGINEER_MESSAGE)
        .then(() => {
          log({
            action: WORKLOG_ACTIONS.CALL_SUCCESS,
            task: ticketId ?? "Information",
            commentParams: { phone: selectedPhone ?? "" },
          });
          notifySuccess(message);
          setResultFixed(true);
          setResultSkipped(false);
        })
        .catch((error) => {
          notifyError(extractErrorMessage(error?.data));
          setSelectedOutcome(null);
        });
    }
  }, [callPhase, selectedOutcome]);

  const handleCallToggle = async () => {
    if (callPhase !== "active") {
      let phoneFrom = "";
      try {
        const config = await (
          await fetch(`${document.location.origin}/web-ews-ui/config.json`)
        ).json();
        phoneFrom =
          config.EMPLOYEE_PHONE ??
          import.meta.env.VITE_PHONE_NUMBER ??
          user?.phoneNumberPrimary ??
          user?.phoneNumberSecond ??
          "Не определен";
      } catch {
        phoneFrom =
          import.meta.env.VITE_PHONE_NUMBER ??
          user?.phoneNumberPrimary ??
          user?.phoneNumberSecond ??
          "Не определен";
      }

      makeCall({
        clientId: incident?.initiator.id ?? "Не определен",
        phoneFrom: phoneFrom,
        phoneTo: selectedPhone!,
        smId: user?.smId ?? "Не определен",
        requestNumber: ticketId!,
      })
        .unwrap()
        .then(() => {
          log({
            action: WORKLOG_ACTIONS.CALL_DIAL,
            task: ticketId ?? "Information",
            commentParams: { phone: selectedPhone ?? "" },
          });
          setCallPhase("active");
          setCallTimerSeconds(0);
          setResultFixed(false);
          setResultSkipped(false);
          setSelectedOutcome(null);
          setCallbackPreset("");
          setCallbackDateText("");
          setCallbackTimeText("");
        })
        .catch((error) => {
          notifyError(
            `Не удалось совершить звонок: ${extractErrorMessage(error?.data)}`,
          );
        });

      return;
    }

    setCallPhase("ended");
    // setCallPhase("idle");
    // setSelectedPhone("");
  };

  const isCallButtonDisabled =
    isAcwBlocked || !canStartCall || isMakeCallLoading;

  const setCallbackDelay = (minutes: number) => {
    const nextValue = getRelativeCallbackDateTime(minutes);
    setCallbackDateText(formatCallbackDate(nextValue));
    setCallbackTimeText(formatCallbackTime(nextValue));
    setCallbackPreset(`${minutes}`);
  };

  const formatCallTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  };

  const formatCallbackDelayLabel = (minutes: number) => {
    const matchingOption = CALLBACK_DELAY_OPTIONS.find(
      (option) => option.minutes === minutes,
    );
    if (matchingOption) return matchingOption.label;
    if (minutes < 60) return `${minutes} минут`;
    const hours = minutes / 60;
    if (Number.isInteger(hours)) {
      if (hours === 1) return "1 час";
      if (hours >= 2 && hours <= 4) return `${hours} часа`;
      if (hours < 24) return `${hours} часов`;
    }
    const days = minutes / (60 * 24);
    if (Number.isInteger(days)) {
      if (days === 1) return "1 день";
      if (days >= 2 && days <= 4) return `${days} дня`;
      return `${days} дней`;
    }
    return `${hours.toFixed(1).replace(".", ",")} часа`;
  };

  const containerSx = {
    position: "relative" as const,
    height: "100%",
    minHeight: 0,
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        ...containerSx,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box>
        <>
          <Stack direction="row" justifyContent="space-between" px={2} py={1}>
            <Typography variant="subtitle2">{ticketId}</Typography>
            <IconButton size="small" onClick={() => onClose?.()}>
              <X size={14} />
            </IconButton>
          </Stack>
          <Divider />
        </>
      </Box>

      {devErrorStateProps ? (
        <Box sx={{ px: 3, pt: 2 }}>
          <Alert
            severity={devErrorStateProps.severity}
            variant="outlined"
            action={
              onDevModuleErrorRetry ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={onDevModuleErrorRetry}
                >
                  {devErrorStateProps.retryLabel}
                </Button>
              ) : undefined
            }
          >
            <strong>{devErrorStateProps.title}</strong>{" "}
            {devErrorStateProps.description}
          </Alert>
        </Box>
      ) : null}

      {errorMessage && (
        <Box sx={{ px: 3, pt: 2 }}>
          <Alert
            severity={errorSeverity}
            variant="outlined"
            action={
              onErrorRetry ? (
                <Button color="inherit" size="small" onClick={onErrorRetry}>
                  Повторить
                </Button>
              ) : undefined
            }
          >
            {errorMessage}
          </Alert>
        </Box>
      )}

      {activeView === "call" ? (
        <>
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Stack spacing={1.5}>
              {callPhase === "idle" ? (
                <Typography variant="body2">
                  Выберете номер для связи:
                </Typography>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  flexWrap="wrap"
                >
                  <Typography variant="body2" color="text.primary">
                    Звонок на номер
                  </Typography>
                  <Chip
                    size="small"
                    icon={<SelectedIcon sx={{ fontSize: 16, ml: 0.25 }} />}
                    label={selectedPhone}
                    sx={{ pl: 0.25 }}
                  />
                  {callPhase === "active" && (
                    <Typography variant="body2" color="primary">
                      {formatCallTimer(callTimerSeconds).replace(/^0:/, "")}
                    </Typography>
                  )}
                </Stack>
              )}
              {showResultBlock &&
                (resultFixed ||
                  selectedOutcome === "connected" ||
                  callPhase === "ended") && (
                  <Typography
                    variant="caption"
                    color={
                      resultFixed
                        ? resultSkipped
                          ? "error"
                          : "primary"
                        : selectedOutcome === "connected"
                          ? "text.primary"
                          : "text.secondary"
                    }
                    sx={{
                      mb: 0.5,
                      textAlign: "center",
                    }}
                  >
                    {resultFixed
                      ? resultSkipped
                        ? "Пропущено"
                        : "Зафиксировано"
                      : selectedOutcome === "connected"
                        ? "Контакт успешен. Будет зафиксирован автоматически при завершении."
                        : callPhase === "ended"
                          ? "Сначала зафиксируйте результат или пропустите фиксацию."
                          : ""}
                  </Typography>
                )}
              <Collapse in={showResultBlock} timeout={200} unmountOnExit>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                  }}
                >
                  <Stack spacing={1}>
                    <ToggleButtonGroup
                      disabled={isSendToProtocolLoading}
                      exclusive
                      value={selectedOutcome}
                      onChange={(_, value) =>
                        value && setSelectedOutcome(value)
                      }
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 0.75,
                        mb: "10px",
                      }}
                    >
                      <ToggleButton value="connected">
                        На связи, продолжаем
                      </ToggleButton>
                      <ToggleButton value="busy">Клиент занят</ToggleButton>
                      <ToggleButton value="callback">
                        Перезвонить позже
                      </ToggleButton>
                    </ToggleButtonGroup>

                    {selectedOutcome === "callback" && (
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 0.75 }}
                          >
                            Другое время вручную
                          </Typography>
                          <Stack direction="row" spacing={1.5}>
                            <DatePicker
                              format="DD.MM.YYYY"
                              value={callbackDateValue}
                              minDate={minCallbackDateTime.startOf("day")}
                              onChange={(value) => {
                                setCallbackDateText(
                                  value && value.isValid()
                                    ? formatCallbackDate(value)
                                    : "",
                                );
                                setCallbackPreset("manual");
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  label: "Дата",
                                  error: hasCallbackDateTimeError,
                                  inputRef: callbackDateRef,
                                },
                              }}
                            />
                            <TimePicker
                              ampm={false}
                              format="HH:mm"
                              value={callbackTimeValue}
                              minTime={minCallbackTime}
                              onChange={(value) => {
                                setCallbackTimeText(
                                  value && value.isValid()
                                    ? formatCallbackTime(value)
                                    : "",
                                );
                                setCallbackPreset("manual");
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  label: "Время",
                                  error: hasCallbackDateTimeError,
                                },
                              }}
                            />
                          </Stack>
                          <FormHelperText error={hasCallbackDateTimeError}>
                            {callbackDateTimeHelperText}
                          </FormHelperText>
                        </Box>
                        <Box sx={{ px: 1, pt: 0.25 }}>
                          <Slider
                            value={
                              selectedCallbackSliderIndex >= 0
                                ? selectedCallbackSliderIndex
                                : 0
                            }
                            min={0}
                            max={CALLBACK_DELAY_OPTIONS.length - 1}
                            step={null}
                            marks={CALLBACK_DELAY_OPTIONS.map((_, index) => ({
                              value: index,
                            }))}
                            valueLabelDisplay={
                              isCallbackSliderFocused ? "on" : "auto"
                            }
                            valueLabelFormat={(index) =>
                              formatCallbackDelayLabel(
                                CALLBACK_DELAY_OPTIONS[index].minutes,
                              )
                            }
                            onFocus={() => setIsCallbackSliderFocused(true)}
                            onBlur={() => setIsCallbackSliderFocused(false)}
                            onChange={(_, value) => {
                              const nextIndex = Array.isArray(value)
                                ? value[0]
                                : value;
                              const nextOption =
                                CALLBACK_DELAY_OPTIONS[nextIndex];
                              if (!nextOption) return;
                              setCallbackDelay(nextOption.minutes);
                            }}
                            sx={{
                              "& .MuiSlider-mark": {
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                              },
                              "& .MuiSlider-markLabel": {
                                display: "none",
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ width: "100%", px: 0, mt: "10px" }}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Сообщение для фиксации"
                            multiline
                            minRows={2}
                            maxRows={4}
                            value={messageDraft}
                            inputRef={callMessageRef}
                            onChange={(event) => {
                              setMessageDraft(event.target.value);
                            }}
                          />
                        </Box>
                      </Stack>
                    )}

                    {selectedOutcome === "busy" && (
                      <Box sx={{ width: "100%", px: 0, mt: "10px" }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Сообщение для фиксации"
                          multiline
                          minRows={2}
                          maxRows={4}
                          value={messageDraft}
                          inputRef={callMessageRef}
                          onChange={(event) => {
                            setMessageDraft(event.target.value);
                          }}
                        />
                      </Box>
                    )}

                    {selectedOutcome && selectedOutcome !== "connected" && (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                        flexWrap="nowrap"
                        sx={{ overflowX: "auto" }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            sendToProtocol(
                              incident!,
                              messageDraft,
                              PROTOCOL_TYPE_CODES.USER_MESSAGE,
                            )
                              .then(() => {
                                setResultFixed(true);
                                setResultSkipped(false);
                              })
                              .catch((error) => {
                                notifyError(
                                  extractErrorMessage(error?.data),
                                );
                                setSelectedOutcome(null);
                              });
                          }}
                          disabled={
                            !canFixOutcome ||
                            resultFixed ||
                            isSendToProtocolLoading
                          }
                        >
                          Протокол с ВК
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            sendToProtocol(
                              incident!,
                              messageDraft,
                              PROTOCOL_TYPE_CODES.ENGINEER_MESSAGE,
                            )
                              .then(() => {
                                setResultFixed(true);
                                setResultSkipped(false);
                              })
                              .catch((error) => {
                                notifyError(
                                  extractErrorMessage(error?.data),
                                );
                                setSelectedOutcome(null);
                              });
                          }}
                          disabled={
                            !canFixOutcome ||
                            resultFixed ||
                            isSendToProtocolLoading
                          }
                        >
                          Протокол инженеру
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setResultFixed(true);
                            setResultSkipped(true);
                          }}
                          disabled={resultFixed}
                        >
                          Не фиксировать
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              </Collapse>

              <ToggleButtonGroup
                disabled={callPhase === "active"}
                exclusive
                value={selectedPhone}
                onChange={(_, value) => setSelectedPhone(value)}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.25,
                }}
              >
                {phones.map((phone) => (
                  <ToggleButton
                    key={`${phone.type}-${phone.number}`}
                    value={phone.number}
                    sx={{ minWidth: 0, justifyContent: "flex-start" }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {(() => {
                          const IconComponent = getIconByPhoneType(
                            phone.type,
                          );
                          return <IconComponent sx={{ fontSize: 14 }} />;
                        })()}
                      </Box>
                      <Box>
                        <Typography variant="caption" noWrap>
                          {phone.number || "—"}
                        </Typography>
                      </Box>
                    </Stack>
                  </ToggleButton>
                ))}
                {callPhase === "idle" && (
                  <ToggleButton
                    value={isSelectedPhoneActive ? "" : selectedPhone}
                    sx={{ minWidth: 0, justifyContent: "flex-start" }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <DialpadIcon sx={{ fontSize: 14 }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" noWrap>
                          Свой номер
                        </Typography>
                      </Box>
                    </Stack>
                  </ToggleButton>
                )}
              </ToggleButtonGroup>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <TextField
                  size="small"
                  fullWidth
                  value={isSelectedPhoneActive ? "" : selectedPhone}
                  placeholder={
                    isSelectedPhoneActive ? "" : "Введи номер телефона"
                  }
                  onChange={handlePhoneChange(setSelectedPhone)}
                  InputProps={{
                    readOnly: isSelectedPhoneActive || callPhase === "active",
                    startAdornment: isSelectedPhoneActive ? (
                      <InputAdornment position="start">
                        <Chip
                          size="small"
                          icon={
                            <SelectedIcon sx={{ fontSize: 16, ml: 0.25 }} />
                          }
                          label={selectedPhone}
                          sx={{ pl: 0.25 }}
                        />
                      </InputAdornment>
                    ) : undefined,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (callPhase === "active") return;
                            setSelectedPhone("");
                          }}
                        >
                          <X size={14} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  size="small"
                  onClick={handleCallToggle}
                  startIcon={
                    callPhase === "active" ? (
                      <PhoneOff size={14} />
                    ) : (
                      <Phone size={14} />
                    )
                  }
                  endIcon={
                    isMakeCallLoading ? <CircularProgress size={16} /> : null
                  }
                  variant="contained"
                  color={callPhase === "active" ? "error" : "primary"}
                  disabled={isCallButtonDisabled}
                >
                  {callPhase === "active" ? "Завершить" : "Позвонить"}
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Divider />
        </>
      ) : null}
    </Paper>
  );
}

export default CallPanel;
