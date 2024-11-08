import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { getDailyOperatingRooms } from '../../services/operatingRoom/dailyOperatingRoomService';
import { getTodayAndYesterdayDates } from '../../utils/functions/dataUtils';
import { IRoomInformationnew } from '../../types/operatingRoom/operatingRoomTypes';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: IRoomInformationnew[];
  loading: boolean;
  search: string;
  enabled: boolean;
  cancelToken: CancelTokenSource | null;
  operatingRoomId: string;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  fetchData: () => void;
  setEnabled: (enabled: boolean) => void;
  clearData: () => void;
  setOperatingRoomId: (operatingRoomId: string) => void;
}

const initialValues = {
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  loading: false,
  enabled: true,
  search: '',
  cancelToken: null as CancelTokenSource | null,
  operatingRoomId: '',
};

export const useDailyOperatingRoomsPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setOperatingRoomId: (operatingRoomId: string) => set({ operatingRoomId }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize, operatingRoomId } = get();
    const index = pageIndex + 1;
    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const dates = getTodayAndYesterdayDates();
      const res = await getDailyOperatingRooms(
        `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&search=${search
        }&habilitado=${enabled}&Id_Quirofano=${operatingRoomId}&fechaInicio=${dates.fechaInicio 
        }&fechaFin=${dates.fechaFin}`
      );

      const roomInformationArray: IRoomInformationnew[] = [
        {
          id_IngresoPaciente: "12345",
          estatus: 1,
          quirofano: "Sala 1",
          paciente: "Juan Pérez",
          cirugias: [
            { id_cirugia: "CIR001", nombre: "Apendicectomía" },
            { id_cirugia: "CIR002", nombre: "Herniorrafia" }
          ],
          enfermero: { id_Enfermero: "ENF001", nombre: "María López" },
          medico: "Dr. José Ramírez",
          id_medico: "MED001",
          id_Anestesiologo: "ANES001",
          anestesiologo: "Dr. Luis Rodríguez",
          tiempoEstimado: "02:00",
          horaInicioRecuperacion: "14:00",
          horaFinRecuperacion: "16:00",
          horaInicio: "14:00",
          horaFin: "16:00"
        },
        {
          id_IngresoPaciente: "67890",
          estatus: 2,
          quirofano: "Sala 2",
          paciente: "Ana Torres",
          cirugias: [
            { id_cirugia: "CIR003", nombre: "Colecistectomía" }
          ],
          enfermero: { id_Enfermero: "ENF002", nombre: "Carlos Ruiz" },
          medico: "Dr. Marta Hernández",
          id_medico: "MED002",
          //id_Anestesiologo: "ANES002",
          //anestesiologo: "Dr. Clara Medina",
          tiempoEstimado: "01:30",
          //horaInicioRecuperacion: "10:30",
          //horaFinRecuperacion: "12:00",
          horaInicio: "14:00",
          horaFin: "16:00"
        },
        {
          id_IngresoPaciente: "54321",
          estatus: 3,
          quirofano: "Sala 3",
          paciente: "Luis García",
          cirugias: [
            { id_cirugia: "CIR004", nombre: "Resección de Tumor" }
          ],
          enfermero: { id_Enfermero: "ENF003", nombre: "Rosa Pérez" },
          medico: "Dr. Alberto Flores",
          id_medico: "MED003",
          id_Anestesiologo: "ANES003",
          anestesiologo: "Dr. Juan Rivera",
          tiempoEstimado: "03:00",
          horaInicioRecuperacion: "08:00",
          horaFinRecuperacion: "11:00",
          horaInicio: "14:00",
          horaFin: "16:00"
        }
      ];

      set({
        data: roomInformationArray,
        //data: res.data,
        pageSize: res.pageSize,
        count: res.count,
        pageCount: res.pageCount,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('cancelado', error);
      } else {
        console.log(error);
      }
    } finally {
      if (!cancelToken.token.reason) {
        set({ loading: false });
      }
    }
  },
  clearData: () => {
    set({ ...initialValues });
  },
}));
