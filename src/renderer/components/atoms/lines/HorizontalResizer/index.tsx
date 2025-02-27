import { forwardRef } from 'react';

import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

interface HorizontalResizerProps extends React.CSSProperties {}

export const HorizontalResizer = forwardRef<HTMLDivElement, HorizontalResizerProps>((props, ref) => {
  return (
    <div
      ref={ref}
      css={(theme) => css`
        height: 1px;
        width: 100%;
        flex-shrink: 0;
        border-bottom: 1px solid ${theme.colors.border};
        cursor: row-resize;
        position: relative;
      `}
      style={{
        zIndex: props.zIndex || zIndex.resizer.default,
      }}
    >
      <div
        css={(theme) => css`
          position: absolute;
          left: 0;
          right: 0;
          top: -2px;
          opacity: 0;
          height: 4px;
          background-color: ${theme.colors.accent};
          transition: opacity 0.1s ease 0.1s;
          &:hover {
            opacity: 1;
          }
        `}
      />
    </div>
  );
});
