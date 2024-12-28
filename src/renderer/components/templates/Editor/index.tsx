import { css } from '@emotion/react';
import { EditorHeader } from '@/renderer/components/organisms/EditorHeader';
import { Editor as EEditor } from '@/renderer/components/Editor';
import { RowLine } from '../../atoms/lines/RowLIne';

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
      <div
        css={css`
          flex: 1;
          overflow: hidden;
        `}
      >
        <EEditor />
      </div>
    </div>
  );
}
