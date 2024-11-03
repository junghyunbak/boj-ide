import { css } from '@emotion/css';

import React, { useEffect, useRef } from 'react';

import { BrowserNavigation } from '../BrowserNavigation';

import { useStore } from '../../store';

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

      const maxRatio = ((window.innerWidth - 20) / window.innerWidth) * 100;

      const ratio = Math.min(((leftWidth + deltaX) / window.innerWidth) * 100, maxRatio);

      left.style.width = `${ratio}%`;

      useStore.getState().setLeftRatio(ratio);

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
        position: fixed;
        inset: 0;
        display: flex;
      `}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: ${useStore.getState().leftRatio}%;
        `}
        ref={leftRef}
      >
        <BrowserNavigation />

        <div
          className={css`
            flex: 1;
            padding: 10%;
          `}
          ref={bojAreaRef}
        >
          <div
            className={css`
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 4px dotted gray;
              border-radius: 10px;
            `}
          >
            loading...
          </div>
        </div>
      </div>

      <div
        ref={resizerRef}
        className={css`
          width: 15px;
          height: 100%;
          background-color: white;
          &:hover {
            cursor: col-resize;
          }
          display: flex;
          justify-content: center;
          align-items: center;
          border-left: 1px solid lightgray;
          border-right: 1px solid lightgray;
        `}
      >
        <div
          className={css`
            height: 50px;
            border-left: 5px dotted lightgray;
          `}
        />
      </div>

      <div
        className={css`
          flex: 1;
        `}
      >
        {children}
      </div>
    </div>
  );
}
