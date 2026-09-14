import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import type { StoreName } from "@shared/cache";

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  /** Включает персист черновика поля в IndexedDB */
  persistScope?: string;
  /** Хранилище для черновиков. Обязателен при persistScope. */
  draftStoreName?: StoreName;
  /** Сохраняет значение, при указанном draftStoreName в IndexedDB. */
  saveOnInput?: boolean;
  /** Отключает поле (при отправке формы) */
  disabled?: boolean;
  /** Колбэк после записи черновика */
  onDraftSaved?: () => void;
  /** Задержка debounce для записи в форму. Если 0 или не указано -- запись мгновенная */
  debounceMs?: number;
}
