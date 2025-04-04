import { type StateCreator } from 'zustand';

type PaintSlice = {
  paintRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;

  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;

  canvasMode: FabricCanvasMode;
  setCanvasMode: (mode: FabricCanvasMode | ((prev: FabricCanvasMode) => FabricCanvasMode)) => void;

  brushWidth: BrushWidth;
  setBrushWidth: (width: BrushWidth) => void;

  brushColor: BrushColor;
  setBrushColor: (color: BrushColor) => void;

  isHand: boolean;
  setIsHand: (isHand: boolean) => void;

  isCtrlKeyPressed: boolean;
  setIsCtrlKeyPressed: (isCtrlKeyPressed: boolean) => void;
};

export const createPaintSlice: StateCreator<PaintSlice> = (set, get): PaintSlice => ({
  paintRef: { current: null },
  canvasRef: { current: null },

  canvas: null,
  setCanvas: (canvas: fabric.Canvas | null) => {
    set((s) => ({ canvas }));
  },

  canvasMode: 'pen',
  setCanvasMode: (mode) => {
    if (typeof mode === 'function') {
      set((s) => ({ canvasMode: mode(s.canvasMode) }));
    } else {
      set((s) => ({ canvasMode: mode }));
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
