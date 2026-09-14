import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

import { useState, useCallback } from "react";

import {
  DialpadOutlined,
  MenuBookOutlined,
  HistoryOutlined,
} from "@mui/icons-material";
import { Stack, Paper } from "@mui/material";

import { PinnedToolButton } from "../../common";

import { AddressBook } from "./AddressBook";
import { CallHistory } from "./CallHistory";
import { DialpadPanel } from "./Dialpad";

import {
  useCallHistory,
  useCTI,
  useTelephonyService,
} from "@modules/cti/model";
import { OutboundInteractionOptions } from "@sber-scpl/core/jssdk";

type LineKey = "firstLine" | "secondLine" | "thirdLine";

/** Определяет целевую линию и её setter на основе текущего статуса звонка */
const getTargetLine = ({
  isCallActive,
  workitemStateID,
  firstLine,
  secondLine,
  thirdLine,
  setFirstLine,
  setSecondLine,
  setThirdLine,
}: {
  isCallActive: boolean;
  workitemStateID?: string;
  firstLine: string;
  secondLine: string;
  thirdLine: string;
  setFirstLine: (value: string) => void;
  setSecondLine: (value: string) => void;
  setThirdLine: (value: string) => void;
}): { key: LineKey; setter: (value: string) => void; value: string } => {
  if (!isCallActive) {
    return { key: "firstLine", setter: setFirstLine, value: firstLine };
  }
  if (workitemStateID === "Transfer") {
    return { key: "thirdLine", setter: setThirdLine, value: thirdLine };
  }
  return { key: "secondLine", setter: setSecondLine, value: secondLine };
};

export const CTITabsPanel = () => {
  const {
    isCallActive,
    workitemStateID,
    firstLine,
    setFirstLine,
    secondLine,
    setSecondLine,
    thirdLine,
    setThirdLine,
  } = useCTI();

  const [calls] = useCallHistory();

  const service = useTelephonyService();
  const agent = service.getAgent();
  const log = useWorklogLogger();

  const [activePanel, setActivePanel] = useState<
    "directory" | "history" | "dialpad" | null
  >(null);

  /** Текущая целевая линия */
  const targetLine = getTargetLine({
    isCallActive,
    workitemStateID,
    firstLine,
    secondLine,
    thirdLine,
    setFirstLine,
    setSecondLine,
    setThirdLine,
  });

  /** Записывает номер в целевую линию и инициирует исходящий звонок */
  const handlePlaceCall = useCallback(
    (phone: string) => {
      if (!phone.trim()) return;
      agent?.createOutInteraction({
        destination: phone,
        outboundTo: OutboundInteractionOptions.DESTINATION_NUMBER,
        channel: "call",
      });
      log({ action: WORKLOG_ACTIONS.CTI_CALL_START, task: "Information" });
    },
    [agent],
  );

  const handleDigit = useCallback(
    (digit: string) => {
      targetLine.setter(targetLine.value + digit);
    },
    [targetLine],
  );

  const handleBackspace = useCallback(() => {
    targetLine.setter(targetLine.value.slice(0, -1));
  }, [targetLine]);

  const handleCall = useCallback(() => {
    handlePlaceCall(targetLine.value);
  }, [handlePlaceCall, targetLine.value]);

  const handleRedial = useCallback(() => {
    if (calls.length > 0) targetLine.setter(calls[0].phoneNumber);
  }, [targetLine, calls]);

  return (
    <Stack sx={{ minHeight: 0 }} spacing={1.5} useFlexGap>
      <Stack direction="row" spacing={0.75} alignItems="center">
        <PinnedToolButton
          label="Цифровая клавиатура"
          icon={<DialpadOutlined />}
          active={activePanel === "dialpad"}
          onClick={() =>
            setActivePanel((current) =>
              current === "dialpad" ? null : "dialpad",
            )
          }
        />
        <PinnedToolButton
          label="Адресная книга"
          icon={<MenuBookOutlined />}
          active={activePanel === "directory"}
          onClick={() =>
            setActivePanel((current) =>
              current === "directory" ? null : "directory",
            )
          }
        />
        <PinnedToolButton
          label="История звонков"
          icon={<HistoryOutlined />}
          active={activePanel === "history"}
          onClick={() =>
            setActivePanel((current) =>
              current === "history" ? null : "history",
            )
          }
        />
      </Stack>

      {activePanel ? (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
          }}
        >
          {activePanel === "directory" && (
            <AddressBook onSelect={(phone) => targetLine.setter(phone)} />
          )}

          {activePanel === "history" && (
            <CallHistory onSelect={(phone) => targetLine.setter(phone)} />
          )}

          {activePanel === "dialpad" && (
            <DialpadPanel
              onDigit={handleDigit}
              onBackspace={handleBackspace}
              onRedial={handleRedial}
              onCall={handleCall}
              disabled={false}
              value={targetLine.value}
            />
          )}
        </Paper>
      ) : null}
    </Stack>
  );
};
