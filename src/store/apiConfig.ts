import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiConfigStore {
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

export const useApiConfigStore = create<ApiConfigStore>()(
  persist(
    (set) => ({
      apiUrl: '',
      setApiUrl: (url) => set({ apiUrl: url }),
    }),
    {
      name: 'api-config-facturacion',
    }
  )
);
