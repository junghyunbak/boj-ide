import { css } from '@emotion/react';

import { ExecuteCodeButton } from '@/renderer/components/molecules/ExecuteCodeButton';
import { ExecuteResultText } from '@/renderer/components/molecules/ExecuteResultText';
import { StopJudgeButton } from '@/renderer/components/molecules/StopJudgeButton';

export function OutputHeader() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.25rem 0.5rem 0.25rem 1rem;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 0.5rem;
        `}
      >
        <div>
          <p>실행 결과</p>
        </div>

        <StopJudgeButton />
        <ExecuteResultText />
      </div>
      <ExecuteCodeButton />
    </div>
  );
}
