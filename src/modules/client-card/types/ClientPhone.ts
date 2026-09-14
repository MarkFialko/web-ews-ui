/**
 * Client phone contact DTO used by the Client Card module.
 */
export type ClientPhone = {
  label: string;
  value: string;
  type: "internal" | "city" | "mobile";
  isVerified?: boolean;
};
