import { type StateCreator } from 'zustand';

type SubmitState = Record<string, { problemNumber: string; gage: number; resultText: string; language: Language }>;

type SubmitSlice = {
  submitState: SubmitState;
  setSubmitState(fn: (prev: SubmitState) => SubmitState): void;

  submitListIsOpen: boolean;
  setSubmitListIsOpen: (isOpen: boolean) => void;
};

export const createSubmitSlice: StateCreator<SubmitSlice> = (set): SubmitSlice => ({
  submitListIsOpen: false,
  setSubmitListIsOpen(isOpen) {
    set(() => ({ submitListIsOpen: isOpen }));
  },
  submitState: {},
  setSubmitState(fn) {
    set((s) => ({ submitState: fn(s.submitState) }));
  },
});
