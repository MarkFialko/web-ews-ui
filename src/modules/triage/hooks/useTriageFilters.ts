import { useState } from "react";

export const useTriageFilters = () => {
  const [search, setSearch] = useState("");

  const [serviceFilter, setServiceFilter] = useState("all");
  const [workgroupFilter, setWorkgroupFilter] = useState("all");

  return {
    search,
    setSearch,
    serviceFilter,
    setServiceFilter,
    workgroupFilter,
    setWorkgroupFilter,
  };
};
