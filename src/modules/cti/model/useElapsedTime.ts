import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import { useEffect, useState } from "react";

dayjs.extend(duration);

export function useElapsedSeconds(timestamp: number): number {
  const [diff, setDiff] = useState(dayjs().unix() - timestamp);

  let intervalId: number;

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      setDiff(dayjs().unix() - timestamp);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return diff;
}

/** мм:сс, либо чч:мм:сс, если пошёл первый час. */
export function formatDuration(totalSeconds: number): string {
  const d = dayjs.duration(totalSeconds, "seconds");
  return totalSeconds >= 3600 ? d.format("HH:mm:ss") : d.format("mm:ss");
}

/** Готовая строка таймера мм:сс (или чч:мм:сс) от timestamp — useElapsedSeconds + formatDuration
 * одним вызовом, для мест, которым не нужно само число секунд отдельно. */
export function useTimer(since: number = dayjs().unix()): string {
  const elapsed = useElapsedSeconds(since);
  return formatDuration(elapsed);
}
