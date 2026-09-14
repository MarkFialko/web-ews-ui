import { useLazyGetWorklogQuery } from "../api";
import type { WorklogRequestDto } from "../types";

type UseGetWorklogParams = Pick<
  WorklogRequestDto,
  "businessId" | "page" | "size"
>;

export const useGetWorklog = (params: UseGetWorklogParams) => {
  const { page = 0, size = 20 } = params;

  const [
    trigger,
    {
      data: worklog = {
        actions: [],
        pagination: {
          page,
          size,
          totalElements: 0,
          totalPages: 0,
        },
      },
      ...queryState
    },
  ] = useLazyGetWorklogQuery();

  return { worklog, trigger, ...queryState };
};
