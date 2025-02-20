/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useRef } from 'react';

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
    <SplitLayoutContext.Provider value={{ splitLayoutStore }}>
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
    </SplitLayoutContext.Provider>
  );
}

export const SplitLayout = Object.assign(Layout, {
  Left,
  Resizer,
  Right,
});
