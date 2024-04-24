import { useEffect, useState } from 'react';
import { ICategory } from '../types/types';
import { getCategoryById } from '../api/api.routes';

export const useGetCategory = (id: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ICategory>();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getCategoryById(id);
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
