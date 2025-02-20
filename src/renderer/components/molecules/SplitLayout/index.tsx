/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, MouseEventHandler, useContext, useEffect, useRef } from 'react';

import { css } from '@emotion/react';

import { HorizontalResizer } from '@/renderer/components/atoms/lines/HorizontalResizer';
import { VerticalResizer } from '@/renderer/components/atoms/lines/VerticalResizer';

import { getElementFromChildren } from '@/renderer/utils';

import { create, StoreApi, UseBoundStore } from 'zustand';

const LeftType = (<Left />).type;
const ResizerType = (<Resizer />).type;
const RightType = (<Right />).type;

type SplitLayoutStoreState = {
  leftRef: React.MutableRefObject<HTMLDivElement | null>;
  resizerRef: React.MutableRefObject<HTMLDivElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;

  vertical: boolean;

  isDrag: boolean;
  startX: number;
  leftWidth: number;
};

const LayoutContext = createContext<{
  splitLayoutStore: UseBoundStore<StoreApi<SplitLayoutStoreState>> | null;
}>({ splitLayoutStore: null });

type LayoutProps = {
  hiddenLeft?: boolean;
  vertical?: boolean;
};

function Layout({ children, hiddenLeft = false, vertical = false }: React.PropsWithChildren<LayoutProps>) {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const splitLayoutStore = useRef(
    create<SplitLayoutStoreState>(() => ({
      leftRef,
      resizerRef,
      containerRef,
      vertical,
      isDrag: false,
      startX: 0,
      leftWidth: 0,
    })),
  ).current;

  const LeftElement = getElementFromChildren(children, LeftType);
  const ResizerElement = getElementFromChildren(children, ResizerType);
  const RightElement = getElementFromChildren(children, RightType);

  return (
    <LayoutContext.Provider value={{ splitLayoutStore }}>
      <div
        ref={containerRef}
        css={css`
          display: flex;
          width: 100%;
          height: 100%;

          ${vertical
            ? css`
                flex-direction: column;
              `
            : css`
                flex-direction: row;
              `}
        `}
      >
        {!hiddenLeft && (
          <>
            {LeftElement}
            {ResizerElement}
          </>
        )}
        {RightElement}
      </div>
    </LayoutContext.Provider>
  );
}

function useSplitLayoutStoreContext() {
  const { splitLayoutStore } = useContext(LayoutContext);

  if (!splitLayoutStore) {
    throw new Error('[LayoutStore] store를 초기화한 후 사용해야 합니다.');
  }

  return { splitLayoutStore };
}

type LeftProps = {
  initialRatio?: number;
  onRatioChange?(ratio: number): void;
};

function Left({ children, initialRatio = 50, onRatioChange }: React.PropsWithChildren<LeftProps>) {
  const { splitLayoutStore } = useSplitLayoutStoreContext();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { isDrag, containerRef, leftRef, vertical, startX, leftWidth } = splitLayoutStore.getState();

      if (!isDrag) {
        return;
      }

      const container = containerRef.current;
      const left = leftRef.current;

      if (!container || !left) {
        return;
      }

      const { clientX, clientY } = e;
      const { width, height } = container.getBoundingClientRect();

      const deltaX = (vertical ? clientY : clientX) - startX;
      const ratio = Math.min(((leftWidth + deltaX) / (vertical ? height : width)) * 100, 100);

      if (vertical) {
        left.style.height = `${ratio}%`;
      } else {
        left.style.width = `${ratio}%`;
      }

      if (onRatioChange) {
        onRatioChange(ratio);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return function cleanup() {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [splitLayoutStore, onRatioChange]);

  return (
    <div
      ref={splitLayoutStore.getState().leftRef}
      css={
        splitLayoutStore.getState().vertical
          ? css`
              width: 100%;
              height: ${initialRatio}%;
            `
          : css`
              width: ${initialRatio}%;
              height: 100%;
            `
      }
    >
      {children}
    </div>
  );
}

type ResizerProps = {
  onDragStart?(): void;
  onDragEnd?(): void;
  zIndex?: number;
};

function Resizer({ children, onDragStart, onDragEnd, zIndex }: React.PropsWithChildren<ResizerProps>) {
  const { splitLayoutStore } = useSplitLayoutStoreContext();

  const { resizerRef, vertical } = splitLayoutStore.getState();

  const DefaultResizer = vertical ? HorizontalResizer : VerticalResizer;

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const { leftRef } = splitLayoutStore.getState();

    const left = leftRef.current;

    if (!left) {
      return;
    }

    if (onDragStart) {
      onDragStart();
    }

    splitLayoutStore.getState().isDrag = true;

    const { clientX, clientY } = e;
    const { width, height } = left.getBoundingClientRect();

    splitLayoutStore.getState().startX = vertical ? clientY : clientX;
    splitLayoutStore.getState().leftWidth = vertical ? height : width;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      splitLayoutStore.getState().isDrag = false;

      if (onDragEnd) {
        onDragEnd();
      }
    };

    window.addEventListener('mouseup', handleMouseUp);

    return function cleanup() {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [splitLayoutStore, onDragEnd]);

  return (
    <div ref={resizerRef} onMouseDown={handleMouseDown}>
      {children || <DefaultResizer zIndex={zIndex} />}
    </div>
  );
}

type RightProps = {};

function Right({ children }: React.PropsWithChildren<RightProps>) {
  return (
    <div
      css={css`
        flex: 1;
        overflow: hidden;
      `}
    >
      {children}
    </div>
  );
}

export const SplitLayout = Object.assign(Layout, {
  Left,
  Resizer,
  Right,
});
