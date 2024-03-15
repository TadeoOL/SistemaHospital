import create from 'zustand';

interface State {
  urlCertificadoCR: string;
  urlCertificadoISO9001: string;
  urlCertificadoBP: string;
}

interface Actions {
  setUrlCertificadoCR: (urlCertificadoCR: string) => void;
  setUrlCertificadoISO9001: (urlCertificadoISO9001: string) => void;
  setUrlCertificadoBP: (urlCertificadoBP: string) => void;
}

export const useCertificateProviderStore = create<State & Actions>((set) => ({
  urlCertificadoCR: '',
  urlCertificadoBP: '',
  urlCertificadoISO9001: '',
  setUrlCertificadoCR: (urlCertificadoCR) => set({ urlCertificadoCR }),
  setUrlCertificadoISO9001: (urlCertificadoISO9001) => set({ urlCertificadoISO9001 }),
  setUrlCertificadoBP: (urlCertificadoBP) => set({ urlCertificadoBP }),
}));
