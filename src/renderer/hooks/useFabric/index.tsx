import { useRef } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import 'fabric';
import 'fabric-history';

export function useFabric() {
  const [canvas] = useFabricStore(useShallow((s) => [s.canvas]));
  const [mode] = useFabricStore(useShallow((s) => [s.mode]));
  const [brushWidth] = useFabricStore(useShallow((s) => [s.brushWidth]));
  const [brushColor] = useFabricStore(useShallow((s) => [s.brushColor]));
  const [problemToFabricJSON] = useFabricStore(useShallow((s) => [s.problemToFabricJSON]));

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return {
    canvasRef,
    canvas,
    mode,
    brushWidth,
    brushColor,
    problemToFabricJSON,
  };
}
