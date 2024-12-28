import { css } from '@emotion/react';
import { SubmitButton } from '@/renderer/components/molecules/SubmitButton';
import { WebviewController } from '../../molecules/WebviewController';

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
      <SubmitButton />
    </div>
  );
}
