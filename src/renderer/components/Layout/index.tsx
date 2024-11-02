import { css } from '@emotion/css';

import React, { useEffect, useRef } from 'react';

import { size } from '../../../styles';

import './index.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const bojAreaRef = useRef<HTMLDivElement | null>(null);

  const resizerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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

      const maxRatio = ((window.outerWidth - 20) / window.outerWidth) * 100;

      const ratio = Math.min(((leftWidth + deltaX) / window.outerWidth) * 100, maxRatio);

      bojArea.style.width = `${ratio}%`;

      window.electron.ipcRenderer.sendMessage('change-boj-view-width', {
        data: { nextWidth: bojArea.getBoundingClientRect().width },
      });
    };

    window.addEventListener('resize', () => {
      window.electron.ipcRenderer.sendMessage('change-boj-view-width', {
        data: { nextWidth: bojArea.getBoundingClientRect().width },
      });
    });

    window.electron.ipcRenderer.sendMessage('change-boj-view-width', {
      data: { nextWidth: bojArea.getBoundingClientRect().width },
    });

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
        ref={bojAreaRef}
      >
        <div
          className={css`
            width: 100%;
            height: ${size.BOJ_VIEW_NAVIGATION_HEIGHT}px;
            box-sizing: border-box;
            border: 1px solid black;
            background-color: white;
          `}
        >
          네비게이션
        </div>
      </div>

      <div ref={resizerRef} className="resizer" />

      <div className="right">{children}</div>
    </div>
  );
}
