import { css } from '@emotion/react';

import { SubmitButton } from '@/renderer/components/molecules/SubmitButton';
import { WebviewController } from '@/renderer/components/molecules/WebviewController';
import { ThemeButton } from '@/renderer/components/molecules/ThemeButton';
import { ProblemHistory } from '@/renderer/components/molecules/ProblemHistory';

export function Nav() {
  return (
    <div
      css={css`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0.25rem 0.5rem;
        `}
      >
        <WebviewController />

        <div
          css={css`
            display: flex;
            gap: 0.5rem;
          `}
        >
          <ThemeButton />
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}
