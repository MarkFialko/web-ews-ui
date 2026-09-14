import {
  useGetUserCommonQuery,
  useGetUserDirectionQuery,
  useGetUserInfoQuery,
} from "../api";

export const useUser = () => {
  const userInfoQ = useGetUserInfoQuery();
  const userCommonQ = useGetUserCommonQuery();
  const userDirectionQ = useGetUserDirectionQuery(undefined, {
    selectFromResult: (state) => ({
      ...state,
      data: state.isError && !state.data ? { direction: "Общее" } : state.data,
    }),
  });

  return {
    user: {
      ...userInfoQ.data,
      ...userCommonQ.data,
      ...userDirectionQ.data,
    },
    isLoading:
      userInfoQ.isLoading || userCommonQ.isLoading || userDirectionQ.isLoading,
    error: userInfoQ.error ?? userCommonQ.error,
  };
};
