import { useCallback, useRef } from 'react';

import { css } from '@emotion/react';

import { useWebview, useSetupWebview, useEventWebview, useDrag, useModifyWebview } from '@/renderer/hooks';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';

import {
  BojViewLayout,
  BojViewLoadingCloseButton,
  BojViewLoadingContentParagraph,
  BojViewLoadingLayout,
  BojViewLodingContentBox,
} from './index.style';

export function BojView() {
  const tourRef = useRef<HTMLDivElement>(null);

  const { webviewIsLoading, webviewStartUrl } = useWebview();
  const { isResizerDrag } = useDrag();

  const { updateWebviewLoading } = useModifyWebview();

  useEventWebview();

  useSetupWebview();

  const handleWebviewLoadingCloseButtonClick = useCallback(() => {
    updateWebviewLoading('finished');
  }, [updateWebviewLoading]);

  return (
    <BojViewLayout ref={tourRef}>
      <webview
        src={webviewStartUrl}
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
        <BojViewLoadingLayout>
          <BojViewLodingContentBox>
            <BojViewLoadingContentParagraph>로딩 중...</BojViewLoadingContentParagraph>
            <BojViewLoadingCloseButton onClick={handleWebviewLoadingCloseButtonClick}>
              <X />
            </BojViewLoadingCloseButton>
          </BojViewLodingContentBox>
        </BojViewLoadingLayout>
      )}

      <TourOverlay title="웹 뷰" tourRef={tourRef} myTourStep={1} guideLoc="right">
        <p>내장된 브라우저에서 풀이 할 문제 페이지로 이동합니다.</p>
        <br />
        <p>문제 페이지에 접속하면 에디터가 활성화되고 코드를 실행 할 준비가 완료됩니다.</p>
        <br />
        <p>
          💡 크롬 확장 프로그램{' '}
          <a
            href="https://chromewebstore.google.com/detail/boj-ide-executor/aegmfpcnfkmlhmlklhipladjabpncjha"
            target="_blank"
          >
            BOJ IDE Executor
          </a>
          를 사용하면
          <br />
          브라우저에서 곧바로 문제를 열어볼 수 있습니다.
        </p>
      </TourOverlay>
    </BojViewLayout>
  );
}
