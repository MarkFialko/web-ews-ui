import { UserRole, type UserCommonDTO, type UserInfoDTO } from "../types";

const BO_USER = "ЦИТППБО";

/** Проверяет принадлежность пользователя к ЦИТППБО */
export const isBOUser = (user: UserInfoDTO & UserCommonDTO) => {
  return (
    user.unit.toLocaleUpperCase() === BO_USER &&
    [UserRole.EFS_SBERASSIST_OPERATOR].every((r) => user.roles.includes(r))
  );
};
