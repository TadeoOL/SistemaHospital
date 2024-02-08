import { getAllArticleProviders } from "../api/api.routes";
import { useQuery } from "@tanstack/react-query";

export const useGetArticlesProviders = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["articleProviders"],
    queryFn: async () => getAllArticleProviders(),
  });

  return {
    data,
    isLoading,
    isError,
  };
};
