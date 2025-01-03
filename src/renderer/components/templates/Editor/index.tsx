import { css } from '@emotion/react';
import { EditorHeader } from '@/renderer/components/organisms/EditorHeader';
import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';
import { EditorContent } from '@/renderer/components/organisms/EditorContent';

export function Editor() {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: white;
      `}
    >
      <EditorHeader />
      <RowLine />
      <div
        css={css`
          flex: 1;
          overflow: hidden;
        `}
      >
        <EditorContent />
      </div>
    </div>
  );
}
