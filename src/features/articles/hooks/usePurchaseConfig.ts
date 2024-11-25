import { useEffect, useState } from 'react';
import { getPurchaseConfig } from '../../../api/api.routes';
import { IPurchaseConfig } from '../../../types/types';

export const useGetPurchaseConfig = () => {
  const [config, setConfig] = useState<IPurchaseConfig>();
  useEffect(() => {
    const fetch = async () => {
      try {
        const config = await getPurchaseConfig();
        setConfig(config);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);
  return config;
};
