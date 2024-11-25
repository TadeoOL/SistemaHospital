import { useEffect, useState } from 'react';
import { getCategoryById } from '@/api/api.routes';
import { ICategory } from '@/types/types';

export const useFetchCategory = (id?: string) => {
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [category, setCategory] = useState<ICategory | null>(null);

  const fetchData = async () => {
    setIsLoadingCategory(true);

    if (!id) {
      setCategory(null);
      setIsLoadingCategory(false);
      return;
    }

    try {
      const data = await getCategoryById(id);
      setCategory(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { isLoadingCategory, category };
};
