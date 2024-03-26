import { createWithEqualityFn } from 'zustand/traditional';
import { IWarehouseData } from '../../types/types';

const initialValues = {
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
};

interface State {
  tabValue: number;
  warehouseData: IWarehouseData;
}

interface Action {
  setTabValue: (tabValue: number) => void;
  setWarehouseData: (warehouseData: IWarehouseData) => void;
}

export const useWarehouseTabsNavStore = createWithEqualityFn<State & Action>((set) => ({
  tabValue: 0,
  warehouseData: { ...initialValues },
  setTabValue: (tabValue: number) => set({ tabValue }),
  setWarehouseData: (warehouseData: IWarehouseData) => set({ warehouseData }),
}));
