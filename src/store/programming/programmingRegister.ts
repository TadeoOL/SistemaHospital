import { create } from 'zustand';
import { IClinicalData, IEventsCalendar, IPatient, IRegisterRoom } from '../../types/types';
const initialPatientValues: IPatient = {
  name: '',
  lastName: '',
  secondLastName: '',
  age: '0',
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

const initialClinicalData: IClinicalData = {
  medicName: '',
  specialty: '',
  reasonForAdmission: '',
  admissionDiagnosis: '',
  comments: '',
  allergies: '',
  bloodType: '',
};

const initialRoomValue = {
  procedures: [],
  roomValues: [],
};

const initialValues = {
  step: 0,
  patient: initialPatientValues,
  clinicalData: initialClinicalData,
};

interface State {
  step: number;
  appointmentStartDate: Date;
  appointmentEndDate: Date;
  procedures: string[];
  events: IEventsCalendar[];
  patient: IPatient;
  clinicalData: IClinicalData;
  fetchEvents: boolean;
}

interface Action {
  setStep: (step: number) => void;
  clearAllData: () => void;
  setEvents: (event: IEventsCalendar[]) => void;
  setPatient: (patient: IPatient) => void;
  setClinicalData: (clinicalData: IClinicalData) => void;
  setFetchEvents: (fetchEvents: boolean) => void;
  clearEvents: () => void;
}
interface ActionRoom {
  setAppointmentStartDate: (appointmentStartDate: Date) => void;
  setAppointmentEndDate: (appointmentEndDate: Date) => void;
  setRoomValues: (roomValues: IRegisterRoom[]) => void;
  clearRoomRegisteredData: () => void;
  setProcedures: (procedures: string[]) => void;
}

interface StateRoom {
  roomValues: IRegisterRoom[];
}

export const useProgrammingRegisterStore = create<State & Action & ActionRoom & StateRoom>((set, get) => ({
  appointmentStartDate: new Date(),
  appointmentEndDate: new Date(),
  fetchEvents: false,
  events: [],
  ...initialValues,
  ...initialRoomValue,
  setFetchEvents: (fetchEvents: boolean) => set(() => ({ fetchEvents })),
  setStep: (step: number) => set(() => ({ step })),
  setAppointmentStartDate: (appointmentStartDate: Date) => set(() => ({ appointmentStartDate })),
  setAppointmentEndDate: (appointmentEndDate: Date) => set(() => ({ appointmentEndDate })),
  setRoomValues: (roomValues: IRegisterRoom[]) => set(() => ({ roomValues })),
  setProcedures: (procedures: string[]) => set(() => ({ procedures })),
  setEvents: (events: IEventsCalendar[]) => set(() => ({ events })),
  setPatient: (patient: IPatient) => set(() => ({ patient })),
  setClinicalData: (clinicalData: IClinicalData) => set(() => ({ clinicalData })),
  clearAllData: () => set(() => ({ ...initialValues, ...initialRoomValue })),
  clearRoomRegisteredData: () => set(() => ({ ...initialRoomValue })),
  clearEvents: () => {
    const { events } = get();
    const eventsCleared = events.filter((event) => !event.source);

    set(() => ({ events: eventsCleared }));
  },
}));
