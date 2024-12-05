import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getInvoicingSettings } from '../services/invoicing.settings.service';
import { InvoiceSettings } from '../types/invoicing.settings.types';
import { useApiConfigStore } from '@/store/apiConfig';

export const useGetApiKey = () => {
  const setApiUrl = useApiConfigStore((state) => state.setApiUrl);

  const queryResult = useQuery<InvoiceSettings>({
    queryKey: ['invoicing-api-key'],
    queryFn: getInvoicingSettings,
  });

  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data?.apiUrl) {
      setApiUrl(queryResult.data.apiUrl);
    }
  }, [queryResult.isSuccess, queryResult.data, setApiUrl]);

  return queryResult;
};
