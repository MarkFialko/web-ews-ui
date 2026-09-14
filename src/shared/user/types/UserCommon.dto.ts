import type { UserRole } from "./UserRole.enum";

export interface UserCommonDTO {
  login: string;
  fio: string;
  employeeNumber: string;
  roles: UserRole[];
}
