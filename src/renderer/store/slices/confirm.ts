import { type StateCreator } from 'zustand';

type ConfirmSlice = {
  confirmMessage: string;
  callback: (() => void) | null;
  setConfirm: (message: string, callback: (() => void) | null) => void;
};

export const createConfirmSlice: StateCreator<ConfirmSlice> = (set): ConfirmSlice => ({
  confirmMessage: '',
  callback: null,
  setConfirm(message, callback) {
    set(() => ({
      confirmMessage: message,
      callback,
    }));
  },
});
