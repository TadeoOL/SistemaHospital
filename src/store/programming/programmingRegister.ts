import { create } from 'zustand';

const initialRoomValues = {
  appointmentDate: new Date(),
};
// const initialValues = {}

const initialValues = {
  step: 0,
};

interface State {
  step: number;
  appointmentDate: Date;
}

interface Action {
  setStep: (step: number) => void;
  clearAllData: () => void;
}
interface ActionRoom {
  setAppointmentDate: (appointmentDate: Date) => void;
}

export const useProgrammingRegisterStore = create<State & Action & ActionRoom>((set) => ({
  ...initialValues,
  ...initialRoomValues,
  setStep: (step: number) => set(() => ({ step })),
  setAppointmentDate: (appointmentDate: Date) => set(() => ({ appointmentDate })),
  clearAllData: () => set(() => ({ step: 0 })),
}));
