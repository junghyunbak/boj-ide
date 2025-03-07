import { type StateCreator } from 'zustand';

type TourSlice = {
  tourStep: number;
  setTourStep: (step: number) => void;
};

export const createTourSlice: StateCreator<TourSlice> = (set, get): TourSlice => ({
  tourStep: 1,
  setTourStep(step) {
    set(() => ({ tourStep: step }));
  },
});
