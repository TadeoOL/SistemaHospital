import { useEffect, useState } from 'react';
import { getArticleById } from '../../../../../api/api.routes';
import { IArticle } from '../../../../../types/types';

export const useFetchArticle = (articleId?: string) => {
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [article, setArticle] = useState<IArticle | null>(null);

  const fetchData = async () => {
    setIsLoadingArticle(true);

    if (!articleId) {
      setArticle(null);
      setIsLoadingArticle(false);
      return;
    }

    try {
      const data = await getArticleById(articleId);
      setArticle(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArticle(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [articleId]);

  return { isLoadingArticle, article };
};
