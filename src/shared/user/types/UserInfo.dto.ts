export interface UserInfoDTO {
  sapId: string;
  smId: string;
  smName: string;
  fullName: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phoneNumberPrimary: string;
  phoneNumberSecond: string;
  emailPrimary: string;
  emailSecond: string;
  department: string;
  unit: string;
  subdivision: string;
  empCity: string;
  smPosition: string;
  empDirId: string;
  empDirFio: string;
  fosDirId: string;
  fosDirFio: string;
  /** UUID пользователя */
  empObjectId: string;
}
