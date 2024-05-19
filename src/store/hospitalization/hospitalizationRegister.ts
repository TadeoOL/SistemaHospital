import { create } from 'zustand';

// const initialRoomValues = {};
// const initialValues = {}

const initialValues = {
  step: 0,
};

interface State {
  step: number;
}

interface Action {
  setStep: (step: number) => void;
  clearAllData: () => void;
}

export const useHospitalizationRegisterStore = create<State & Action>((set) => ({
  ...initialValues,
  setStep: (step: number) => set(() => ({ step })),
  clearAllData: () => set(() => ({ step: 0 })),
}));
