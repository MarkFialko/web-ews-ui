import dayjs from "dayjs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface WorklogFormValues {
  startDate: string | null;
  endDate: string | null;
  authorPersonalNumber: string;
  action: string;
  page: number;
  size: number;
}

const DEFAULT_VALUES: WorklogFormValues = {
  startDate: null,
  endDate: null,
  authorPersonalNumber: "",
  action: "",
  page: 0,
  size: 50,
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 50, 100] as const;

export const useWorklogForm = () => {
  const form = useForm<WorklogFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
    shouldUnregister: false,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { dirtyFields },
  } = form;

  const [startDate, endDate] = watch(["startDate", "endDate"]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      if (start.isAfter(end)) {
        setValue("startDate", endDate, { keepDirty: true });
        setValue("endDate", startDate, { keepDirty: true });
      }
    }
  }, [startDate, endDate, setValue]);

  const handleReset = () => {
    reset({ ...DEFAULT_VALUES, size: getValues("size") });
  };

  const handlePageChange = (newPage: number) => {
    setValue("page", newPage, { keepDirty: true });
  };

  return {
    form,
    control,
    handleSubmit,
    watch,
    dirtyFields,
    setValue,
    getValues,
    reset,
    handleReset,
    handlePageChange,
  };
};
