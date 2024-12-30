import { useEffect, useRef } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useHorizontalLayout(props?: { onRatioChange: (ratio: number) => void; reverse?: boolean }) {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [setIsDrag] = useStore(useShallow((s) => [s.setIsDrag]));

  const { onRatioChange, reverse } = props || {};

  useEffect(() => {
    const left = leftRef.current;
    const resizer = resizerRef.current;
    const container = containerRef.current;

    if (!left || !resizer || !container) {
      return () => {};
    }

    let isDragging = false;
    let start = 0;
    let leftSize = 0;

    const handleResizerMouseDown = (e: MouseEvent) => {
      setIsDrag(true);

      const { width, height } = left.getBoundingClientRect();
      const { clientX, clientY } = e;

      isDragging = true;
      start = reverse ? clientY : clientX;
      leftSize = reverse ? height : width;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const { width, height } = container.getBoundingClientRect();
      const { clientX, clientY } = e;

      const delta = (reverse ? clientY : clientX) - start;
      const ratio = Math.min(((leftSize + delta) / (reverse ? height : width)) * 100, 100);

      if (reverse) {
        left.style.height = `${ratio}%`;
      } else {
        left.style.width = `${ratio}%`;
      }

      if (onRatioChange) {
        onRatioChange(ratio);
      }
    };

    const handleMouseUp = () => {
      setIsDrag(false);
      isDragging = false;
    };

    resizer.addEventListener('mousedown', handleResizerMouseDown);

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      resizer.removeEventListener('mousedown', handleResizerMouseDown);

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onRatioChange, reverse, setIsDrag]);

  return {
    leftRef,
    resizerRef,
    containerRef,
  };
}
