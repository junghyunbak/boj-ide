import { css } from '@emotion/react';
import { forwardRef } from 'react';

export const HorizontalResizer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      css={css`
        height: 13px;
        width: 100%;
        flex-shrink: 0;
        border-top: 1px solid lightgray;
        border-bottom: 1px solid lightgray;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        cursor: row-resize;
      `}
    >
      <div
        css={css`
          width: 17px;
          border-bottom: 1px solid gray;
        `}
      />
      <div
        css={css`
          width: 17px;
          border-bottom: 1px solid gray;
        `}
      />
      <div
        css={css`
          width: 17px;
          border-bottom: 1px solid gray;
        `}
      />
      <div
        css={css`
          width: 17px;
          border-bottom: 1px solid gray;
        `}
      />
    </div>
  );
});
