import { UserRole } from "@shared/user/types/UserRole.enum";
import type {
  UserCommonDTO,
  UserDirectionDTO,
  UserInfoDTO,
} from "@shared/user/types";

export const userInfoMock: UserInfoDTO = {
  sapId: "10023458",
  smId: "SM-10023458",
  smName: "Соколов Артём Викторович",
  fullName: "Соколов Артём Викторович",
  lastName: "Соколов",
  firstName: "Артём",
  middleName: "Викторович",
  phoneNumberPrimary: "+79161234567",
  phoneNumberSecond: "+74957654321",
  emailPrimary: "a.v.sokolov@sberbank.ru",
  emailSecond: "artem.sokolov@example.com",
  department: "Департамент технической поддержки",
  unit: "Управление сопровождения ЕРИБ",
  subdivision: "Первая линия технической поддержки",
  empCity: "Москва",
  smPosition: "Инженер 1-й линии технической поддержки",
  empDirId: "10011111",
  empDirFio: "Кузнецова Ирина Сергеевна",
  fosDirId: "10022222",
  fosDirFio: "Морозов Дмитрий Андреевич",
  empObjectId: "8f14e45f-ceea-4a5b-8c1d-1f2e3a4b5c6d",
};

export const userCommonMock: UserCommonDTO = {
  login: "a.sokolov",
  fio: "Соколов Артём Викторович",
  employeeNumber: "10023458",
  roles: [
    UserRole.EFS_SBERASSIST_BASE,
    UserRole.EFS_SBERASSIST_ENGEENER,
    UserRole.EFS_SBERASSIST_OPERATOR,
  ],
};

export const userDirectionMock: UserDirectionDTO = {
  direction: "Техническая поддержка",
};
