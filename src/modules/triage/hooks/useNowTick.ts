import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

export function useNowTick(): dayjs.Dayjs {
  const computeTick = useCallback(() => dayjs().startOf("minute"), []);

  const [value, setValue] = useState<dayjs.Dayjs>(computeTick);

  useEffect(() => {
    const id = setInterval(() => setValue(computeTick), 60_000);
    return () => clearInterval(id);
  }, [computeTick]);

  return value;
}
