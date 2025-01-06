import { useCallback, useEffect, useRef, useState } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';
import 'fabric-history';

export function useFabricCanvas(problemNumber: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHandRef = useRef(false);

  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

  const [problemToFabricJSON, setProblemToFabricJSON] = useFabricStore(
    useShallow((s) => [s.problemToFabricJSON, s.setProblemToFabricJSON]),
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return () => {};
    }

    const newFabricCanvas = new fabric.Canvas(canvas);

    setFabricCanvas(newFabricCanvas);

    return () => {
      setProblemToFabricJSON((prev) => {
        const next = { ...prev };
        next[problemNumber] = newFabricCanvas.toJSON();
        return next;
      });

      newFabricCanvas.dispose();
    };
  }, [problemNumber, setProblemToFabricJSON]);

  useEffect(() => {
    if (!fabricCanvas) {
      return () => {};
    }

    let panning = false;

    const handleMouseDown = () => {
      panning = true;
    };

    const handleMouseMove = (event: fabric.IEvent<MouseEvent>) => {
      if (!panning || !isHandRef.current) {
        return;
      }

      const delta = new fabric.Point(event.e.movementX, event.e.movementY);
      fabricCanvas.relativePan(delta);
    };

    const handleMouseUp = () => {
      panning = false;
    };

    const handleWheelScroll = (opt: fabric.IEvent<WheelEvent>) => {
      const delta = opt.e.deltaY;
      let zoom = fabricCanvas.getZoom();

      zoom *= 0.999 ** delta;

      if (zoom > 20) {
        zoom = 20;
      }

      if (zoom < 0.01) {
        zoom = 0.01;
      }

      fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('mouse:wheel', handleWheelScroll);
  }, [fabricCanvas, problemNumber]);

  useEffect(() => {
    const fabricJSON = problemToFabricJSON[problemNumber];

    if (!fabricCanvas || !fabricJSON) {
      return;
    }

    try {
      fabricCanvas.loadFromJSON(fabricJSON, () => {});
    } catch (e) {
      // BUG: Cannot read properties of null (reading 'clearRect')
      // https://github.com/fabricjs/fabric.js/discussions/10036
      // dispose된 fabricCanvas를 사용할 때 해당 에러 발생. React 생명주기와 관련
    }
  }, [fabricCanvas, problemNumber, problemToFabricJSON]);

  const activeAllFabricSelection = useCallback(() => {
    if (fabricCanvas) {
      const selection = new fabric.ActiveSelection(fabricCanvas.getObjects(), { canvas: fabricCanvas });
      fabricCanvas.setActiveObject(selection);
      fabricCanvas.renderAll();
    }
  }, [fabricCanvas]);

  const unactiveAllFabricSelection = useCallback(() => {
    if (fabricCanvas) {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }
  }, [fabricCanvas]);

  const removeFabricActiveObject = useCallback(() => {
    if (fabricCanvas) {
      fabricCanvas.remove(...fabricCanvas.getActiveObjects());
      fabricCanvas.discardActiveObject();
    }
  }, [fabricCanvas]);

  const changeSelectMode = useCallback(() => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = 'default';
      isHandRef.current = false;
    }
  }, [fabricCanvas]);

  const changeHandMode = useCallback(() => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = false;
      fabricCanvas.defaultCursor = 'move';
      isHandRef.current = true;
    }
  }, [fabricCanvas]);

  const changePenMode = useCallback(
    ({ brushWidth = 2, brushColor = 'black' }: { brushWidth?: BrushWidth; brushColor?: BrushColor }) => {
      if (fabricCanvas) {
        fabricCanvas.freeDrawingBrush.width = brushWidth;
        fabricCanvas.freeDrawingBrush.color = brushColor;
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.selection = false;
        isHandRef.current = false;
      }
    },
    [fabricCanvas],
  );

  const updateFabricCanvasSize = useCallback(
    (width: number, height: number) => {
      if (fabricCanvas) {
        try {
          fabricCanvas.setDimensions({ width, height });
        } catch (e) {
          // BUG: Cannot set properties of undefined (setting 'width')
          // https://github.com/fabricjs/fabric.js/discussions/10036
          // dispose된 fabricCanvas를 사용할 때 해당 에러 발생. React 생명주기와 관련
        }
      }
    },
    [fabricCanvas],
  );

  const undo = useCallback(() => {
    if (fabricCanvas && 'undo' in fabricCanvas && fabricCanvas.undo instanceof Function) {
      fabricCanvas.undo();
    }
  }, [fabricCanvas]);

  const redo = useCallback(() => {
    if (fabricCanvas && 'redo' in fabricCanvas && fabricCanvas.redo instanceof Function) {
      fabricCanvas.redo();
    }
  }, [fabricCanvas]);

  return {
    fabricCanvas,
    canvasRef,
    activeAllFabricSelection,
    unactiveAllFabricSelection,
    removeFabricActiveObject,
    undo,
    redo,
    changeHandMode,
    changePenMode,
    changeSelectMode,
    updateFabricCanvasSize,
  };
}
