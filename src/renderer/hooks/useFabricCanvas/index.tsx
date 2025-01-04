import { useEffect, useRef, useState } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';
import 'fabric-history';

export function useFabricCanvas(problemNumber: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHandRef = useRef(false);

  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

  const [setProblemToFabricJSON] = useStore(useShallow((s) => [s.setProblemToFabricJSON]));

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return () => {};
    }

    const newFabricCanvas = new fabric.Canvas(canvas);

    setFabricCanvas(newFabricCanvas);

    return () => {
      newFabricCanvas.dispose();
    };
  }, [problemNumber]);

  useEffect(() => {
    if (!fabricCanvas) {
      return;
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

    const handleAfterRender = () => {
      setProblemToFabricJSON((prev) => {
        const next = { ...prev };

        next[problemNumber] = fabricCanvas.toJSON();

        return next;
      });
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('mouse:wheel', handleWheelScroll);
    fabricCanvas.on('after:render', handleAfterRender);
  }, [fabricCanvas, problemNumber, setProblemToFabricJSON]);

  useEffect(() => {
    const fabricJSON = useStore.getState().problemToFabricJSON[problemNumber];

    if (!fabricCanvas || !fabricJSON) {
      return;
    }

    /**
     * // BUG: Cannot read properties of null (reading 'clearRect')
     *
     * https://github.com/fabricjs/fabric.js/discussions/10036
     *
     * problemNumber가 변경되면 기존 fabricCanvas가 dispose된다.
     * 하지만 dispose된다고 하더라도 fabricCanvas 객체는 살아있게된다.
     * 유효한 fabricCanvas의 상태가 업데이트 되기전에 해당 훅이 먼저 실행되면
     * 이미 dispose된 객체의 loadFromJSON 메서드를 호출하게 되어 에러가 발생한다.
     *
     * try-catch 문으로 무시해주는 방법으로 일단 해결한다.
     */
    try {
      fabricCanvas.loadFromJSON(fabricJSON, () => {});
    } catch (e) {
      // do-nothing
    }
  }, [fabricCanvas, problemNumber]);

  const activeAllFabricSelection = () => {
    if (fabricCanvas) {
      const selection = new fabric.ActiveSelection(fabricCanvas.getObjects(), { canvas: fabricCanvas });
      fabricCanvas.setActiveObject(selection);
      fabricCanvas.renderAll();
    }
  };

  const removeFabricActiveObject = () => {
    if (fabricCanvas) {
      fabricCanvas.remove(...fabricCanvas.getActiveObjects());
      fabricCanvas.discardActiveObject();
    }
  };

  const changeSelectMode = () => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = 'default';
      isHandRef.current = false;
    }
  };

  const changeHandMode = () => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = false;
      fabricCanvas.defaultCursor = 'move';
      isHandRef.current = true;
    }
  };

  const changePenMode = () => {
    if (fabricCanvas) {
      fabricCanvas.freeDrawingBrush.width = 1;
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.selection = false;
      isHandRef.current = false;
    }
  };

  const undo = () => {
    if (fabricCanvas && 'undo' in fabricCanvas && fabricCanvas.undo instanceof Function) {
      fabricCanvas.undo();
    }
  };

  const redo = () => {
    if (fabricCanvas && 'redo' in fabricCanvas && fabricCanvas.redo instanceof Function) {
      fabricCanvas.redo();
    }
  };

  return {
    fabricCanvas,
    canvasRef,
    activeAllFabricSelection,
    removeFabricActiveObject,
    undo,
    redo,
    changeHandMode,
    changePenMode,
    changeSelectMode,
  };
}
