import { useMemo } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function usePaint() {
  const [paintRef] = useStore(useShallow((s) => [s.paintRef]));
  const [canvasRef] = useStore(useShallow((s) => [s.canvasRef]));

  const [canvas] = useStore(useShallow((s) => [s.canvas]));
  const [canvasMode] = useStore(useShallow((s) => [s.canvasMode]));
  const [brushWidth] = useStore(useShallow((s) => [s.brushWidth]));
  const [brushColor] = useStore(useShallow((s) => [s.brushColor]));

  const BRUSH_WIDTHS = useMemo<BrushWidth[]>(() => [2, 4, 8], []);
  const BRUSH_COLORS = useMemo<BrushColor[]>(() => ['black', 'red', 'blue'], []);

  return {
    paintRef,
    canvasRef,
    canvas,

    canvasMode,
    brushWidth,
    brushColor,

    BRUSH_WIDTHS,
    BRUSH_COLORS,
  };
}
