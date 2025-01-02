import { css } from '@emotion/react';
import { forwardRef } from 'react';

export const VerticalResizer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      css={css`
        width: 1px;
        height: 100%;
        flex-shrink: 0;
        border-left: 1px solid lightgray;
        cursor: col-resize;
        position: relative;
        z-index: 1000;
      `}
    >
      <div
        css={css`
          position: absolute;
          top: 0;
          bottom: 0;
          left: -2px;
          opacity: 0;
          width: 4px;
          background-color: gray;
          transition: opacity 0.1s ease 0.1s;
          &:hover {
            opacity: 1;
          }
        `}
      />
    </div>
  );
});
