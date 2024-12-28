import { css } from '@emotion/react';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { ExecuteCodeButton } from '@/renderer/components/molecules/ExecuteCodeButton';

export function OutputHeader() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.5rem 0.5rem 1rem;
        background-color: white;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 0.5rem;
        `}
      >
        <Text>실행 결과</Text>
      </div>
      <ExecuteCodeButton />
    </div>
  );
}
