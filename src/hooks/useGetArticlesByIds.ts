import { getArticlesByIds } from '../api/api.routes';
import { IArticle } from '../types/types';
import { useQuery } from '@tanstack/react-query';

export const useGetArticlesByIds = (Ids: string[]) => {
  const {
    data = [],
    isError,
    isLoading = true,
  } = useQuery({
    queryKey: ['ArticlesByIds', Ids],
    queryFn: async () => getArticlesByIds(Ids),
  });

  return {
    isLoadingArticles: isLoading,
    articles: data as IArticle[],
    isError,
  };
};
