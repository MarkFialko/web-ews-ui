export interface MakeCallRequestDTO {
  phoneFrom: string;
  phoneTo: string;
  smId: string;
  clientId: string;
  requestNumber: string;
}

export interface EngeneerPhone {
  number: string;
  type: "WORK" | "MOBILE" | "HOME" | "City" | "Inner" | "Mobile";
  isMain: boolean;
  isVerified: boolean;
}
