import { useRef } from 'react';

import { css } from '@emotion/react';

import { useProblem, useSetting } from '@/renderer/hooks';

import { EditorSettings } from '@/renderer/components/molecules/EditorSettings';
import { EditorCodemirror } from '@/renderer/components/molecules/EditorCodemirror';
import { EditorPlaceholder } from '@/renderer/components/molecules/EditorPlaceholder';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function EditorContent() {
  const tourRef = useRef<HTMLDivElement>(null);

  const { problem } = useProblem();
  const { isSetting } = useSetting();

  return (
    <div
      ref={tourRef}
      css={css`
        flex: 1;
        overflow: hidden;
        position: relative;
      `}
    >
      {problem ? <EditorCodemirror /> : <EditorPlaceholder />}

      {isSetting && (
        <div
          css={css`
            position: absolute;
            inset: 0;
          `}
        >
          <EditorSettings />
        </div>
      )}

      <TourOverlay title="에디터" tourRef={tourRef} myTourStep={2} guideLoc="left">
        <p>문제 풀이를 위한 알고리즘을 작성합니다.</p>
        <br />
        <p>다음과 같은 항목을 변경할 수 있습니다.</p>
        <br />
        <ul>
          <li>에디터 모드 (Vim / Normal)</li>
          <li>폰트 크기</li>
          <li>들여쓰기 크기</li>
          <li>런타임 (C++, Java, Python, Node.js)</li>
        </ul>
      </TourOverlay>
    </div>
  );
}
