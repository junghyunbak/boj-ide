import { useCallback } from 'react';

import { useFabricStore, useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';

export function useModifyPaint() {
  const [setCanvas] = useFabricStore(useShallow((s) => [s.setCanvas]));

  const [setMode] = useFabricStore(useShallow((s) => [s.setMode]));
  const [setBrushWidth] = useFabricStore(useShallow((s) => [s.setBrushWidth]));
  const [setBrushColor] = useFabricStore(useShallow((s) => [s.setBrushColor]));

  const [setIsExpand] = useFabricStore(useShallow((s) => [s.setIsExpand]));
  const [setIsHand] = useFabricStore(useShallow((s) => [s.setIsHand]));
  const [setIsCtrlKeyPressed] = useFabricStore(useShallow((s) => [s.setIsCtrlKeyPressed]));

  const [setProblemToFabricJSON] = useFabricStore(useShallow((s) => [s.setProblemToFabricJSON]));

  const updateCanvas = useCallback(
    (canvas: fabric.Canvas) => {
      setCanvas(canvas);
    },
    [setCanvas],
  );

  const updatePaintLayout = useCallback((width: number, height: number) => {
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

  const updatePaintMode = useCallback(
    (mode: FabricCanvasMode) => {
      setMode(mode);
    },
    [setMode],
  );

  const updateIsCtrlKeyPressed = useCallback(
    (isPressed: boolean) => {
      setIsCtrlKeyPressed(isPressed);
    },
    [setIsCtrlKeyPressed],
  );

  const updateBrushWidth = useCallback(
    (width: BrushWidth) => {
      setBrushWidth(width);
    },
    [setBrushWidth],
  );

  const updateBrushColor = useCallback(
    (color: BrushColor) => {
      setBrushColor(color);
    },
    [setBrushColor],
  );

  const updateIsExpand = useCallback(
    (isExpand: boolean) => {
      setIsExpand(isExpand);
    },
    [setIsExpand],
  );

  const backupPaint = useCallback(
    (problem: Problem = useStore.getState().problem) => {
      const { canvas } = useFabricStore.getState();

      if (!canvas) {
        return;
      }

      const problemNumber = problem?.number || '';

      setProblemToFabricJSON((prev) => {
        const next = { ...prev };

        next[problemNumber] = canvas.toJSON();

        return next;
      });
    },
    [setProblemToFabricJSON],
  );

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
    (opt?: { brushWidth?: BrushWidth; brushColor?: BrushColor }) => {
      const { canvas } = useFabricStore.getState();

      const brushWidth: BrushWidth = opt?.brushWidth || 4;
      const brushColor: BrushColor = opt?.brushColor || 'black';

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
    backupPaint,

    updateCanvas,
    updatePaintLayout,
    updatePaintMode,
    updateIsCtrlKeyPressed,
    updateBrushColor,
    updateBrushWidth,
    updateIsExpand,

    changeHandMode,
    changePenMode,
    changeSelectMode,

    activeAllFabricSelection,
    unactiveAllFabricSelection,
    removeFabricActiveObject,
    undo,
    redo,
  };
}
