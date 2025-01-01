import { type StateCreator } from 'zustand';

type ModalSlice = {
  confirmMessage: string | null;
  setConfirmMessage: (message: string | null) => void;

  confirmCallback: (() => void) | null;
  setConfirmCallback: (cb: (() => void) | null) => void;

  alertTitle: string | null;
  setAlertTitle: (title: string | null) => void;

  alertContent: string | null;
  setAlertContent: (content: string | null) => void;
};

export const createModalSlice: StateCreator<ModalSlice> = (set): ModalSlice => ({
  confirmMessage: null,
  setConfirmMessage(message) {
    set(() => ({ confirmMessage: message }));
  },

  confirmCallback: null,
  setConfirmCallback(cb) {
    set(() => ({ confirmCallback: cb }));
  },

  alertTitle: null,
  setAlertTitle(title) {
    set(() => ({
      alertTitle: title,
    }));
  },

  alertContent: null,
  setAlertContent(content) {
    set(() => ({ alertContent: content }));
  },
});
