import { css } from '@emotion/react';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { ReactComponent as Logo } from '@/renderer/assets/svgs/logo.svg';

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
        gap: 1.5rem;
      `}
    >
      <Logo
        css={css`
          width: 11rem;
          color: lightgray;
        `}
      />
      <Text>왼쪽 브라우저에서 문제 페이지로 이동하세요.</Text>
    </div>
  );
}
