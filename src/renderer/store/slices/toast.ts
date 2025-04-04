import { CSSProperties } from 'react';
import { type StateCreator } from 'zustand';

type ToastContext = {
  message: string;
  bottom: CSSProperties['bottom'];
} | null;

type ToastSlice = {
  toastContext: ToastContext;
  setToastContext(toastContext: ToastContext): void;
};

export const createToastSlice: StateCreator<ToastSlice> = (set, get): ToastSlice => ({
  toastContext: null,
  setToastContext(toastContext) {
    set(() => ({ toastContext }));
  },
});
