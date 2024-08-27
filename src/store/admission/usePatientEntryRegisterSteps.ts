import { create } from 'zustand';
import { IEventsCalendar, IPatient, IRegisterRoom } from '../../types/types';

const initialPatientValues: IPatient = {
  name: '',
  lastName: '',
  secondLastName: '',
  genere: '',
  civilStatus: '',
  birthDate: new Date(),
  phoneNumber: '',
  occupation: '',
  zipCode: '0',
  neighborhood: '',
  address: '',
  personInCharge: '',
  relationship: '',
  personInChargeZipCode: '0',
  personInChargeNeighborhood: '',
  personInChargeAddress: '',
  personInChargePhoneNumber: '',
};

interface State {
  step: number;
  appointmentStartDate: Date;
  appointmentEndDate: Date;
  roomsRegistered: IRegisterRoom[];
  events: IEventsCalendar[];
  startDateSurgery: Date;
  patient: IPatient;
  procedures: string[];
  medicId: string;
  articlesSelected: {
    id: string;
    nombre: string;
    cantidad: number;
    precioVenta: number;
    cantidadDisponible?: number;
  }[];
}

interface Actions {
  setStep: (step: number) => void;
  setAppointmentStartDate: (appointmentStartDate: Date) => void;
  setAppointmentEndDate: (appointmentEndDate: Date) => void;
  setRoomsRegistered: (roomsRegistered: IRegisterRoom[]) => void;
  setEvents: (events: IEventsCalendar[]) => void;
  clearStore: () => void;
  setStartDateSurgery: (startDateSurgery: Date) => void;
  setPatient: (patient: IPatient) => void;
  setProcedures: (procedures: string[]) => void;
  setMedicId: (medicId: string) => void;
  setArticlesSelected: (
    articlesSelected: {
      id: string;
      nombre: string;
      cantidad: number;
      precioVenta: number;
      cantidadDisponible?: number;
    }[]
  ) => void;
}

const initialValues = {
  step: 0,
  appointmentStartDate: new Date(),
  appointmentEndDate: new Date(),
  roomsRegistered: [],
  events: [],
  startDateSurgery: new Date(),
  patient: initialPatientValues,
  procedures: [],
  medicId: '',
  articlesSelected: [],
};

export const usePatientEntryRegisterStepsStore = create<State & Actions>((set) => ({
  ...initialValues,
  setArticlesSelected: (
    articlesSelected: {
      id: string;
      nombre: string;
      cantidad: number;
      precioVenta: number;
      cantidadDisponible?: number;
    }[]
  ) => set({ articlesSelected }),
  setMedicId: (medicId: string) => set({ medicId }),
  setProcedures: (procedures: string[]) => set({ procedures }),
  setPatient: (patient: IPatient) => set({ patient }),
  setStep: (step: number) => set({ step }),
  setAppointmentStartDate: (appointmentStartDate: Date) => set({ appointmentStartDate }),
  setAppointmentEndDate: (appointmentEndDate: Date) => set({ appointmentEndDate }),
  setRoomsRegistered: (roomsRegistered: IRegisterRoom[]) => set({ roomsRegistered }),
  setEvents: (events: IEventsCalendar[]) => set({ events }),
  clearStore: () => set({ ...initialValues }),
  setStartDateSurgery: (startDateSurgery: Date) => set({ startDateSurgery }),
}));
