import { useCallback, useEffect, useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useTriageRequests } from "../model";
import { useTriageFilterState } from "../hooks/useTriageFilterState";
import { OpenInEsmButton } from "@shared/ui";
import { debounce } from "@shared/utils";

interface Props {
  filterOptions: ReturnType<typeof useTriageFilterState>;
  showEsmButton: boolean;
}

export const TriageFilters = (props: Props) => {
  const {
    filterOptions: {
      search,
      setSearch,
      serviceFilter,
      setServiceFilter,
      workgroupFilter,
      setWorkgroupFilter,
    },
    showEsmButton,
  } = props;

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const debouncedStoreUpdate = useMemo(
    () => debounce(setSearch, 300),
    [setSearch],
  );

  useEffect(() => {
    return () => debouncedStoreUpdate.cancel();
  }, [debouncedStoreUpdate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearch(value);
    debouncedStoreUpdate(value);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    debouncedStoreUpdate.cancel();
    setSearch("");
  };

  const { triageRequests } = useTriageRequests();

  const triageServices = useMemo(() => {
    return Array.from(new Set(triageRequests.map((r) => r.itService.id)));
  }, [triageRequests]);

  const triageWorkgroups = useMemo(() => {
    return Array.from(new Set(triageRequests.map((r) => r.workGroup.id)));
  }, [triageRequests]);

  const findServiceNameById = useCallback(
    (serviceId: string) => {
      return (
        triageRequests.find((r) => r.itService.id === serviceId)?.itService
          .name ?? serviceId
      );
    },
    [triageRequests],
  );

  const findWorkgroupNameById = useCallback(
    (workgroupId: string) => {
      return (
        triageRequests.find((r) => r.workGroup.id === workgroupId)?.workGroup
          .workGroupLabel ?? workgroupId
      );
    },
    [triageRequests],
  );

  return (
    <Stack direction={{ xs: "column", lg: "row" }} spacing={0.75}>
      <TextField
        label="Поиск"
        value={localSearch}
        onChange={handleChange}
        placeholder="ID, тема, описание, объект, клиент"
        fullWidth
        InputProps={{
          endAdornment: showEsmButton ? (
            <InputAdornment position="end">
              <OpenInEsmButton businessId={search} title="Найти в ESM" />
            </InputAdornment>
          ) : search ? (
            <InputAdornment position="end">
              <CloseIcon
                fontSize="small"
                sx={{ cursor: "pointer" }}
                onClick={handleClearSearch}
              />
            </InputAdornment>
          ) : null,
        }}
      />
      <FormControl sx={{ minWidth: { xs: "100%", lg: 220 } }}>
        <InputLabel id="triage-service-filter-label">Услуга</InputLabel>
        <Select
          labelId="triage-service-filter-label"
          value={serviceFilter}
          label="Услуга"
          onChange={(event) => setServiceFilter(event.target.value)}
        >
          <MenuItem value="all">Все услуги</MenuItem>
          {triageServices.map((serviceId) => (
            <MenuItem key={serviceId} value={serviceId}>
              {findServiceNameById(serviceId)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: { xs: "100%", lg: 180 } }}>
        <InputLabel id="triage-quick-filter-label">Рабочая группа</InputLabel>
        <Select
          labelId="triage-workgroup-filter-label"
          value={workgroupFilter}
          label="Рабочая группа"
          onChange={(event) => setWorkgroupFilter(event.target.value)}
        >
          <MenuItem value="all">Все рабочие группы</MenuItem>
          {triageWorkgroups.map((workgroupId) => (
            <MenuItem key={workgroupId} value={workgroupId}>
              {findWorkgroupNameById(workgroupId)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};
