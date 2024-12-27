import { useEffect, useRef } from 'react';

export function useXScroll() {
  const xScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const xScroll = xScrollRef.current;

    if (!xScroll) {
      return () => {};
    }

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;

      startX = e.clientX;

      scrollLeft = xScroll.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const deltaX = e.clientX - startX;

      xScroll.scrollLeft = scrollLeft - deltaX;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    xScroll.addEventListener('mousedown', handleMouseDown);
    xScroll.addEventListener('mousemove', handleMouseMove);
    xScroll.addEventListener('mouseup', handleMouseUp);
    xScroll.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      xScroll.removeEventListener('mousedown', handleMouseDown);
      xScroll.removeEventListener('mousemove', handleMouseMove);
      xScroll.removeEventListener('mouseup', handleMouseUp);
      xScroll.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return {
    xScrollRef,
  };
}
