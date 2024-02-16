import { getAllProviders } from "../api/api.routes";
import { IProvider } from "../types/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllProviders = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["allProviders"],
    queryFn: async () => getAllProviders(),
  });

  return {
    isLoadingProviders: isLoading,
    providers: data as IProvider[],
    isError,
  };
};
