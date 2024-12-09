import { useEffect, useState } from 'react';
import { getPurchaseWarehouseById } from '../services/warehouses';
import { IWarehouse } from '../interfaces/warehouses.interface';

export const useFetchWarehouse = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<IWarehouse | null>(null);

  const fetchData = async () => {
    setIsLoading(true);

    if (!id) {
      setItem(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await getPurchaseWarehouseById(id);
      setItem(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { isLoading, item };
};
