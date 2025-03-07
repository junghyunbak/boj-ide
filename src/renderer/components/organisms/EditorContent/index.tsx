import { useRef } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { css } from '@emotion/react';

import { useProblem } from '@/renderer/hooks';

import { EditorSettings } from '@/renderer/components/molecules/EditorSettings';
import { EditorCodemirror } from '@/renderer/components/molecules/EditorCodemirror';
import { EditorPlaceholder } from '@/renderer/components/molecules/EditorPlaceholder';

import { TourOverlay } from '../../molecules/TourOverlay';

export function EditorContent() {
  const { problem } = useProblem();

  const [isSetting] = useStore(useShallow((s) => [s.isSetting]));

  const tourRef = useRef<HTMLDivElement>(null);

  const Content = (() => {
    if (isSetting) {
      return <EditorSettings />;
    }

    if (problem) {
      return <EditorCodemirror />;
    }

    return <EditorPlaceholder />;
  })();

  return (
    <div
      ref={tourRef}
      css={css`
        flex: 1;
        overflow: hidden;
      `}
    >
      {Content}

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
