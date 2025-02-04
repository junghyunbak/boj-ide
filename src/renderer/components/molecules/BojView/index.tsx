import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useWebview } from '@/renderer/hooks';

export function BojView() {
  const [isResizerDrag] = useStore(useShallow((s) => [s.isResizerDrag]));

  const { startWebviewUrl } = useWebview();

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <webview
        src={startWebviewUrl}
        style={{ flex: 1, pointerEvents: isResizerDrag ? 'none' : 'auto' }}
        // Warning: Received "true" for a non-boolean attribute 에러로 인해 @ts-ignore 추가
        // @ts-ignore
        allowpopups="true"
      />
    </div>
  );
}
