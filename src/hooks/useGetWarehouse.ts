import { useEffect, useState } from 'react';
import { IWarehouse } from '../types/types';
import { getWarehouseById } from '../api/api.routes';

export const useGetWarehouse = (id: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IWarehouse>();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getWarehouseById(id);
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
