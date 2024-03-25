import { useEffect, useState } from 'react';
import { getArticlesBySearch } from '../api/api.routes';
import { useDirectlyPurchaseRequestOrderStore } from '../store/purchaseStore/directlyPurchaseRequestOrder';
import { useShallow } from 'zustand/react/shallow';

type Article = {
  id: string;
  nombre: string;
  precio: number;
};
export const useGetArticlesBySearch = () => {
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesRes, setArticles] = useState<Article[]>([]);
  const search = useDirectlyPurchaseRequestOrderStore(useShallow((state) => state.search));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingArticles(true);
      try {
        const res = await getArticlesBySearch(search);
        setArticles(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingArticles(false);
      }
    };
    fetchData();
  }, [search]);
  return { isLoadingArticles, articlesRes };
};
