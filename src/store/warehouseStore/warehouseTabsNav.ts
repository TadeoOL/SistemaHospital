import { createWithEqualityFn } from 'zustand/traditional';
import { IWarehouseData } from '../../types/types';

const initialValuesWarehouseData = {
  nombre: '',
  descripcion: '',
  esSubAlmacen: false,
  id_AlmacenPrincipal: null,
  id_UsuarioEncargado: null,
  articuloExistentes: null,
  id: '',
  fechaCreacion: '',
  fechaModificacion: '',
  habilitado: true,
  subAlmacenes: [],
};

interface State {
  tabValue: number;
  warehouseData: IWarehouseData;
}

interface Action {
  setTabValue: (tabValue: number) => void;
  setWarehouseData: (warehouseData: IWarehouseData) => void;
  clearWarehouseData: () => void;
}

const initialState: State = {
  tabValue: 0,
  warehouseData: initialValuesWarehouseData,
};

export const useWarehouseTabsNavStore = createWithEqualityFn<State & Action>((set) => ({
  ...initialState,
  setTabValue: (tabValue: number) => set({ tabValue }),
  setWarehouseData: (warehouseData: IWarehouseData) => set({ warehouseData }),
  clearWarehouseData: () => {
    set(initialState);
  },
}));
