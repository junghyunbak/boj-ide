import { type StateCreator } from 'zustand';

type ProblemToFabricJSON = Partial<Record<string, ReturnType<fabric.StaticCanvas['toJSON']>>>;

type PaintSlice = {
  paintRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;

  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;

  mode: FabricCanvasMode;
  setMode: (mode: FabricCanvasMode | ((prev: FabricCanvasMode) => FabricCanvasMode)) => void;

  brushWidth: BrushWidth;
  setBrushWidth: (width: BrushWidth) => void;

  brushColor: BrushColor;
  setBrushColor: (color: BrushColor) => void;

  problemToFabricJSON: ProblemToFabricJSON;
  setProblemToFabricJSON: (fn: (prev: ProblemToFabricJSON) => ProblemToFabricJSON) => void;

  isHand: boolean;
  setIsHand: (isHand: boolean) => void;

  isCtrlKeyPressed: boolean;
  setIsCtrlKeyPressed: (isCtrlKeyPressed: boolean) => void;

  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;
};

export const createPaintSlice: StateCreator<PaintSlice> = (set, get): PaintSlice => ({
  isExpand: false,
  setIsExpand: (isExpand: boolean) => {
    set(() => ({ isExpand }));
  },

  paintRef: { current: null },
  canvasRef: { current: null },

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
