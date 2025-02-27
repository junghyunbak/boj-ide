import { css } from '@emotion/react';

import { SubmitButton } from '@/renderer/components/molecules/SubmitButton';
import { WebviewController } from '@/renderer/components/molecules/WebviewController';
import { ThemeButton } from '@/renderer/components/molecules/ThemeButton';

export function Nav() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
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
  );
}
