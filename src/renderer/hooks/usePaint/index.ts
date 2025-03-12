import { useMemo } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function usePaint() {
  const [isExpand] = useFabricStore(useShallow((s) => [s.isExpand]));

  const [paintRef] = useFabricStore(useShallow((s) => [s.paintRef]));
  const [canvasRef] = useFabricStore(useShallow((s) => [s.canvasRef]));

  const [canvas] = useFabricStore(useShallow((s) => [s.canvas]));
  const [mode] = useFabricStore(useShallow((s) => [s.mode]));
  const [brushWidth] = useFabricStore(useShallow((s) => [s.brushWidth]));
  const [brushColor] = useFabricStore(useShallow((s) => [s.brushColor]));

  const [problemToFabricJSON] = useFabricStore(useShallow((s) => [s.problemToFabricJSON]));

  const BRUSH_WIDTHS = useMemo<BrushWidth[]>(() => [2, 4, 8], []);
  const BRUSH_COLORS = useMemo<BrushColor[]>(() => ['black', 'red', 'blue'], []);

  return {
    paintRef,
    canvasRef,
    canvas,

    isExpand,

    mode,
    brushWidth,
    brushColor,

    problemToFabricJSON,

    BRUSH_WIDTHS,
    BRUSH_COLORS,
  };
}
