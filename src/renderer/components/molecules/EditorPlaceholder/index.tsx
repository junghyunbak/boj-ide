import { color } from '@/styles';
import { css } from '@emotion/react';

export function EditorPlaceholder() {
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      `}
    >
      <h1
        css={css`
          color: ${color.primaryBg};
        `}
      >
        {'/<>'}
      </h1>
      <p>왼쪽 브라우저에서 문제 페이지로 이동하세요.</p>
    </div>
  );
}
