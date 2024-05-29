import { create } from 'zustand';
import { IClinicalData, IEventsCalendar, IPatient, IRegisterRoom } from '../../types/types';

const initialPatientValues: IPatient = {
  name: '',
  lastName: '',
  secondLastName: '',
  age: '0',
  genere: '',
  civilStatus: '',
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

const initialClinicalData: IClinicalData = {
  medicName: '',
  specialty: '',
  reasonForAdmission: '',
  admissionDiagnosis: '',
  procedure: '',
  comments: '',
};

const initialRoomValue = {
  procedures: [],
  roomValues: [],
};

const initialValues = {
  step: 0,
  events: [],
  patient: initialPatientValues,
  clinicalData: initialClinicalData,
};

interface State {
  step: number;
  appointmentDate: Date;
  procedures: string[];
  events: IEventsCalendar[];
  patient: IPatient;
  clinicalData: IClinicalData;
}

interface Action {
  setStep: (step: number) => void;
  clearAllData: () => void;
  setEvents: (event: IEventsCalendar[]) => void;
  setPatient: (patient: IPatient) => void;
  setClinicalData: (clinicalData: IClinicalData) => void;
}
interface ActionRoom {
  setAppointmentDate: (appointmentDate: Date) => void;
  setRoomValues: (roomValues: IRegisterRoom[]) => void;
  setProcedures: (procedures: string[]) => void;
  clearRoomRegisteredData: () => void;
}

interface StateRoom {
  roomValues: IRegisterRoom[];
}

export const useProgrammingRegisterStore = create<State & Action & ActionRoom & StateRoom>((set) => ({
  appointmentDate: new Date(),
  ...initialValues,
  ...initialRoomValue,
  setStep: (step: number) => set(() => ({ step })),
  setAppointmentDate: (appointmentDate: Date) => set(() => ({ appointmentDate })),
  setRoomValues: (roomValues: IRegisterRoom[]) => set(() => ({ roomValues })),
  setProcedures: (procedures: string[]) => set(() => ({ procedures })),
  setEvents: (events: IEventsCalendar[]) => set(() => ({ events })),
  setPatient: (patient: IPatient) => set(() => ({ patient })),
  setClinicalData: (clinicalData: IClinicalData) => set(() => ({ clinicalData })),
  clearAllData: () => set(() => ({ ...initialValues, ...initialRoomValue })),
  clearRoomRegisteredData: () => set(() => ({ ...initialRoomValue })),
}));
