import { create } from 'zustand';

const initialValues = {
  tabValue: 'programmingCalendar',
};

interface State {
  tabValue: string;
}

interface Action {
  setTabValue: (tabValue: string) => void;
}

export const useProgrammingRequestTabNavStore = create<State & Action>((set) => ({
  ...initialValues,
  setTabValue: (state: string) => set(() => ({ tabValue: state })),
}));
