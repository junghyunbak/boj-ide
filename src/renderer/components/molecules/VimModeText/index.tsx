import { css } from '@emotion/react';

import { useEditor, useProblem } from '@/renderer/hooks';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { languageToExt } from '@/renderer/utils';

export function VimModeText() {
  const [vimMode] = useStore(useShallow((s) => [s.vimMode]));
  const [isCodeStale] = useStore(useShallow((s) => [s.isCodeStale]));

  const { editorMode, editorLanguage } = useEditor();
  const { problem } = useProblem();

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
