import { fabric } from 'fabric';

import { useEffect } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useFabricCanvasController } from '../useFabricCanvasController';

export function useFabricCanvasEvent() {
  const [mode] = useFabricStore(useShallow((s) => [s.mode]));
  const [canvas] = useFabricStore(useShallow((s) => [s.canvas]));
  const [brushWidth] = useFabricStore(useShallow((s) => [s.brushWidth]));
  const [brushColor] = useFabricStore(useShallow((s) => [s.brushColor]));

  const { changeHandMode, changeSelectMode, changePenMode } = useFabricCanvasController();

  /**
   * - 모드 (select, hand, pen)
   * - 펜 두께
   * - 펜 색상
   *
   * 이 변경될 때 마다 fabric 상태 업데이트
   */
  useEffect(() => {
    switch (mode) {
      case 'select':
        changeSelectMode();
        break;
      case 'hand':
        changeHandMode();
        break;
      case 'pen':
      default:
        changePenMode({ brushWidth, brushColor });
        break;
    }
  }, [
    mode,
    brushWidth,
    brushColor,
    changeSelectMode,
    changePenMode,
    changeHandMode,
    canvas, // 캔버스가 초기화 되기 이전에 실행될 수 있으므로, 의존성에 canvas를 꼭 추가해야 함.
  ]);

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
