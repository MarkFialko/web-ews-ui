import { useState, useEffect, useMemo } from "react";

export const useLastIncidents = () => {
  const [lastIncidents, setLastIncidents] = useState<Record<string, string>>(
    () => {
      try {
        const raw = localStorage.getItem("last_incidents");
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    },
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "last_incidents") {
        try {
          setLastIncidents(e.newValue ? JSON.parse(e.newValue) : {});
        } catch {
          setLastIncidents({});
        }
      }
    };

    const intervalId = setInterval(() => {
      try {
        const raw = localStorage.getItem("last_incidents");
        setLastIncidents((prev) => {
          const next = raw ? JSON.parse(raw) : {};
          return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
        });
      } catch {
        // Ignore parse errors
      }
    }, 1000);

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(intervalId);
    };
  }, []);

  const lastIncidentIds = useMemo(
    () => new Set(Object.keys(lastIncidents)),
    [lastIncidents],
  );

  return { lastIncidentIds };
};
