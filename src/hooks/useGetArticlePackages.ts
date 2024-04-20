import { useEffect, useState } from 'react';
import { IArticlesPackage } from '../types/types';
import { getAllArticles } from '../api/api.routes';

export const useGetArticlePackages = () => {
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [packages, setPackages] = useState<IArticlesPackage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingArticles(true);
      try {
        const res = await getAllArticles();
        setPackages(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingArticles(false);
      }
    };
    fetchData();
  }, []);
  return { isLoadingArticles, packages };
};
