import { create } from 'zustand';
import { IEventsCalendar, IPatient, IRegisterRoom } from '../../types/types';
import { IBiomedicalEquipment } from '../../types/hospitalizationTypes';
import { ISurgicalPackage } from '../../types/operatingRoom/surgicalPackageTypes';

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
  hospitalizationEvents: IEventsCalendar[];
  originalHospitalizationEvents: IEventsCalendar[];
  surgeryEvents: IEventsCalendar[];
  originalSurgeryEvents: IEventsCalendar[];
  startDateSurgery: Date;
  patient: IPatient;
  procedures: string[];
  packageSelected: ISurgicalPackage | null;
  cabinetStudiesSelected: { id: string; nombre: string }[];
  medicId: string;
  articlesSelected: {
    id: string;
    nombre: string;
    cantidad: number;
    precioVenta: number;
    cantidadDisponible?: number;
  }[];
  medicPersonalBiomedicalEquipment: IBiomedicalEquipment[];
}

interface Actions {
  setStep: (step: number) => void;
  setAppointmentStartDate: (appointmentStartDate: Date) => void;
  setAppointmentEndDate: (appointmentEndDate: Date) => void;
  setRoomsRegistered: (roomsRegistered: IRegisterRoom[]) => void;
  setHospitalizationEvents: (hospitalizationEvents: IEventsCalendar[]) => void;
  setOriginalHospitalizationEvents: (originalHospitalizationEvents: IEventsCalendar[]) => void;
  setSurgeryEvents: (surgeryEvents: IEventsCalendar[]) => void;
  setOriginalSurgeryEvents: (surgeryEvents: IEventsCalendar[]) => void;
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
  setMedicPersonalBiomedicalEquipment: (medicPersonalBiomedicalEquipment: IBiomedicalEquipment[]) => void;
  setCabinetStudiesSelected: (cabinetStudiesSelected: { id: string; nombre: string }[]) => void;
  setPackageSelected: (packageSelected: ISurgicalPackage | null) => void;
}

const initialValues = {
  step: 0,
  appointmentStartDate: new Date(),
  appointmentEndDate: new Date(),
  roomsRegistered: [],
  hospitalizationEvents: [],
  originalHospitalizationEvents: [],
  surgeryEvents: [],
  originalSurgeryEvents: [],
  startDateSurgery: new Date(),
  patient: initialPatientValues,
  procedures: [],
  medicId: '',
  articlesSelected: [],
  medicPersonalBiomedicalEquipment: [],
  cabinetStudiesSelected: [],
  packageSelected: null,
};

export const usePatientEntryRegisterStepsStore = create<State & Actions>((set) => ({
  ...initialValues,
  setPackageSelected: (packageSelected: ISurgicalPackage | null) => set({ packageSelected }),
  setCabinetStudiesSelected: (cabinetStudiesSelected: { id: string; nombre: string }[]) =>
    set({ cabinetStudiesSelected }),
  setMedicPersonalBiomedicalEquipment: (medicPersonalBiomedicalEquipment: IBiomedicalEquipment[]) =>
    set({ medicPersonalBiomedicalEquipment }),
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
  setHospitalizationEvents: (hospitalizationEvents: IEventsCalendar[]) => set({ hospitalizationEvents }),
  setOriginalHospitalizationEvents: (originalHospitalizationEvents: IEventsCalendar[]) =>
    set({ originalHospitalizationEvents }),
  setSurgeryEvents: (surgeryEvents: IEventsCalendar[]) => set({ surgeryEvents }),
  setOriginalSurgeryEvents: (originalSurgeryEvents: IEventsCalendar[]) => set({ originalSurgeryEvents }),
  clearStore: () => set({ ...initialValues }),
  setStartDateSurgery: (startDateSurgery: Date) => set({ startDateSurgery }),
}));
