import { css } from '@emotion/react';

import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';
import { EditorHeader } from '@/renderer/components/organisms/EditorHeader';
import { EditorContent } from '@/renderer/components/organisms/EditorContent';

export function Editor() {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
      `}
    >
      <EditorHeader />
      <RowLine />
      <EditorContent />
    </div>
  );
}
