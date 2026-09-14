import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/** Решение о судьбе отправленной пачки */
export type WorklogSendOutcome = "delivered" | "retry" | "drop";

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error;

/**
 * status бывает не только числом, но и строкой:
 * FETCH_ERROR, TIMEOUT_ERROR, PARSING_ERROR, CUSTOM_ERROR.
 */
export const classifyWorklogError = (error: unknown): WorklogSendOutcome => {
  if (!isFetchBaseQueryError(error)) {
    return "retry";
  }

  const { status } = error;

  if (typeof status === "number") {
    if (status === 401) {
      return "retry";
    }

    if (status >= 500) {
      return "retry";
    }

    if (status >= 400) {
      return "drop";
    }

    return "retry";
  }

  // FETCH_ERROR, TIMEOUT_ERROR, PARSING_ERROR, CUSTOM_ERROR
  return "retry";
};
