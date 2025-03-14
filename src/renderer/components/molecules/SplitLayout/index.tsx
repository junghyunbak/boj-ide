import React, { useRef, useMemo } from 'react';

import { css } from '@emotion/react';

import { getElementFromChildren } from '@/renderer/utils';

import { create } from 'zustand';

import { Left } from './SplitLayoutLeft';
import { Resizer } from './SplitLayoutResizer';
import { Right } from './SplitLayoutRight';

import { SplitLayoutContext, type SplitLayoutStoreState } from './SplitLayoutContext';

const LeftType = (<Left />).type;
const ResizerType = (<Resizer />).type;
const RightType = (<Right />).type;

type LayoutProps = {
  vertical?: boolean;
};

function Layout({ children, vertical = false }: React.PropsWithChildren<LayoutProps>) {
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

  const contextValue = useMemo(() => ({ splitLayoutStore }), [splitLayoutStore]);

  return (
    <SplitLayoutContext.Provider value={contextValue}>
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
        {LeftElement}
        {ResizerElement}
        {RightElement}
      </div>
    </SplitLayoutContext.Provider>
  );
}

export const SplitLayout = Object.assign(Layout, {
  Left,
  Resizer,
  Right,
});
