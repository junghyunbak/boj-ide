import { css } from '@emotion/react';

import { useEditor, useProblem, useVim } from '@/renderer/hooks';

import { languageToExt } from '@/renderer/utils';

export function VimModeText() {
  const { editorMode, editorLanguage, isCodeStale } = useEditor();
  const { problem } = useProblem();
  const { vimMode } = useVim();

  if (!problem || !vimMode || editorMode === 'normal') {
    return null;
  }

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0 0.4rem;
      `}
    >
      <p
        css={css`
          font-size: 0.875rem;
        `}
      >
        {isCodeStale
          ? `-- ${vimMode.toUpperCase()} --`
          : `"${problem.number}.${languageToExt(editorLanguage)}" written`}
      </p>
    </div>
  );
}
