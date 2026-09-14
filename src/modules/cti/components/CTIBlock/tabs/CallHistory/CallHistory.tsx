import { useMemo } from "react";

import { CTIList, type CTIListProps } from "../CTIList";
import { useCallHistory } from "../../../../model";

type Props = Pick<CTIListProps, "onSelect">;

/** Форматирует дату/время как "03.07.2026 13:12" */
function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export const CallHistory = (props: Props) => {
  const [records] = useCallHistory();

  const rows = useMemo(
    () =>
      records.map((r) => [
        r.phoneNumber,
        formatTimestamp(r.timestamp),
        r.phoneNumber,
        r.callType,
      ]),
    [records],
  );

  return (
    <CTIList
      {...props}
      title="История последних вызовов"
      rows={rows}
      showDirection
    />
  );
};
