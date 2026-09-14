import { useUser } from "@shared/user";
import { CTIRouter } from "./CTIRouter";
import { RequestsRouter } from "./RequestsRouter";
import { isBOUser } from "@shared/user";

export const AppRouter = () => {
  const { user } = useUser();

  if (isBOUser(user)) return <CTIRouter />;

  return <RequestsRouter />;
};
