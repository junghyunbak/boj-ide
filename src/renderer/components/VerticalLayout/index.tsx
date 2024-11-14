/* eslint-disable react/require-default-props */
import React, { useRef, useEffect } from 'react';

import { css } from '@emotion/css';

import { useStore } from '../../store';

interface TopProps {
  children?: React.ReactNode;
}

function Top({ children }: TopProps) {
  return children;
}

const TopType = (<Top />).type;

interface BottomProps {
  children?: React.ReactNode;
}

function Bottom({ children }: BottomProps) {
  return children;
}

const BottomType = (<Bottom />).type;

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const topRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const top = topRef.current;
    const resizer = resizerRef.current;
    const container = containerRef.current;

    if (!top || !resizer || !container) {
      return () => {};
    }

    let isDragging = false;

    let startY = 0;

    let upHeight = 0;

    const handleResizerMouseDown = (e: MouseEvent) => {
      isDragging = true;

      startY = e.clientY;

      upHeight = top.getBoundingClientRect().height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const deltaY = e.clientY - startY;

      const ratio = Math.min(Math.max(0, ((upHeight + deltaY) / container.getBoundingClientRect().height) * 100), 100);

      top.style.height = `${ratio}%`;

      useStore.getState().setTopRatio(ratio);
    };

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

  const [TopElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === TopType,
  );
  const [BottomElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === BottomType,
  );

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
      `}
      ref={containerRef}
    >
      <div
        ref={topRef}
        className={css`
          width: 100%;
          height: ${useStore.getState().topRatio}%;
        `}
      >
        {TopElement}
      </div>

      <div
        className={css`
          height: 15px;
          width: 100%;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 1px solid lightgray;
          border-bottom: 1px solid lightgray;
          &:hover {
            cursor: row-resize;
          }
        `}
        ref={resizerRef}
      >
        <div
          className={css`
            border-top: 5px dotted lightgray;
            width: 50px;
          `}
        />
      </div>

      <div
        className={css`
          flex: 1;
          overflow: hidden;
        `}
      >
        {BottomElement}
      </div>
    </div>
  );
}

export const VerticalLayout = Object.assign(Layout, {
  Top,
  Bottom,
});
