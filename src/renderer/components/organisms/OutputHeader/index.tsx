import { css } from '@emotion/react';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { ExecuteCodeButton } from '@/renderer/components/molecules/ExecuteCodeButton';
import { ExecuteResultText } from '@/renderer/components/molecules/ExecuteResultText';

export function OutputHeader() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.25rem 0.5rem 0.25rem 1rem;
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
        <ExecuteResultText />
      </div>
      <ExecuteCodeButton />
    </div>
  );
}
