import { useCallback, useEffect, useRef, useState } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';
import 'fabric-history';

export function useFabricCanvas(problemNumber: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHandRef = useRef(false);

  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

  /**
   * idb persist를 사용하고 있어 상태로 참조해야만 한다.
   */
  const [problemToFabricJSON, setProblemToFabricJSON] = useFabricStore(
    useShallow((s) => [s.problemToFabricJSON, s.setProblemToFabricJSON]),
  );

  /**
   * fabric 캔버스 객체 생성, 초기화, 데이터 백업
   */
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

  /**
   * fabric 캔버스 초기화 시 백업 데이터 로딩
   */
  useEffect(() => {
    const fabricJSON = problemToFabricJSON[problemNumber];

    if (!fabricCanvas) {
      return () => {};
    }

    if (fabricJSON && fabricCanvas.isEmpty()) {
      try {
        fabricCanvas.loadFromJSON(fabricJSON, () => {});
      } catch (e) {
        // BUG: Cannot read properties of null (reading 'clearRect')
        // https://github.com/fabricjs/fabric.js/discussions/10036
        // dispose된 fabricCanvas를 사용할 때 해당 에러 발생. React 생명주기와 관련
      }
    }

    let timer: ReturnType<typeof setTimeout>;

    const handleObjectAdded = () => {
      if (timer) {
        clearTimeout(timer);
      }

      /**
       * setTimeout 함수 내부에서 fabricCanvas.toJSON() 으로 데이터를 가져올 경우
       * fabricCanvas가 dispose되면 아무런 값도 없어지기 때문에 미리 로드해두어야 한다.
       */
      const savedFabricJSON = fabricCanvas.toJSON();

      timer = setTimeout(() => {
        setProblemToFabricJSON((prev) => {
          const next = { ...prev };
          next[problemNumber] = savedFabricJSON;
          return next;
        });
      }, 2000);
    };

    fabricCanvas.on('object:added', handleObjectAdded);

    return () => {
      fabricCanvas.off('object:added', handleObjectAdded);

      /**
       * 컴포넌트 언마운트시에도 데이터 저장
       */
      handleObjectAdded();
    };
  }, [fabricCanvas, problemNumber, problemToFabricJSON, setProblemToFabricJSON]);

  /**
   * fabric 캔버스 전용 이벤트 설정 (마우스 휠 스크롤 확대/축소)
   */
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

    return () => {
      /**
       * Event의 하위 인터페이스인 EventMouse를 사용하는 fabric 이벤트이지만 off에서는 이를 타입 불일치로 판단하기 때문에 타입체크 무시
       */
      fabricCanvas.off('mouse:down', handleMouseDown);
      // @ts-ignore
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
      // @ts-ignore
      fabricCanvas.off('mouse:wheel', handleWheelScroll);
    };
  }, [fabricCanvas, problemNumber]);

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
