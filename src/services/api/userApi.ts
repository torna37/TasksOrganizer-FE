import { tsrReactQuery } from "./tsRestClient";

export const useGetMe = () => {
  const result = tsrReactQuery.users.me.useQuery({
    queryKey: ["me"],
  });
  return {
    ...result,
    data: result.data?.body,
  };
};
