import { useEffect, useState } from 'react';
import { IPurchaseConfig } from '../../../../../types/types';
import { getPurchaseConfig } from '../../../../../api/api.routes';

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
