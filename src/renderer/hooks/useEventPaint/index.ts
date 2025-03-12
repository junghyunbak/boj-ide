import { useEffect } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';

import { usePaint } from '../usePaint';
import { useModifyPaint } from '../useModifyPaint';
import { useEventElement } from '../useEventElement';

export function useEventPaint() {
  const [setMode] = useFabricStore(useShallow((s) => [s.setMode]));

  const { paintRef, canvas } = usePaint();

  const {
    unactiveAllFabricSelection,
    removeFabricActiveObject,
    activeAllFabricSelection,
    redo,
    undo,
    updatePaintMode,
    updateIsCtrlKeyPressed,
  } = useModifyPaint();

  /**
   * 그림판 단축키 이벤트 등록
   */
  useEventElement(
    (e) => {
      e.preventDefault();

      const { ctrlKey, metaKey, key, shiftKey } = e;

      const isCtrlKeyDown = ctrlKey || metaKey;
      const isShiftKeyDown = shiftKey;

      if (isCtrlKeyDown) {
        updateIsCtrlKeyPressed(true);
      }

      switch (key.toLowerCase()) {
        case 'escape':
          unactiveAllFabricSelection();
          break;
        case 'delete':
          removeFabricActiveObject();
          break;
        case 'm':
        case 'ㅡ':
          updatePaintMode('hand');
          break;
        case 'v':
        case 'ㅍ':
          updatePaintMode('select');
          break;
        case 'p':
        case 'ㅔ':
          updatePaintMode('pen');
          break;
        case 'a':
        case 'ㅁ':
          if (isCtrlKeyDown) {
            activeAllFabricSelection();
          }
          break;
        case 'z':
        case 'ㅋ':
          if (isCtrlKeyDown) {
            if (isShiftKeyDown) {
              redo();
            } else {
              undo();
            }
          }
          break;
        default:
          break;
      }
    },
    [
      activeAllFabricSelection,
      redo,
      removeFabricActiveObject,
      updateIsCtrlKeyPressed,
      unactiveAllFabricSelection,
      undo,
      updatePaintMode,
    ],
    'keydown',
    paintRef.current,
  );

  useEventElement(
    () => {
      updateIsCtrlKeyPressed(false);
    },
    [updateIsCtrlKeyPressed],
    'keyup',
    paintRef.current,
  );

  /**
   * 스페이스바 클릭 시 일시적으로 'hand' 모드로 변경
   */
  useEffect(() => {
    const paint = paintRef.current;

    if (!paint) {
      return function cleanup() {};
    }

    let prevMode: FabricCanvasMode = 'pen';
    let isPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPressed) {
        return;
      }

      if (e.key === ' ') {
        setMode((prev) => {
          prevMode = prev;
          return 'hand';
        });
      }

      isPressed = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      isPressed = false;

      if (e.key === ' ') {
        setMode(prevMode);
      }
    };

    paint.addEventListener('keydown', handleKeyDown);
    paint.addEventListener('keyup', handleKeyUp);

    return function cleanup() {
      paint.removeEventListener('keydown', handleKeyDown);
      paint.removeEventListener('keyup', handleKeyUp);
    };
  }, [paintRef, setMode]);

  /**
   * fabric 캔버스에
   *
   * - 마우스
   * - 휠
   *
   * 이벤트 등록
   */
  useEffect(() => {
    if (!canvas) {
      return function cleanup() {};
    }

    let panning = false;

    const handleMouseDown = () => {
      panning = true;
    };

    const handleMouseMove = (event: fabric.IEvent<MouseEvent>) => {
      const { isHand } = useFabricStore.getState();

      if (!panning || !isHand) {
        return;
      }

      const delta = new fabric.Point(event.e.movementX, event.e.movementY);

      canvas.relativePan(delta);
    };

    const handleMouseUp = () => {
      panning = false;
    };

    const handleWheelScroll = (opt: fabric.IEvent<WheelEvent>) => {
      const { isCtrlKeyPressed } = useFabricStore.getState();
      const { deltaY, deltaX } = opt.e;

      let zoom = canvas.getZoom();

      zoom *= 0.999 ** deltaY;

      if (zoom > 20) {
        zoom = 20;
      }

      if (zoom < 0.1) {
        zoom = 0.1;
      }

      if (isCtrlKeyPressed) {
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      } else {
        canvas.relativePan(new fabric.Point(opt.e.movementX - deltaX, opt.e.movementY - deltaY));
      }

      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('mouse:wheel', handleWheelScroll);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('mouse:move', handleMouseMove as (event: fabric.IEvent) => void);
      canvas.off('mouse:wheel', handleWheelScroll as (event: fabric.IEvent) => void);
    };
  }, [canvas]);
}
