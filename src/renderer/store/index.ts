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
import { createThemeSlice } from './slices/theme';
import { createVimSlice } from './slices/vim';
import { createDragSlice } from './slices/drag';
import { createLanguageSlice } from './slices/language';
import { createRandomSlice } from './slices/random';
import { createPaintSlice } from './slices/paint';
import { createToastSlice } from './slices/toast';

import { createFabricSlice } from './slices/fabric';

export type StoreState = ReturnType<typeof createEditorSlice> &
  ReturnType<typeof createJudgeSlice> &
  ReturnType<typeof createProblemSlice> &
  ReturnType<typeof createLayoutSlice> &
  ReturnType<typeof createModalSlice> &
  ReturnType<typeof createBojViewSlice> &
  ReturnType<typeof createTabSlice> &
  ReturnType<typeof createThemeSlice> &
  ReturnType<typeof createTourSlice> &
  ReturnType<typeof createHistorySlice> &
  ReturnType<typeof createDragSlice> &
  ReturnType<typeof createVimSlice> &
  ReturnType<typeof createLanguageSlice> &
  ReturnType<typeof createPaintSlice> &
  ReturnType<typeof createRandomSlice> &
  ReturnType<typeof createToastSlice>;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createToastSlice(...a),
      ...createRandomSlice(...a),
      ...createLanguageSlice(...a),
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
      ...createDragSlice(...a),
      ...createVimSlice(...a),
      ...createPaintSlice(...a),
    }),
    {
      name: 'zustandStore',
      partialize: (s) => {
        const {
          /**
           * problem
           */
          problem,

          /**
           * editor
           */
          lang,
          mode,
          fontSize,
          indentSpace,

          /**
           * layout
           */
          leftRatio,
          topRatio,
          paintLeftRatio,
          historyModalHeight,

          /**
           * tab
           */
          problemHistories,
          dailyProblem,
          activeDailyProblem,

          /**
           * testcase
           */
          testcaseInputProblemNumber,
          customTestCase,

          /**
           * paint
           */
          isPaintOpen,
          isPaintExpand,
          brushColor,
          brushWidth,
          canvasMode,

          /**
           * theme
           */
          theme,

          /**
           * tour
           */
          tourStep,

          /**
           * history
           */
          histories,

          /**
           * webview
           */
          startUrl,

          /**
           * random
           */
          baekjoonId,
          tierValues,
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
          startUrl,
          indentSpace,
          baekjoonId,
          tierValues,
          canvasMode,
          brushColor,
          brushWidth,
          isPaintExpand,
        };
      },
    },
  ),
);

/**
 * fabric canvas store
 */
type FabricStoreState = ReturnType<typeof createFabricSlice>;

export const useFabricStore = create<FabricStoreState>()(
  persist(
    (...a) => ({
      ...createFabricSlice(...a),
    }),
    {
      name: 'zustand-fabric-persist-store-indexed-db',
      storage: createJSONStorage(() => idbStorage),
    },
  ),
);
