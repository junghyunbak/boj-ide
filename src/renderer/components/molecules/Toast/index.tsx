import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

import { useToast } from '@/renderer/hooks';
import { useEventToast } from '@/renderer/hooks/useEventToast';

export function Toast() {
  const { toastContext } = useToast();

  useEventToast();

  if (!toastContext) {
    return null;
  }

  return (
    <div
      css={css`
        position: fixed;
        inset: 0;

        pointer-events: none;

        z-index: ${zIndex.overlay.toast};

        display: flex;
        justify-content: center;
      `}
    >
      <div
        css={css`
          position: absolute;
          bottom: ${toastContext.bottom};

          background-color: black;

          padding: 0.5rem;

          border-radius: 4px;
        `}
      >
        <p
          css={css`
            color: white;
          `}
        >
          {toastContext.message}
        </p>
      </div>
    </div>
  );
}
