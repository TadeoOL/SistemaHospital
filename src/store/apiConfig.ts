import { create } from 'zustand';

interface ApiConfigStore {
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

const localStorageMiddleware = (config: any) => (set: any, get: any, api: any) => {
  const initialState = config(
    (args: any) => {
      set(args);
      localStorage.setItem('api-config-facturacion', args.apiUrl);
    },
    get,
    api
  );

  const storedApiUrl = localStorage.getItem('api-config-facturacion');
  if (storedApiUrl) {
    set({ apiUrl: storedApiUrl });
  }

  return initialState;
};

export const useApiConfigStore = create<ApiConfigStore>()(
  localStorageMiddleware((set: any) => ({
    apiUrl: '',
    setApiUrl: (url: any) => set({ apiUrl: url }),
  }))
);
