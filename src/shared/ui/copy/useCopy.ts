import { useAppNotifications } from "../../notifications";

export const useCopy = () => {
  const { notifyError, notifySuccess } = useAppNotifications();

  const copy = async (value: string, message?: string) => {
    try {
      await navigator.clipboard.writeText(value);
      if (message) notifySuccess(message);
    } catch {
      notifyError("Не удалось скопировать");
    }
  };

  return { copy };
};
