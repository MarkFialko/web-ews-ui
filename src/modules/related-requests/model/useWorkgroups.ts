import { useGetWorkgroupsQuery } from "@modules/ticket-actions";
import { useUser } from "@shared/user";

export const useWorkgroups = () => {
  const { user, isLoading } = useUser();

  return useGetWorkgroupsQuery(
    { unit: user.unit!, direction: user.direction! },
    { skip: isLoading || !user?.unit || !user?.direction },
  );
};
