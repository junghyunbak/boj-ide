import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createEditorSlice } from './slices/editor';
import { createJudgeSlice } from './slices/judge';
import { createProblemSlice } from './slices/problem';

export type StoreState = ReturnType<typeof createEditorSlice> &
  ReturnType<typeof createJudgeSlice> &
  ReturnType<typeof createProblemSlice>;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createEditorSlice(...a),
      ...createJudgeSlice(...a),
      ...createProblemSlice(...a),
    }),
    {
      name: 'zustandStore',
      partialize: (s) => {
        const { ext, mode } = s;

        return { ext, mode };
      },
    },
  ),
);
