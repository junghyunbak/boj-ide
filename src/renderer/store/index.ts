import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { fabric } from 'fabric';

import { idbStorage } from './storage/idb';

import { createEditorSlice } from './slices/editor';
import { createJudgeSlice } from './slices/judge';
import { createProblemSlice } from './slices/problem';
import { createLayoutSlice } from './slices/layout';
import { createModalSlice } from './slices/modal';
import { createBojViewSlice } from './slices/bojView';
import { createTabSlice } from './slices/tab';

export type StoreState = ReturnType<typeof createEditorSlice> &
  ReturnType<typeof createJudgeSlice> &
  ReturnType<typeof createProblemSlice> &
  ReturnType<typeof createLayoutSlice> &
  ReturnType<typeof createModalSlice> &
  ReturnType<typeof createBojViewSlice> &
  ReturnType<typeof createTabSlice>;

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
        };
      },
    },
  ),
);

/**
 * fabric canvas store
 */

type ProblemToFabricJSON = Partial<Record<string, ReturnType<fabric.StaticCanvas['toJSON']>>>;

interface FabricStoreState {
  problemToFabricJSON: ProblemToFabricJSON;
  setProblemToFabricJSON: (fn: (prev: ProblemToFabricJSON) => ProblemToFabricJSON) => void;

  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;

  mode: FabricCanvasMode;
  setMode: (mode: FabricCanvasMode | ((prev: FabricCanvasMode) => FabricCanvasMode)) => void;

  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;

  brushWidth: BrushWidth;
  setBrushWidth: (width: BrushWidth) => void;

  brushColor: BrushColor;
  setBrushColor: (color: BrushColor) => void;

  isHand: boolean;
  setIsHand: (isHand: boolean) => void;

  isCtrlKeyPressed: boolean;
  setIsCtrlKeyPressed: (isCtrlKeyPressed: boolean) => void;

  paintRef: React.RefObject<HTMLDivElement>;
  setPaintRef: (ref: React.RefObject<HTMLDivElement>) => void;
}

export const useFabricStore = create<FabricStoreState>()(
  persist(
    (set, get) => ({
      problemToFabricJSON: {},
      setProblemToFabricJSON(fn) {
        set((s) => ({ problemToFabricJSON: fn(s.problemToFabricJSON) }));
      },

      canvas: null,
      setCanvas: (canvas: fabric.Canvas) => {
        set((s) => ({ canvas }));
      },

      mode: 'pen',
      setMode: (mode) => {
        if (typeof mode === 'function') {
          set((s) => ({ mode: mode(s.mode) }));
        } else {
          set((s) => ({ mode }));
        }
      },

      isExpand: false,
      setIsExpand: (isExpand: boolean) => {
        set((s) => ({ isExpand }));
      },

      brushColor: 'black',
      setBrushColor: (color: BrushColor) => {
        set((s) => ({ brushColor: color }));
      },

      brushWidth: 4,
      setBrushWidth: (width: BrushWidth) => {
        set((s) => ({ brushWidth: width }));
      },

      isHand: false,
      setIsHand: (isHand: boolean) => {
        get().isHand = isHand;
      },

      isCtrlKeyPressed: false,
      setIsCtrlKeyPressed: (isCtrlKeyPressed: boolean) => {
        get().isCtrlKeyPressed = isCtrlKeyPressed;
      },

      paintRef: { current: null },
      setPaintRef: (ref: React.RefObject<HTMLDivElement>) => {
        set((s) => ({ paintRef: ref }));
      },
    }),
    {
      name: 'zustand-fabric-persist-store-indexed-db',
      storage: createJSONStorage(() => idbStorage),
      partialize(s) {
        const { problemToFabricJSON } = s;

        return {
          problemToFabricJSON,
        };
      },
    },
  ),
);
