import { useEffect } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useFabricCanvasController } from '../useFabricCanvasController';

export function usePaintEvent() {
  const [setIsCtrlKeyPressed] = useFabricStore(useShallow((s) => [s.setIsCtrlKeyPressed]));
  const [setMode] = useFabricStore(useShallow((s) => [s.setMode]));
  const [paintRef] = useFabricStore(useShallow((s) => [s.paintRef]));

  const { unactiveAllFabricSelection, removeFabricActiveObject, activeAllFabricSelection, redo, undo } =
    useFabricCanvasController();

  /**
   * 그림판 단축키 이벤트 등록
   */
  useEffect(() => {
    const container = paintRef.current;

    if (!container) {
      return () => {};
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const { ctrlKey, metaKey, key, shiftKey } = e;

      const isCtrlKeyDown = ctrlKey || metaKey;
      const isShiftKeyDown = shiftKey;

      if (isCtrlKeyDown) {
        setIsCtrlKeyPressed(true);
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
          setMode('hand');
          break;
        case 'v':
        case 'ㅍ':
          setMode('select');
          break;
        case 'p':
        case 'ㅔ':
          setMode('pen');
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
    };

    const handleKeyUp = () => {
      setIsCtrlKeyPressed(false);
    };

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('keyup', handleKeyUp);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    removeFabricActiveObject,
    activeAllFabricSelection,
    undo,
    redo,
    unactiveAllFabricSelection,
    setIsCtrlKeyPressed,
    setMode,
    paintRef,
  ]);

  /**
   * 스페이스바 클릭 시 일시적으로 'hand' 모드로 변경
   */
  useEffect(() => {
    const container = paintRef.current;

    if (!container) {
      return () => {};
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

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('keyup', handleKeyUp);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('keyup', handleKeyUp);
    };
  }, [paintRef, setMode]);
}
