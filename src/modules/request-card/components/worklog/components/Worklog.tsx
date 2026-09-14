import { Paper, LinearProgress, Stack, Divider } from "@mui/material";

import { useWatch } from "react-hook-form";

import { useWorklogForm, useGetWorklog } from "../hooks";
import { WORKLOG_SOURCE, type WorklogResponseDto } from "../types";

import { WorklogHeader } from "./WorklogHeader";
import { EmptyWorklog } from "./EmptyWorklog";
import { WorklogRow } from "./WorklogRow";
import { WorklogFilters } from "./WorklogFilters";
import { WorklogPagination } from "./WorklogPagination";

import { useEffect, useRef } from "react";

interface Props {
  businessId: string;
}

export const Worklog = (props: Props) => {
  const { businessId } = props;

  const {
    control,
    watch,
    handleReset,
    handlePageChange,
    dirtyFields,
    setValue,
    getValues,
  } = useWorklogForm();

  const formValues = useWatch({ control });

  const { worklog, isLoading, isFetching, trigger } = useGetWorklog({
    businessId,
    page: formValues.page!,
    size: formValues.size!,
  });

  const triggerRef = useRef(trigger);

  const normalizePage = (dto: WorklogResponseDto) => {
    const page = getValues("page");
    if (
      dto.pagination.totalPages - 1 < page &&
      dto.pagination.totalPages !== 0
    ) {
      setValue(
        "page",
        Math.max(0, Math.min(dto.pagination.totalPages - 1, getValues("page"))),
      );
    }
  };

  useEffect(() => {
    trigger({ businessId, ...formValues, source: WORKLOG_SOURCE.WORKLOG })
      .unwrap()
      .then(normalizePage);
  }, [formValues, trigger, businessId, setValue, getValues]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      triggerRef
        .current({
          businessId,
          ...formValues,
          source: WORKLOG_SOURCE.WORKLOG,
        })
        .unwrap()
        .then(normalizePage);
    }, 30_000);

    return () => clearInterval(intervalId);
  }, [businessId, formValues]);

  const isEmpty = (worklog?.actions ?? []).length === 0;

  const isDirty = Object.keys(dirtyFields).some(
    (k) => !["page", "size"].includes(k),
  );

  return (
    <Paper variant="outlined" sx={{ p: 1.75 }}>
      <Stack spacing={1.5}>
        <WorklogHeader businessId={businessId} />

        <WorklogFilters
          control={control}
          hasActiveFilters={isDirty}
          onReset={handleReset}
        />

        <Stack
          divider={<Divider flexItem />}
          spacing={0}
          sx={{ height: 483, overflowY: "auto" }}
        >
          {(isLoading || isFetching) && <LinearProgress />}
          {isEmpty && (
            <Stack textAlign="center" pt={5}>
              <EmptyWorklog loading={isLoading} />
            </Stack>
          )}
          {worklog?.actions.map((entry) => (
            <WorklogRow key={entry.id} worklog={entry} />
          ))}
        </Stack>

        <WorklogPagination
          control={control}
          watch={watch}
          totalPages={worklog?.pagination.totalPages ?? 0}
          totalElements={worklog?.pagination.totalElements ?? 0}
          onPageChange={handlePageChange}
        />
      </Stack>
    </Paper>
  );
};
