import React, { useEffect, useRef, useState } from 'react';

import './index.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [initialBojAreaWidthRatio, setInitialBojAreaWidthRatio] = useState<number | null>(null);

  const bojAreaRef = useRef<HTMLDivElement | null>(null);

  const resizerRef = useRef<HTMLDivElement | null>(null);

  /**
   * boj 뷰 크기 비율 초기화
   * : 마지막 비율을 기억한 후 다음 실행에도 유지하기 위함
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('init-width-ratio', ({ data: { widthRatio } }) => {
      setInitialBojAreaWidthRatio(widthRatio);
    });
  }, []);

  useEffect(() => {
    if (initialBojAreaWidthRatio === null) {
      return () => {};
    }

    const resizer = resizerRef.current;

    const bojArea = bojAreaRef.current;

    if (!resizer || !bojArea) {
      return () => {};
    }

    let isDragging = false;

    let startX = 0;

    let leftWidth = 0;

    const handleResizerMouseDown = (e: MouseEvent) => {
      isDragging = true;

      startX = e.clientX;

      leftWidth = bojArea.getBoundingClientRect().width;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const deltaX = e.clientX - startX;

      const maxRatio = ((window.innerWidth - 20) / window.innerWidth) * 100;

      const ratio = Math.min(((leftWidth + deltaX) / window.innerWidth) * 100, maxRatio);

      bojArea.style.width = `${ratio}%`;

      window.electron.ipcRenderer.sendMessage('change-boj-view-ratio', { data: { widthRatio: ratio } });
    };

    const handleResizerMouseUp = () => {
      isDragging = false;
    };

    resizer.addEventListener('mousedown', handleResizerMouseDown);
    resizer.addEventListener('mouseup', handleResizerMouseUp);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      resizer.removeEventListener('mousedown', handleResizerMouseDown);
      resizer.removeEventListener('mouseup', handleResizerMouseUp);

      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [initialBojAreaWidthRatio]);

  if (initialBojAreaWidthRatio === null) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        justifyContent: 'end',
      }}
    >
      <div ref={bojAreaRef} style={{ width: `${initialBojAreaWidthRatio}%` }} />

      <div ref={resizerRef} className="resizer" />

      <div className="right">{children}</div>
    </div>
  );
}
