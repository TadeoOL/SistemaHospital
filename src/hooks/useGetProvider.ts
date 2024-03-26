import { useEffect, useState } from 'react';
import { IProvider } from '../types/types';
import { getProviderById } from '../api/api.routes';

export const useGetProvider = (id: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [providerData, setProviderData] = useState<IProvider>();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getProviderById(id);
        setProviderData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { isLoading, providerData };
};
