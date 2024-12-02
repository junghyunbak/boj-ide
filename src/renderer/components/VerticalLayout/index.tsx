/* eslint-disable react/require-default-props */
import React, { useRef, useEffect } from 'react';
import { VLBottomBox, VLLayout, VLResizerBox, VLTopBox } from './index.styles';

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
  onTopRatioChange?: (topRatio: number) => void;
}

function Layout({ children, onTopRatioChange = () => {} }: LayoutProps) {
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

      onTopRatioChange(ratio);
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
  }, [onTopRatioChange]);

  const [TopElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === TopType,
  );
  const [BottomElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === BottomType,
  );

  return (
    <VLLayout ref={containerRef}>
      <VLTopBox ref={topRef}>{TopElement}</VLTopBox>

      <VLResizerBox ref={resizerRef} />

      <VLBottomBox>{BottomElement}</VLBottomBox>
    </VLLayout>
  );
}

export const VerticalLayout = Object.assign(Layout, {
  Top,
  Bottom,
});
