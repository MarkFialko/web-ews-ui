/** Поддерживаемые форматы изображений в чате. */
export const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
] as const;

/** Статус вложения по MIME-типу. */
export type ChatAttachmentStatus =
  | "image-supported"
  | "image-unsupported"
  | "none";
