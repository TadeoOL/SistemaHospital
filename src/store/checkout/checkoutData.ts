import { create } from 'zustand';

const initialValues = {
  id: '',
  dineroAlCorte: 0,
  dineroInicial: 0,
  diaHoraCorte: '',
  fechaCreacion: '',
  cerrada: false,
  pasoSuJornada: false,
  tieneCaja: false,
  conceptoSalidaSeleccionado: 'Todos',
  idCajaSearch: '',
};

interface State {
  id: string | null;
  dineroAlCorte: number | null;
  dineroInicial: number | null;
  diaHoraCorte: string | null;
  fechaCreacion: string | null;
  cerrada: boolean;
  pasoSuJornada: boolean;
  tieneCaja: boolean;
  conceptoSalidaSeleccionado: string;
  idCajaSearch: string;
}

interface Action {
  setIdCaja: (idCajaSearch: string) => void;
  setData: (data: State) => void;
  setConceptoSalidaSeleccionado: (conceptoSalidaSeleccionado: string) => void;
}

export const useCheckoutDataStore = create<State & Action>((set) => ({
  ...initialValues,
  setData: (data: State) =>
    set({
      cerrada: data.cerrada,
      diaHoraCorte: data.diaHoraCorte,
      dineroAlCorte: data.dineroAlCorte,
      dineroInicial: data.dineroInicial,
      fechaCreacion: data.fechaCreacion,
      id: data.id,
      pasoSuJornada: data.pasoSuJornada,
      tieneCaja: data.tieneCaja,
    }),
  setConceptoSalidaSeleccionado: (conceptoSalidaSeleccionado: string) => set({ conceptoSalidaSeleccionado }),
  setIdCaja: (idCajaSearch: string) => set({ idCajaSearch }),
}));
