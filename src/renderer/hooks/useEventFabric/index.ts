import { fabric } from 'fabric';

import { useEffect } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useEventFabric() {
  const [canvas] = useFabricStore(useShallow((s) => [s.canvas]));

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
