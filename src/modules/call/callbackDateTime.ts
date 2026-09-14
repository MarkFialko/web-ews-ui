import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const CALLBACK_MIN_DELAY_MINUTES = 15;
export const CALLBACK_DATE_FORMAT = "DD.MM.YYYY";
export const CALLBACK_TIME_FORMAT = "HH:mm";
export const CALLBACK_DATETIME_FORMAT = "DD.MM.YYYY в HH:mm";

const ceilToMinute = (value: Dayjs) =>
  value.second() === 0 && value.millisecond() === 0
    ? value
    : value.add(1, "minute").startOf("minute");

export const getMinCallbackDateTime = (now = dayjs()) =>
  ceilToMinute(now).add(CALLBACK_MIN_DELAY_MINUTES, "minute");

export const getRelativeCallbackDateTime = (minutes: number, now = dayjs()) =>
  ceilToMinute(now).add(minutes, "minute");

export const parseStoredCallbackDateTime = (value: string) => {
  if (!value) return null;
  const parsed = dayjs(value, CALLBACK_DATETIME_FORMAT, true);
  return parsed.isValid() ? parsed : null;
};

export const parseCallbackDate = (value: string) => {
  if (!value) return null;
  const parsed = dayjs(value, CALLBACK_DATE_FORMAT, true);
  return parsed.isValid() ? parsed.startOf("day") : null;
};

export const parseCallbackTime = (value: string, referenceDate = dayjs()) => {
  if (!value) return null;
  const parsed = dayjs(value, CALLBACK_TIME_FORMAT, true);
  if (!parsed.isValid()) return null;

  return referenceDate
    .hour(parsed.hour())
    .minute(parsed.minute())
    .second(0)
    .millisecond(0);
};

export const combineCallbackDateAndTime = (
  dateValue: Dayjs | null,
  timeValue: Dayjs | null,
) => {
  if (!dateValue || !timeValue) return null;

  return dateValue
    .hour(timeValue.hour())
    .minute(timeValue.minute())
    .second(0)
    .millisecond(0);
};

export const isCallbackDateTimeValid = (
  value: Dayjs | null,
  minValue: Dayjs,
) => Boolean(value?.isValid() && !value.isBefore(minValue));

export const formatCallbackDate = (value: Dayjs) =>
  value.format(CALLBACK_DATE_FORMAT);

export const formatCallbackTime = (value: Dayjs) =>
  value.format(CALLBACK_TIME_FORMAT);

export const formatCallbackDateTime = (value: Dayjs) =>
  value.format(CALLBACK_DATETIME_FORMAT);
