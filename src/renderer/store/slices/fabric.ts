import { type StateCreator } from 'zustand';

type ProblemToFabricJSON = Partial<Record<string, ReturnType<fabric.StaticCanvas['toJSON']>>>;

type FabricSlice = {
  problemToFabricJSON: ProblemToFabricJSON;
  setProblemToFabricJSON: (fn: (prev: ProblemToFabricJSON) => ProblemToFabricJSON) => void;

  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;

  mode: FabricCanvasMode;
  setMode: (mode: FabricCanvasMode | ((prev: FabricCanvasMode) => FabricCanvasMode)) => void;

  brushWidth: BrushWidth;
  setBrushWidth: (width: BrushWidth) => void;

  brushColor: BrushColor;
  setBrushColor: (color: BrushColor) => void;

  isHand: boolean;
  setIsHand: (isHand: boolean) => void;

  isCtrlKeyPressed: boolean;
  setIsCtrlKeyPressed: (isCtrlKeyPressed: boolean) => void;
};

export const createFabricSlice: StateCreator<FabricSlice> = (set, get): FabricSlice => ({
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
});
