import { useEffect, useState } from 'react';
import { IProvider } from '../interfaces/providers.interface';
import { getProviderById } from '../services/providers';

export const useFetchProvider = (id?: string) => {
  const [isLoadingSubCategory, setIsLoadingSubCategory] = useState(true);
  const [subCategory, setSubCategory] = useState<IProvider | null>(null);

  const fetchData = async () => {
    setIsLoadingSubCategory(true);

    if (!id) {
      setSubCategory(null);
      setIsLoadingSubCategory(false);
      return;
    }

    try {
      const data = await getProviderById(id);
      setSubCategory(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingSubCategory(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { isLoadingSubCategory, subCategory };
};
