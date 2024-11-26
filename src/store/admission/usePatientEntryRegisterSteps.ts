import { create } from 'zustand';
import { IClinicalData, IEventsCalendar, IPatient, IRegisterRoom } from '../../types/types';
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
  curp: '',
};

const initialClinicalDataValues: IClinicalData = {
  admissionDiagnosis: '',
  comments: '',
  reasonForAdmission: '',
  allergies: '',
  bloodType: '',
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
  warehouseSelected: string;
  articlesSelected: {
    id: string;
    nombre: string;
    cantidad: number;
    precioVenta: number;
    cantidadDisponible?: number;
  }[];
  medicPersonalBiomedicalEquipment: IBiomedicalEquipment[];
  clinicalData: IClinicalData;
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
  setWarehouseSelected: (warehouseSelected: string) => void;
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
  setClinicalData: (clinicalData: IClinicalData) => void;
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
  warehouseSelected: '',
  articlesSelected: [],
  medicPersonalBiomedicalEquipment: [],
  cabinetStudiesSelected: [],
  packageSelected: null,
  clinicalData: initialClinicalDataValues,
};

export const usePatientEntryRegisterStepsStore = create<State & Actions>((set) => ({
  ...initialValues,
  setClinicalData: (clinicalData: IClinicalData) => set({ clinicalData }),
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
  setWarehouseSelected: (warehouseSelected: string) => set({ warehouseSelected }),
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
