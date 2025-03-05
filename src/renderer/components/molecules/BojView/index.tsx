import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useWebview } from '@/renderer/hooks';

export function BojView() {
  const [isResizerDrag] = useStore(useShallow((s) => [s.isResizerDrag]));

  const { startWebviewUrl, webviewIsLoading } = useWebview();

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
      `}
    >
      <webview
        src={startWebviewUrl}
        css={css`
          position: absolute;
          inset: 0;

          ${isResizerDrag
            ? css`
                pointer-events: none;
              `
            : css``}
        `}
        // Warning: Received "true" for a non-boolean attribute 에러로 인해 @ts-ignore 추가
        // @ts-ignore
        allowpopups="true"
      />

      {webviewIsLoading && (
        <div
          css={(theme) => css`
            position: absolute;
            inset: 0;

            background-color: ${theme.colors.bg};

            font-size: 2rem;

            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          로딩 중...
        </div>
      )}
    </div>
  );
}
