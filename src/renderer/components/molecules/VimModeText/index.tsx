import { css } from '@emotion/react';

import { useEditor, useProblem, useVim } from '@/renderer/hooks';

import { languageToExt } from '@/renderer/utils';

/**
 * // TODO: vim mode text -> saved status 컴포넌트로 변경
 *
 * 저장됨 상태는 항상 아래에 표시되도록 수정
 */
export function VimModeText() {
  const { editorMode, editorLanguage, problemToStale } = useEditor();
  const { problem } = useProblem();
  const { vimMode } = useVim();

  if (!problem || !vimMode || editorMode === 'normal') {
    return null;
  }

  const isCodeStale = problemToStale.get(`${problem.number}|${editorLanguage}}`);

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
