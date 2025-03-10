import { useCallback } from 'react';

import { useFabricStore, useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { useModifyFabric } from '../useModifyFabric';

export function useModifyPaint() {
  const [setMode] = useFabricStore(useShallow((s) => [s.setMode]));
  const [setBrushWidth] = useFabricStore(useShallow((s) => [s.setBrushWidth]));
  const [setBrushColor] = useFabricStore(useShallow((s) => [s.setBrushColor]));
  const [setIsExpand] = useFabricStore(useShallow((s) => [s.setIsExpand]));

  const { backupFabricCanvasData } = useModifyFabric();

  const handleFabricCanvasModeButtonClick = useCallback(
    (mode: FabricCanvasMode) => {
      return () => {
        setMode(mode);
      };
    },
    [setMode],
  );

  const handleBrushWidthButtonClick = useCallback(
    (width: BrushWidth) => {
      return () => {
        setBrushWidth(width);
      };
    },
    [setBrushWidth],
  );

  const handlBrushColorButtonClick = useCallback(
    (color: BrushColor) => {
      return () => {
        setBrushColor(color);
      };
    },
    [setBrushColor],
  );

  const handleExpandButtonClick = useCallback(() => {
    const { isExpand } = useFabricStore.getState();

    setIsExpand(!isExpand);
  }, [setIsExpand]);

  const handleButtonMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    /**
     * 버튼 클릭으로 인한 fabric canvas의 focus blur를 방지
     */
    e.preventDefault();

    const { paintRef } = useFabricStore.getState();

    paintRef.current?.focus();
  };

  const handlePaintBlur = useCallback(() => {
    const { problem } = useStore.getState();
    const { canvas } = useFabricStore.getState();

    backupFabricCanvasData(problem?.number || '', canvas);
  }, [backupFabricCanvasData]);

  return {
    handleFabricCanvasModeButtonClick,
    handleBrushWidthButtonClick,
    handlBrushColorButtonClick,
    handleExpandButtonClick,
    handleButtonMouseDown,
    handlePaintBlur,
  };
}
