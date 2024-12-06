import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiConfigStore {
  apiUrl: string;
  hasInvoiceService: boolean;
  setApiUrl: (url: string) => void;
}

export const useApiConfigStore = create<ApiConfigStore>()(
  persist(
    (set, get) => ({
      apiUrl: '',
      hasInvoiceService: get()?.apiUrl !== '',
      setApiUrl: (url) =>
        set({
          apiUrl: url,
          hasInvoiceService: url !== '',
        }),
    }),
    {
      name: 'api-config-facturacion',
    }
  )
);
