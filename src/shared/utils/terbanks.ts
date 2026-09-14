export const TERBANKS_MAP = {
  "Дальневосточный банк": "ДВБ",
  "Байкальский банк": "ББ",
  "Сибирский банк": "СибБ",
  "Уральский банк": "УБ",
  "Поволжский банк": "ПВБ",
  "Центрально-черноземный банк": "ЦЧБ",
  "Юго-Западный банк": "ЮЗБ",
  "Московский банк": "МБ",
  "Среднерусский банк": "СРБ",
  "Северо-западный банк": "СЗБ",
} as const;

const NOT_EXIST_TERBANK_FULL_NAME = "Центральный аппарат";
const NOT_EXIST_TERBANK_SHORT_NAME = "ЦА";

/**
 * Получение короткого названия тербанка.
 * @param terbank Полное название тербанка.
 * @returns Короткое название тербанка с дефолтным банком.
 */
export const getTerrbankShortName = (terbank?: string | null) => {
  if (!terbank) return NOT_EXIST_TERBANK_SHORT_NAME;

  return TERBANKS_MAP[terbank] || NOT_EXIST_TERBANK_SHORT_NAME;
};

/**
 * Получение полного названия тербанка.
 * @param terrbank Полное название тербанка.
 * @returns Полное названия терабанка с дефолтным банком.
 */
export const getTerrbankFullName = (terrbank?: string | null) => {
  return terrbank || NOT_EXIST_TERBANK_FULL_NAME;
};
