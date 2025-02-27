import { forwardRef } from 'react';

import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

interface VerticalResizerProps extends React.CSSProperties {}

export const VerticalResizer = forwardRef<HTMLDivElement, VerticalResizerProps>((props, ref) => {
  return (
    <div
      ref={ref}
      css={(theme) => css`
        width: 1px;
        height: 100%;
        flex-shrink: 0;
        border-left: 1px solid ${theme.colors.border};
        cursor: col-resize;
        position: relative;
      `}
      style={{
        zIndex: props.zIndex || zIndex.resizer.default,
      }}
    >
      <div
        css={(theme) => css`
          position: absolute;
          top: 0;
          bottom: 0;
          left: -2px;
          opacity: 0;
          width: 4px;
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
