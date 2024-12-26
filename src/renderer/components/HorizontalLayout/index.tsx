/* eslint-disable react/require-default-props */
import React, { useRef, useEffect } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { HLLayout, HLLeftBox, HLResizerBox, HLRightBox } from './index.styles';

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
  onLeftRatioChange?: (leftRatio: number) => void;
}

function Layout({ children, onLeftRatioChange = () => {} }: LayoutProps) {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [setIsDrag] = useStore(useShallow((s) => [s.setIsDrag]));

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
      setIsDrag(true);
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

      onLeftRatioChange(ratio);
    };

    const handleMouseUp = () => {
      setIsDrag(false);
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
  }, [onLeftRatioChange, setIsDrag]);

  const [LeftElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === LeftType,
  );
  const [RightElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === RightType,
  );

  return (
    <HLLayout ref={containerRef}>
      <HLLeftBox ref={leftRef}>{LeftElement}</HLLeftBox>

      <HLResizerBox ref={resizerRef} />

      <HLRightBox>{RightElement}</HLRightBox>
    </HLLayout>
  );
}

export const HorizontalLayout = Object.assign(Layout, {
  Left,
  Right,
});
