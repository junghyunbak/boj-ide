import { useCallback } from 'react';

import { useStore, useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';

export function useModifyPaint() {
  const [setCanvas] = useStore(useShallow((s) => [s.setCanvas]));
  const [setCanvasMode] = useStore(useShallow((s) => [s.setCanvasMode]));
  const [setBrushWidth] = useStore(useShallow((s) => [s.setBrushWidth]));
  const [setBrushColor] = useStore(useShallow((s) => [s.setBrushColor]));

  const [setIsHand] = useStore(useShallow((s) => [s.setIsHand]));
  const [setIsCtrlKeyPressed] = useStore(useShallow((s) => [s.setIsCtrlKeyPressed]));

  const [setProblemToFabricJSON] = useFabricStore(useShallow((s) => [s.setProblemToFabricJSON]));

  const updateCanvas = useCallback(
    (canvas: fabric.Canvas | null) => {
      setCanvas(canvas);
    },
    [setCanvas],
  );

  const updatePaintLayout = useCallback((width: number, height: number) => {
    const { canvas } = useStore.getState();

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
      setCanvasMode(mode);
    },
    [setCanvasMode],
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

  const backupPaint = useCallback(
    (problem: Problem) => {
      const { canvas } = useStore.getState();

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
    const { canvas } = useStore.getState();

    if (canvas) {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      setIsHand(false);
    }
  }, [setIsHand]);

  const changeHandMode = useCallback(() => {
    const { canvas } = useStore.getState();

    if (canvas) {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'move';
      setIsHand(true);
    }
  }, [setIsHand]);

  const changePenMode = useCallback(
    (opt?: { brushWidth?: BrushWidth; brushColor?: BrushColor }) => {
      const { canvas } = useStore.getState();

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

  const undo = useCallback(() => {
    const { canvas } = useStore.getState();

    if (canvas && 'undo' in canvas && canvas.undo instanceof Function) {
      canvas.undo();
    }
  }, []);

  const redo = useCallback(() => {
    const { canvas } = useStore.getState();

    if (canvas && 'redo' in canvas && canvas.redo instanceof Function) {
      canvas.redo();
    }
  }, []);

  const addImageToCanvas = useCallback((canvas: fabric.Canvas, imageSrc: string, x: number, y: number) => {
    fabric.Image.fromURL(imageSrc, (img) => {
      img.scale(0.5);
      img.set({
        left: x,
        top: y,
        hasControls: true,
        hasBorders: true,
      });

      canvas.add(img);
      canvas.renderAll();
    });
  }, []);

  return {
    backupPaint,

    setCanvasMode,

    updateCanvas,
    updatePaintLayout,
    updatePaintMode,
    updateIsCtrlKeyPressed,
    updateBrushColor,
    updateBrushWidth,

    changeHandMode,
    changePenMode,
    changeSelectMode,

    undo,
    redo,

    addImageToCanvas,
  };
}
