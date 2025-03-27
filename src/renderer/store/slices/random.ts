import { type StateCreator } from 'zustand';

type RandomSlice = {
  baekjoonId: string;
  setBaekjoonId(baekjoonId: string): void;

  tierValues: number[];
  setTierValues(values: number[]): void;
};

export const createRandomSlice: StateCreator<RandomSlice> = (set, get): RandomSlice => ({
  baekjoonId: '',
  setBaekjoonId(baekjoonId) {
    set(() => ({ baekjoonId }));
  },

  tierValues: [4, 17],
  setTierValues(values) {
    set(() => ({ tierValues: values }));
  },
});
