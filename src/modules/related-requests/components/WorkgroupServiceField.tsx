import { Box, Stack, Typography, LinearProgress } from "@mui/material";
import {
  FormInputAutocomplete,
  type AutocompleteOption,
  type FormInputAutocompleteProps,
} from "@shared/ui/rhf/FormInputAutocomplete";
import { DataField, OpenInEsmButton } from "@shared/ui";
import { rules, useWorkgroups } from "../model";
import { useMemo } from "react";
import { STORE_NAMES } from "@shared/cache";
import { useWatch, type Path } from "react-hook-form";
import type {
  FormValues,
  WorkgroupServiceOption,
} from "../model/useRelatedRequests";

interface WorkgroupServiceFieldProps<
  TFieldValues extends FormValues,
> extends Omit<
  FormInputAutocompleteProps<
    TFieldValues["workgroupWithService"],
    TFieldValues
  >,
  "name" | "options"
> {
  isFetching: boolean;
  businessId: string;
}

export function WorkgroupServiceField<TFieldValues extends FormValues>(
  props: WorkgroupServiceFieldProps<TFieldValues>,
) {
  const {
    businessId,
    control,
    disabled,
    isFetching: isWorkgroupDataLoading,
    ...autocompleteProps
  } = props;

  const { data: list = [], isFetching } = useWorkgroups();

  const options = useMemo(() => {
    const map = new Map<string, AutocompleteOption<WorkgroupServiceOption>>();

    for (const item of list) {
      for (const workgroup of item.workgroupItems) {
        for (const setting of workgroup.workgroupSettings) {
          const label = `${item.title} / ${workgroup.title} / ${setting.service}`;
          map.set(label, {
            value: {
              groupTitle: item.title,
              workgroupLabel: workgroup.title,
              service: setting.service,
              setting: setting,
            },
            label: label,
          });
        }
      }
    }

    return Array.from(map.values());
  }, [list]);

  const workgroup = useWatch({ control, name: "workgroupWithService" }) ?? {};

  const showWorkgroup = Object.values(workgroup).some(Boolean);

  return (
    <Box>
      {isWorkgroupDataLoading && (
        <Stack spacing={1} sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary">
            Загружаем данные по рабочей группе и услуге
          </Typography>
        </Stack>
      )}

      <FormInputAutocomplete
        name={"workgroupWithService" as Path<TFieldValues>}
        control={control}
        label="Рабочая группа и услуга"
        options={options}
        disabled={disabled}
        persistScope={businessId}
        draftStoreName={STORE_NAMES.RELATED_REQUEST_DRAFTS}
        renderOption={(props, option) => {
          return (
            <Box component="li" {...props}>
              <Stack spacing={0.2}>
                <Typography variant="body2">{option.value.service}</Typography>
                <Typography variant="metaTiny" color="text.secondary">
                  {option.value.groupTitle} / {option.value.workgroupLabel}
                </Typography>
              </Stack>
            </Box>
          );
        }}
        rules={rules.workgroupWithService}
        loading={isFetching}
        {...autocompleteProps}
      />

      {/* Ссылка "Перейти в ESM" */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Если не удалось найти нужную рабочую группу, можно перейти в{" "}
          <OpenInEsmButton businessId="" title="ESM" />
        </Typography>
      </Box>

      {showWorkgroup && (
        <Box
          sx={{
            pt: 2,
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          <DataField label="Группа" value={workgroup?.groupTitle} />
          <DataField label="Рабочая группа" value={workgroup?.workgroupLabel} />
          <DataField label="Сервис" value={workgroup?.service} />
        </Box>
      )}
    </Box>
  );
}
