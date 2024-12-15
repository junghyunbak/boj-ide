import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createEditorSlice } from './slices/editor';
import { createJudgeSlice } from './slices/judge';
import { createProblemSlice } from './slices/problem';
import { createLayoutSlice } from './slices/layout';
import { createAlertSlice } from './slices/alert';
import { createReleasesSlice } from './slices/releases';
import { createConfirmSlice } from './slices/confirm';

export type StoreState = ReturnType<typeof createEditorSlice> &
  ReturnType<typeof createJudgeSlice> &
  ReturnType<typeof createProblemSlice> &
  ReturnType<typeof createLayoutSlice> &
  ReturnType<typeof createAlertSlice> &
  ReturnType<typeof createReleasesSlice> &
  ReturnType<typeof createConfirmSlice>;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createEditorSlice(...a),
      ...createJudgeSlice(...a),
      ...createProblemSlice(...a),
      ...createLayoutSlice(...a),
      ...createAlertSlice(...a),
      ...createReleasesSlice(...a),
      ...createConfirmSlice(...a),
    }),
    {
      name: 'zustandStore',
      partialize: (s) => {
        const { lang, mode, leftRatio, topRatio, problemHistories, customTestCase, oldReleases, fontSize } = s;

        return { lang, mode, leftRatio, topRatio, problemHistories, customTestCase, oldReleases, fontSize };
      },
    },
  ),
);
