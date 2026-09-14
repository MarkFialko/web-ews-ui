export function maskPhone(raw: string): string {
  if (!raw || typeof raw !== "string") return "";

  const digits = raw.replace(/\D/g, "");

  if (digits.length === 0) return "";

  // +7 или 7 в начале → 8 (для 11 или 12 цифр)
  const normalized =
    digits.length >= 11 && digits.startsWith("7")
      ? "8" + digits.slice(1)
      : digits;

  // 11 цифр → формат 8-XXX-XXX-****
  if (normalized.length === 11) {
    return `${normalized[0]}-${normalized.slice(1, 4)}-${normalized.slice(4, 7)}-****`;
  }

  // Другие длины: скрываем последние 4 цифры
  if (normalized.length <= 4) return "*".repeat(normalized.length);

  const visible = normalized.slice(0, normalized.length - 4);
  return visible + "****";
}
