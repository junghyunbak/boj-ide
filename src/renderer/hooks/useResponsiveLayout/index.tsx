import { useEffect, useRef } from 'react';

export function useResponsiveLayout(callback: (width: number, height: number) => void) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return () => {};
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      callback(width, height);
    });

    observer.observe(container);

    return () => {
      observer.unobserve(container);
      observer.disconnect();
    };
  }, [callback]);

  return { containerRef };
}
