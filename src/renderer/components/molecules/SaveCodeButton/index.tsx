import { useEditor, useModifyEditor, useModifyStale, useProblem, useStale } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useCallback } from 'react';

export function SaveCodeButton() {
  const { problem } = useProblem();
  const { editorLanguage } = useEditor();
  const { isStale } = useStale(problem, editorLanguage);

  const { saveCode } = useModifyEditor();
  const { updateProblemToStale } = useModifyStale();

  const handleSaveCodeButtonClick = useCallback(() => {
    saveCode(problem, editorLanguage);
    updateProblemToStale(problem, editorLanguage, false);
  }, [saveCode, updateProblemToStale, problem, editorLanguage]);

  return (
    <ActionButton onClick={handleSaveCodeButtonClick} disabled={isStale === undefined ? true : !isStale}>
      저장
    </ActionButton>
  );
}
