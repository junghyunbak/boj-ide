/* eslint-disable react/require-default-props */
import React from 'react';

import { css } from '@emotion/react';

import { useHorizontalLayout } from '@/renderer/hooks';

import { HorizontalResizer } from '@/renderer/components/atoms/lines/HorizontalResizer';
import { VerticalResizer } from '@/renderer/components/atoms/lines/VerticalResizer';

function Left({ children }: React.PropsWithChildren) {
  return children;
}

function Right({ children }: React.PropsWithChildren) {
  return children;
}

const LeftType = (<Left />).type;
const RightType = (<Right />).type;

type LayoutProps = {
  initialLeftRatio?: number;
  hiddenLeft?: boolean;
  zIndex?: number;
} & ExtractParams<typeof useHorizontalLayout>[0];

function Layout({
  children,

  initialLeftRatio = 50,
  hiddenLeft = false,
  zIndex,

  onRatioChange = () => {},
  reverse = false,
}: React.PropsWithChildren<LayoutProps>) {
  const { containerRef, leftRef, resizerRef } = useHorizontalLayout({
    onRatioChange,
    reverse,
  });

  const [LeftElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === LeftType,
  );
  const [RightElement] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === RightType,
  );

  const Resizer = reverse ? HorizontalResizer : VerticalResizer;

  return (
    <div
      css={css`
        display: flex;
        width: 100%;
        height: 100%;

        ${reverse
          ? css`
              flex-direction: column;
            `
          : css`
              flex-direction: row;
            `}
      `}
      ref={containerRef}
    >
      {hiddenLeft ? null : (
        <>
          <div
            ref={leftRef}
            css={
              reverse
                ? css`
                    width: 100%;
                    height: ${initialLeftRatio}%;
                  `
                : css`
                    width: ${initialLeftRatio}%;
                    height: 100%;
                  `
            }
          >
            {LeftElement}
          </div>

          <Resizer ref={resizerRef} zIndex={zIndex} />
        </>
      )}

      <div
        css={css`
          flex: 1;
          overflow: hidden;
        `}
      >
        {RightElement}
      </div>
    </div>
  );
}

export const SplitLayout = Object.assign(Layout, {
  Left,
  Right,
});
