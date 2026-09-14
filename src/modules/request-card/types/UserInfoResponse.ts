export type UserInfoResponse = {
  userNumber: string;
  isVIP: boolean;
  userMainInfo: UserMainInfo;
  userLabelsInfo?: UserLabelInfo[] | null;
};

export type UserMainInfo = {
  employeeNumber: string;
  userFullName: string;
  tb: string;
  vsp: string;
  department: string;
  structure: string;
  position: string;
  location: string;
  localTime: string;
  phones: PhoneInfo[];
  mails: EmailInfo[];
};

export type PhoneInfo = {
  number: string;
  type: "WORK" | "MOBILE" | "HOME";
  isMain: boolean;
  isVerified: boolean;
};

export type EmailInfo = {
  address: string;
  type: "WORK" | "PERSONAL";
  isMain: boolean;
};

export type UserLabelInfo = {
  employeeNumber: number;
  department: string;
  dateActive: string;
  text: string;
};
