import { css } from '@emotion/react';
import { forwardRef } from 'react';

export const VerticalResizer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      css={css`
        width: 13px;
        height: 100%;
        flex-shrink: 0;
        border-left: 1px solid lightgray;
        border-right: 1px solid lightgray;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        background-color: #f5f5f5;
        cursor: col-resize;
      `}
    >
      <div
        css={css`
          height: 17px;
          border-left: 1px solid gray;
        `}
      />
      <div
        css={css`
          height: 17px;
          border-left: 1px solid gray;
        `}
      />
      <div
        css={css`
          height: 17px;
          border-left: 1px solid gray;
        `}
      />
      <div
        css={css`
          height: 17px;
          border-left: 1px solid gray;
        `}
      />
    </div>
  );
});
