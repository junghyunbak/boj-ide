import { type StateCreator } from 'zustand';

type AlertSlice = {
  message: string | null;
  setMessage: (message: string | null) => void;
};

export const createAlertSlice: StateCreator<AlertSlice> = (set): AlertSlice => ({
  message: null,
  setMessage: (message: string | null) => {
    set(() => ({ message }));
  },
});
