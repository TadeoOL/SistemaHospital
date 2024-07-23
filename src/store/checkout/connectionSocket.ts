import { HubConnection } from '@microsoft/signalr';
import { create } from 'zustand';

interface State {
  conn: null | HubConnection;
}

interface Action {
  setConn: (conn: HubConnection) => void;
}

export const useConnectionSocket = create<State & Action>((set) => ({
  conn: null,
  setConn: (conn: HubConnection) => set({ conn }),
}));
