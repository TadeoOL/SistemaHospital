import { useEffect, useState } from 'react';
import { getArticlesBySearch } from '../api/api.routes';
import { useDirectlyPurchaseRequestOrderStore } from '../store/purchaseStore/directlyPurchaseRequestOrder';
import { useShallow } from 'zustand/react/shallow';

type Article = {
  id: string;
  nombre: string;
  precio: number;
};
export const useGetArticlesBySearch = ( warehouseIdProp?: string  ) => {
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesRes, setArticles] = useState<Article[]>([]);
  const warehouseSelected = useDirectlyPurchaseRequestOrderStore(useShallow((state) => state.warehouseSelected));
  const search = useDirectlyPurchaseRequestOrderStore((state) => state.search);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingArticles(true);
      try {
        let res;
        warehouseIdProp ? res = await getArticlesBySearch(search, warehouseIdProp) :
        res = await getArticlesBySearch(search, warehouseSelected);
        setArticles(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingArticles(false);
      }
    };
    fetchData();
  }, [search, warehouseSelected]);
  return { isLoadingArticles, articlesRes };
};
