import { useCallback } from 'react';

import { useFabricStore } from '@/renderer/store';

import { fabric } from 'fabric';
import { useShallow } from 'zustand/shallow';

export function useFabricCanvasController() {
  const [setIsHand] = useFabricStore(useShallow((s) => [s.setIsHand]));

  const backupFabricCanvasData = useCallback((problemNumber: string, canvas: fabric.Canvas | null) => {
    if (!canvas) {
      return;
    }

    const savedFabricJSON = canvas.toJSON();

    useFabricStore.getState().setProblemToFabricJSON((prev) => {
      const next = { ...prev };
      next[problemNumber] = savedFabricJSON;
      return next;
    });
  }, []);

  const activeAllFabricSelection = useCallback(() => {
    const { canvas } = useFabricStore.getState();

    if (canvas) {
      const selection = new fabric.ActiveSelection(canvas.getObjects(), { canvas });
      canvas.setActiveObject(selection);
      canvas.renderAll();
    }
  }, []);

  const unactiveAllFabricSelection = useCallback(() => {
    const { canvas } = useFabricStore.getState();

    if (canvas) {
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, []);

  const removeFabricActiveObject = useCallback(() => {
    const { canvas } = useFabricStore.getState();

    if (canvas) {
      canvas.remove(...canvas.getActiveObjects());
      canvas.discardActiveObject();
    }
  }, []);

  const changeSelectMode = useCallback(() => {
    const { canvas } = useFabricStore.getState();

    if (canvas) {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      setIsHand(false);
    }
  }, [setIsHand]);

  const changeHandMode = useCallback(() => {
    const { canvas } = useFabricStore.getState();

    if (canvas) {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'move';
      setIsHand(true);
    }
  }, [setIsHand]);

  const changePenMode = useCallback(
    ({ brushWidth = 2, brushColor = 'black' }: { brushWidth?: BrushWidth; brushColor?: BrushColor }) => {
      const { canvas } = useFabricStore.getState();

      if (canvas) {
        canvas.freeDrawingBrush.width = brushWidth;
        canvas.freeDrawingBrush.color = brushColor;
        canvas.isDrawingMode = true;
        canvas.selection = false;
        setIsHand(false);
      }
    },
    [setIsHand],
  );

  const updateFabricCanvasSize = useCallback((width: number, height: number) => {
    const { canvas } = useFabricStore.getState();

    if (canvas) {
      try {
        canvas.setDimensions({ width, height });
      } catch (e) {
        // BUG: Cannot set properties of undefined (setting 'width')
        // https://github.com/fabricjs/fabric.js/discussions/10036
        // dispose된 canvas를 사용할 때 해당 에러 발생. React 생명주기와 관련
      }
    }
  }, []);

  const undo = useCallback(() => {
    const { canvas } = useFabricStore.getState();

    if (canvas && 'undo' in canvas && canvas.undo instanceof Function) {
      canvas.undo();
    }
  }, []);

  const redo = useCallback(() => {
    const { canvas } = useFabricStore.getState();

    if (canvas && 'redo' in canvas && canvas.redo instanceof Function) {
      canvas.redo();
    }
  }, []);

  return {
    activeAllFabricSelection,
    unactiveAllFabricSelection,
    removeFabricActiveObject,
    undo,
    redo,
    changeHandMode,
    changePenMode,
    changeSelectMode,
    updateFabricCanvasSize,
    backupFabricCanvasData,
  };
}
