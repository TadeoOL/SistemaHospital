import { useEffect, useState } from 'react';
import { ICategory } from '../types/types';
import { getAllCategoriesByWarehouse } from '../api/api.routes';

export const useGetCategoriesWarehouse = (warehouseId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAllCategoriesByWarehouse(warehouseId);
        setCategories(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { isLoading, categories };
};