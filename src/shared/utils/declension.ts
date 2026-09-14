/**
 * Склонение русских существительных по правилам:
 *   1 → nominative, 2-4 → genitive singular, 5-0 → genitive plural
 *   Исключение: 11-14 → всегда genitive plural
 *
 * Examples:
 *   declension(1, {минута: ['минута', 'минуты', 'минут']}) → "1 минута"
 *   declension(40, {минута: ['минута', 'минуты', 'минут']}) → "40 минут"
 *   declension(100, {день: ['день', 'дня', 'дней']}) → "100 дней"
 */
export function declension(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;

  if (abs > 10 && abs < 20) return `${n} ${forms[2]}`;
  if (lastDigit > 1 && lastDigit < 5) return `${n} ${forms[1]}`;
  if (lastDigit === 1) return `${n} ${forms[0]}`;
  return `${n} ${forms[2]}`;
}
