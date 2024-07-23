import { useEffect, useState } from 'react';
import { IArticle } from '../types/types';
import { getAllArticles } from '../api/api.routes';

export const useGetArticles = () => {
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articles, setArticles] = useState<IArticle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingArticles(true);
      try {
        const res = await getAllArticles();
        setArticles(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingArticles(false);
      }
    };
    fetchData();
  }, []);
  return { isLoadingArticles, articles };
};
