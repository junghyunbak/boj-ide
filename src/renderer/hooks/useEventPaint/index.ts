import { useRef } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';

import { usePaint } from '../usePaint';
import { useModifyPaint } from '../useModifyPaint';
import { useEventElement } from '../useEventElement';
import { useEventFabricMouse, useEventFabricWheel } from '../useEventFabric';

export function useEventPaint() {
  const [setCanvasMode] = useStore(useShallow((s) => [s.setCanvasMode]));

  const prevMode = useRef<FabricCanvasMode>('pen');
  const isPressed = useRef(false);
  const isPanning = useRef(false);

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
  useEventElement(
    (e) => {
      if (isPressed.current) {
        return;
      }

      if (e.key === ' ') {
        setCanvasMode((prev) => {
          prevMode.current = prev;
          return 'hand';
        });
      }

      isPressed.current = true;
    },
    [isPressed, setCanvasMode],
    'keydown',
    paintRef.current,
  );

  useEventElement(
    (e) => {
      isPressed.current = false;

      if (e.key === ' ') {
        setCanvasMode(prevMode.current);
      }
    },
    [isPressed, setCanvasMode],
    'keyup',
    paintRef.current,
  );

  /**
   * fabric 캔버스에
   *
   * - 마우스
   * - 휠
   *
   * 이벤트 등록
   */
  useEventFabricMouse(
    () => {
      isPanning.current = true;
    },
    [],
    canvas,
    'mouse:down',
  );

  useEventFabricMouse(
    (event) => {
      const { isHand } = useStore.getState();

      if (!isPanning.current || !isHand || !canvas) {
        return;
      }

      const delta = new fabric.Point(event.e.movementX, event.e.movementY);

      canvas.relativePan(delta);
    },
    [canvas],
    canvas,
    'mouse:move',
  );

  useEventFabricWheel(
    (event) => {
      if (!canvas) {
        return;
      }

      const { isCtrlKeyPressed } = useStore.getState();
      const { deltaY, deltaX } = event.e;

      let zoom = canvas.getZoom();

      zoom *= 0.999 ** deltaY;

      if (zoom > 20) {
        zoom = 20;
      }

      if (zoom < 0.1) {
        zoom = 0.1;
      }

      if (isCtrlKeyPressed) {
        canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
      } else {
        canvas.relativePan(new fabric.Point(event.e.movementX - deltaX, event.e.movementY - deltaY));
      }

      event.e.preventDefault();
      event.e.stopPropagation();
    },
    [canvas],
    canvas,
  );

  useEventFabricMouse(
    () => {
      isPanning.current = false;
    },
    [],
    canvas,
    'mouse:up',
  );
}
