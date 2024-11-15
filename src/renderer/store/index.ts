import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createEditorSlice } from './slices/editor';
import { createJudgeSlice } from './slices/judge';
import { createProblemSlice } from './slices/problem';
import { createLayoutSlice } from './slices/layout';
import { createAlertSlice } from './slices/alert';

export type StoreState = ReturnType<typeof createEditorSlice> &
  ReturnType<typeof createJudgeSlice> &
  ReturnType<typeof createProblemSlice> &
  ReturnType<typeof createLayoutSlice> &
  ReturnType<typeof createAlertSlice>;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createEditorSlice(...a),
      ...createJudgeSlice(...a),
      ...createProblemSlice(...a),
      ...createLayoutSlice(...a),
      ...createAlertSlice(...a),
    }),
    {
      name: 'zustandStore',
      partialize: (s) => {
        const { ext, mode, leftRatio, topRatio, problemHistories } = s;

        return { ext, mode, leftRatio, topRatio, problemHistories };
      },
    },
  ),
);
