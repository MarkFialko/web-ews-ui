export { default as RequestCard } from "./RequestCard";
export { default as RequestCardModule } from "./RequestCardModule";

export type {
  RequestCardProps,
  RequestCardTab,
} from "./RequestCard";
export type { RequestCardModuleProps } from "./RequestCardModule";

export type { ProtocolMessage } from "./types/ProtocolMessage";
export type { VipUserInfoCheckDto } from "./types/VipUserInfoCheckDto";
export type {
  UserInfoResponse,
  UserMainInfo,
  PhoneInfo,
  EmailInfo,
  UserLabelInfo,
  EmployeeArmsDto,
  EmployeeArmsInfo,
  UserAccessDto,
} from "./types";

export {
  useVipVerifyQuery,
  useGetEmployeeByNumberQuery,
  useEmployeePhotoQuery,
  useEmployeeArmsQuery,
  useAccessInfoQuery,
  useLastTicketsQuery,
} from "./api";

export { useOptimisticTaskCache } from "./hooks/useOptimisticTaskCache";
