/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useEventFabricWheel(
  handler: (e: fabric.IEvent<WheelEvent>) => void,
  deps: unknown[],
  canvas: fabric.Canvas | null,
  eventName: MyPick<fabric.EventName, 'mouse:wheel'> = 'mouse:wheel',
) {
  useEffect(() => {
    if (!canvas) {
      return function cleanup() {};
    }

    canvas.on(eventName, handler);

    return function cleanup() {
      canvas.off(eventName, handler as (e: fabric.IEvent) => void);
    };
  }, [...deps, canvas]);
}

export function useEventFabricMouse(
  handler: (event: fabric.IEvent<MouseEvent>) => void,
  deps: unknown[],
  canvas: fabric.Canvas | null,
  eventName: MyExclude<fabric.EventName, 'mouse:wheel'>,
) {
  useEffect(() => {
    if (!canvas) {
      return function cleanup() {};
    }

    canvas.on(eventName, handler);

    return function cleanup() {
      canvas.off(eventName, handler as (e: fabric.IEvent) => void);
    };
  }, [...deps, canvas]);
}
