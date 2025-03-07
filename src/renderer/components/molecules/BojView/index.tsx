import { useRef } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useWebview } from '@/renderer/hooks';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function BojView() {
  const [isResizerDrag] = useStore(useShallow((s) => [s.isResizerDrag]));

  const { startWebviewUrl, webviewIsLoading } = useWebview();

  const tourRef = useRef<HTMLDivElement>(null);

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
      `}
      ref={tourRef}
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

      <TourOverlay title="웹 뷰" tourRef={tourRef} myTourStep={1} guideLoc="right">
        <p>내장된 브라우저로 풀이 할 문제 페이지로 이동합니다.</p>
        <br />
        <p>문제 페이지에 접속하면 에디터가 활성화되고 코드를 실행 할 준비가 완료됩니다.</p>
        <br />
        <p>
          💡 크롬 확장 프로그램{' '}
          <a href="https://chromewebstore.google.com/detail/boj-ide-executor/aegmfpcnfkmlhmlklhipladjabpncjha">
            BOJ IDE Executor
          </a>
          로 브라우저에서 곧바로 문제를 열수도 있습니다.
        </p>
      </TourOverlay>
    </div>
  );
}
