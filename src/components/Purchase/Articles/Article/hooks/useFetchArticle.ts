import { useEffect, useState } from 'react';
import { getArticleById } from '../../../../../api/api.routes';
import { IArticle } from '../../../../../types/types';

export const useFetchArticle = (articleId?: string) => {
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [article, setArticle] = useState<IArticle | null>(null);

  const setDebug = (value: any) => {
    setIsLoadingArticle(value);
  };

  useEffect(() => {
    if (!articleId) {
      setArticle(null);
      setDebug(false);
      return;
    }

    const fetchData = async () => {
      setDebug(true);
      try {
        const data = await getArticleById(articleId);
        setArticle({ ...data, unidadesPorCaja: data?.unidadesPorCaja?.toString() });
      } catch (error) {
        console.log(error);
      } finally {
        setDebug(false);
      }
    };
    fetchData();
  }, [articleId]);
  return { isLoadingArticle, article };
};
