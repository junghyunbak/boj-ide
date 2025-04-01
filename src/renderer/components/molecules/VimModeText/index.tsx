import { css } from '@emotion/react';

import { useEditor, useLanguage, useProblem, useStale, useVim } from '@/renderer/hooks';

import { languageToExt } from '@/renderer/utils';

/**
 * // TODO: vim mode text -> saved status 컴포넌트로 변경
 *
 * 저장됨 상태는 항상 아래에 표시되도록 수정
 */
export function VimModeText() {
  const { problem } = useProblem();
  const { language } = useLanguage();
  const { editorMode } = useEditor();
  const { vimMode } = useVim();
  const { isStale } = useStale(problem, language);

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
          white-space: nowrap;
        `}
      >
        {isStale ? `-- ${vimMode.toUpperCase()} --` : `"${problem.number}.${languageToExt(language)}" written`}
      </p>
    </div>
  );
}
