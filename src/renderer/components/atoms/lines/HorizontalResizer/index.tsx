import { css } from '@emotion/react';
import { forwardRef } from 'react';

export const HorizontalResizer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      css={css`
        height: 1px;
        width: 100%;
        flex-shrink: 0;
        border-bottom: 1px solid lightgray;
        cursor: row-resize;
        position: relative;
        z-index: 1000;
      `}
    >
      <div
        css={css`
          position: absolute;
          left: 0;
          right: 0;
          top: -2px;
          opacity: 0;
          height: 4px;
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
