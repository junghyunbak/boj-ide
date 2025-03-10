import { useEffect } from 'react';

export function useEventSyncLayout(
  cb: (width: number, height: number) => void,
  containerRef: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return () => {};
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      cb(width, height);
    });

    observer.observe(container);

    return () => {
      observer.unobserve(container);
      observer.disconnect();
    };
  }, [cb, containerRef]);
}
