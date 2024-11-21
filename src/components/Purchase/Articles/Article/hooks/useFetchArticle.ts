import { useEffect, useState } from 'react';
import { getArticleById } from '../../../../../api/api.routes';
import { IArticle } from '../../../../../types/types';

export const useFetchArticle = (articleId?: string) => {
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [article, setArticle] = useState<IArticle | null>(null);

  useEffect(() => {
    if (!articleId) {
      setIsLoadingArticle(false);
      setArticle(null);
      return;
    }

    const fetchData = async () => {
      setIsLoadingArticle(true);
      try {
        const data = await getArticleById(articleId);
        setArticle({ ...data, unidadesPorCaja: data?.unidadesPorCaja?.toString() });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingArticle(false);
      }
    };
    fetchData();
  }, [articleId]);
  return { isLoadingArticle, article };
};
