import { useEffect, useState } from 'react';
import { ISubCategory } from '../types/types';
import { getSubCategoryById } from '../api/api.routes';

export const useGetSubCategory = (id: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ISubCategory>();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getSubCategoryById(id);
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { isLoading, data };
};
