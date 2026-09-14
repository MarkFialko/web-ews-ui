const SERVICE_CODE_PATTERN = /\((CI\d+)\)/;

export function extractServiceCode(str: string): string | null {
  const match = str.match(SERVICE_CODE_PATTERN);
  return match?.[1] ?? null;
}
