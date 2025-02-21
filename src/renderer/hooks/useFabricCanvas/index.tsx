import { useEffect, useRef } from 'react';

import { fabric } from 'fabric';

import { useFabricStore, useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useFabricCanvasController } from '../useFabricCanvasController';
import { useFabricCanvasEvent } from '../useFabricCanvasEvent';
import { useFabricCanvasInit } from '../useFabricCanvasInit';

import 'fabric-history';

export function useFabricCanvas() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setCanvas] = useFabricStore(useShallow((s) => [s.setCanvas]));

  const { backupFabricCanvasData } = useFabricCanvasController();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useFabricCanvasInit();
  useFabricCanvasEvent();

  /**
   * fabric canvas 초기화
   */
  useEffect(() => {
    if (!canvasRef.current) {
      return function cleanup() {};
    }

    const newCanvas = new fabric.Canvas(canvasRef.current);
    setCanvas(newCanvas);

    return function cleanup() {
      backupFabricCanvasData(problem?.number || '', newCanvas);
      newCanvas.dispose();
    };
  }, [problem, backupFabricCanvasData, setCanvas]);

  return {
    canvasRef,
  };
}
