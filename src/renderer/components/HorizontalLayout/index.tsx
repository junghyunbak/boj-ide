/* eslint-disable react/require-default-props */
import React, { useRef, useEffect } from 'react';

import { css } from '@emotion/css';

import { useStore } from '../../store';

interface LeftProps {
  children?: React.ReactNode;
}

function Left({ children }: LeftProps) {
  return children;
}

const LeftType = (<Left />).type;

interface RightProps {
  children?: React.ReactNode;
}

function Right({ children }: RightProps) {
  return children;
}

const RightType = (<Right />).type;

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const left = leftRef.current;
    const resizer = resizerRef.current;
    const container = containerRef.current;

    if (!left || !resizer || !container) {
      return () => {};
    }

    let isDragging = false;

    let startX = 0;

    let leftWidth = 0;

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

      const ratio = Math.min(((leftWidth + deltaX) / container.getBoundingClientRect().width) * 100, 100);

      left.style.width = `${ratio}%`;

      useStore.getState().setLeftRatio(ratio);
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

  const [LeftElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === LeftType,
  );
  const [RightElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === RightType,
  );

  return (
    <div
      className={css`
        display: flex;
        width: 100%;
        height: 100%;
      `}
      ref={containerRef}
    >
      <div
        ref={leftRef}
        className={css`
          width: ${useStore.getState().leftRatio}%;
          height: 100%;
        `}
      >
        {LeftElement}
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
          overflow: hidden;
        `}
      >
        {RightElement}
      </div>
    </div>
  );
}

export const HorizontalLayout = Object.assign(Layout, {
  Left,
  Right,
});
