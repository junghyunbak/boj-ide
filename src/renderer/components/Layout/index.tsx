import { css } from '@emotion/css';

import React, { useEffect, useRef } from 'react';

import { size } from '../../../styles';

import './index.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const leftRef = useRef<HTMLDivElement | null>(null);

  const bojAreaRef = useRef<HTMLDivElement | null>(null);

  const resizerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const left = leftRef.current;
    const bojArea = bojAreaRef.current;
    const resizer = resizerRef.current;

    if (!left || !bojArea || !resizer) {
      return () => {};
    }

    let isDragging = false;

    let startX = 0;

    let leftWidth = 0;

    const sendResizingResult = () => {
      const { x, y, width, height } = bojArea.getBoundingClientRect();

      window.electron.ipcRenderer.sendMessage('change-boj-view-width', {
        data: { x, y, width, height },
      });
    };

    const handleResizerMouseDown = (e: MouseEvent) => {
      isDragging = true;

      startX = e.clientX;

      leftWidth = left.getBoundingClientRect().width;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const deltaX = e.clientX - startX;

      const maxRatio = ((window.outerWidth - 20) / window.outerWidth) * 100;

      const ratio = Math.min(((leftWidth + deltaX) / window.outerWidth) * 100, maxRatio);

      left.style.width = `${ratio}%`;

      sendResizingResult();
    };

    window.addEventListener('resize', () => {
      sendResizingResult();
    });

    sendResizingResult();

    const handleMouseUp = () => {
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
  }, []);

  return (
    <div
      className={css`
        display: flex;
        height: 100%;
        justify-content: end;
      `}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 50%;
        `}
        ref={leftRef}
      >
        <div
          className={css`
            width: 100%;
            height: ${size.BOJ_VIEW_NAVIGATION_HEIGHT}px;
            box-sizing: border-box;
            border-bottom: 1px solid black;
            background-color: white;
          `}
        >
          네비게이션
        </div>

        <div
          className={css`
            flex: 1;
          `}
          ref={bojAreaRef}
        />
      </div>

      <div ref={resizerRef} className="resizer" />

      <div className="right">{children}</div>
    </div>
  );
}
