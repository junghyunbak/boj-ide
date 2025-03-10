import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { idbStorage } from './storage/idb';

import { createEditorSlice } from './slices/editor';
import { createJudgeSlice } from './slices/judge';
import { createProblemSlice } from './slices/problem';
import { createLayoutSlice } from './slices/layout';
import { createModalSlice } from './slices/modal';
import { createBojViewSlice } from './slices/bojView';
import { createTabSlice } from './slices/tab';
import { createTourSlice } from './slices/tour';
import { createHistorySlice } from './slices/history';

import { createFabricSlice } from './slices/fabric';
import { createPaintSlice } from './slices/paint';
import { createThemeSlice } from './slices/theme';

export type StoreState = ReturnType<typeof createEditorSlice> &
  ReturnType<typeof createJudgeSlice> &
  ReturnType<typeof createProblemSlice> &
  ReturnType<typeof createLayoutSlice> &
  ReturnType<typeof createModalSlice> &
  ReturnType<typeof createBojViewSlice> &
  ReturnType<typeof createTabSlice> &
  ReturnType<typeof createThemeSlice> &
  ReturnType<typeof createTourSlice> &
  ReturnType<typeof createHistorySlice>;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createBojViewSlice(...a),
      ...createEditorSlice(...a),
      ...createJudgeSlice(...a),
      ...createProblemSlice(...a),
      ...createLayoutSlice(...a),
      ...createModalSlice(...a),
      ...createTabSlice(...a),
      ...createThemeSlice(...a),
      ...createTourSlice(...a),
      ...createHistorySlice(...a),
    }),
    {
      name: 'zustandStore',
      partialize: (s) => {
        const {
          problem,
          lang,
          mode,
          leftRatio,
          topRatio,
          paintLeftRatio,
          problemHistories,
          customTestCase,
          fontSize,
          isPaintOpen,
          theme,
          tourStep,
          dailyProblem,
          activeDailyProblem,
          testcaseInputProblemNumber,
          histories,
          historyModalHeight,
        } = s;

        return {
          problem,
          lang,
          mode,
          leftRatio,
          topRatio,
          paintLeftRatio,
          problemHistories,
          customTestCase,
          fontSize,
          isPaintOpen,
          theme,
          tourStep,
          dailyProblem,
          activeDailyProblem,
          testcaseInputProblemNumber,
          histories,
          historyModalHeight,
        };
      },
    },
  ),
);

/**
 * fabric canvas store
 */
type FabricStoreState = ReturnType<typeof createFabricSlice> & ReturnType<typeof createPaintSlice>;

export const useFabricStore = create<FabricStoreState>()(
  persist(
    (...a) => ({
      ...createFabricSlice(...a),
      ...createPaintSlice(...a),
    }),
    {
      name: 'zustand-fabric-persist-store-indexed-db',
      storage: createJSONStorage(() => idbStorage),
      partialize(s) {
        const { problemToFabricJSON, brushColor, brushWidth, mode } = s;

        return {
          mode,
          brushColor,
          brushWidth,
          problemToFabricJSON,
        };
      },
    },
  ),
);
