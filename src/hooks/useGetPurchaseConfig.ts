import { getPurchaseConfig } from "../api/api.routes";
import { IPurchaseConfig } from "../types/types";
import { useQuery } from "@tanstack/react-query";

export const useGetPurchaseConfig = () => {
  const {
    data = [],
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allProviders"],
    queryFn: async () => getPurchaseConfig(),
  });

  return {
    isLoadingPurchaseConfig: isLoading,
    config: data as IPurchaseConfig,
    isError,
    refetch,
  };
};
