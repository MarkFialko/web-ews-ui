import type { ChatAttachmentStatus } from "../constants";
import { SUPPORTED_IMAGE_MIME_TYPES } from "../constants";

const IMAGE_PREFIX = "image/";

/** Определение статуса вложения по MIME-типу сообщения. */
export const classifyAttachmentStatus = (
  mimeType?: string,
): ChatAttachmentStatus => {
  if (!mimeType) return "none";
  if (!mimeType.startsWith(IMAGE_PREFIX)) return "none";
  return (SUPPORTED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType)
    ? "image-supported"
    : "image-unsupported";
};

/** Декодирование ArrayBuffer в бинарную строку (Latin-1): каждый байт 0-255 сохраняется 1:1, без искажения. */
export const arrayBufferToBinaryString = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let out = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    out += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return out;
};

/**
 * Извлечение бинарного файла из multipart-ответа ENDPOINT получения вложения.
 * Возвращает payload блока `name="<fieldName>"` как бинарную строку (Latin-1).
 */
export const extractBinaryFromMultiPart = (
  binaryBody: string,
  fieldName: string,
): string | null => {
  if (!binaryBody) return null;

  const marker = `name="${fieldName}"`;
  const headerStart = binaryBody.indexOf(marker);
  if (headerStart === -1) return null;

  // Граница блока — первая строка тела (--boundary).
  const boundary = binaryBody.split(/\r?\n/, 1)[0]?.trim();
  if (!boundary || !boundary.startsWith("--")) return null;

  // Начало payload — после пустой строки (\r\n\r\n), следующей за заголовками блока.
  const payloadStart = binaryBody.indexOf("\r\n\r\n", headerStart);
  if (payloadStart === -1) return null;
  const dataStart = payloadStart + 4;

  // Конец payload — перед разделителем следующего блока (\r\n--boundary).
  const endMarker = `\r\n${boundary}`;
  const payloadEnd = binaryBody.indexOf(endMarker, dataStart);
  const end = payloadEnd === -1 ? binaryBody.length : payloadEnd;

  const file = binaryBody.slice(dataStart, end);
  return file || null;
};

/** Сборка data URL из base64 и MIME-типа (MIME строго из поддерживаемого allow-list). */
export const buildDataUrl = (base64: string, mimeType: string): string => {
  if (!(SUPPORTED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType)) {
    throw new Error(`Недопустимый MIME-тип изображения: ${mimeType}`);
  }
  return `data:${mimeType};base64,${base64}`;
};

/** Сборка data URL из бинарной строки файла и MIME-типа (кодирует в base64 через btoa). */
export const buildDataUrlFromBinary = (
  binary: string,
  mimeType: string,
): string => buildDataUrl(btoa(binary), mimeType);
