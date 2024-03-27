import { useEffect, useState } from 'react';
import { IProvider } from '../types/types';
import { getProviders } from '../api/api.routes';

export const useGetAllProvidersBySearch = (search: string = '') => {
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [providersFetched, setProvidersFetched] = useState<IProvider[] | []>([]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingProviders(true);
      try {
        const res = await getProviders(`Search=${search}&habilitado=true`);
        setProvidersFetched(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingProviders(false);
      }
    };
    fetch();
  }, [search]);
  return { isLoadingProviders, providersFetched };
};
