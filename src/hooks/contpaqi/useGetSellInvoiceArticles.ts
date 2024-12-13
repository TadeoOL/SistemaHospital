import { useQuery } from '@tanstack/react-query';
import { getPharmacySellInvoiceInformation } from '@/services/invoice/invoicePatientBill';
import { PharmacySellInvoice } from '@/types/invoiceTypes';

export const useGetSellInvoiceArticles = (sell_Id: string) => {

  const { data, isError, isLoading } = useQuery({
    queryKey: ['accountFullInformation', sell_Id],
    queryFn: async () => {
      const rawData : PharmacySellInvoice = await getPharmacySellInvoiceInformation(sell_Id);
      return rawData;
    },
  });

  return {
    isLoading,
    data: data as PharmacySellInvoice,
    isError,
  };
};
