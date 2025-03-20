import { useEditor, useModifyEditor, useModifyStale, useProblem, useStale } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useCallback } from 'react';

export function SaveCodeButton() {
  const { problem } = useProblem();
  const { editorLanguage } = useEditor();
  const { problemToStale } = useStale();

  const { saveCode } = useModifyEditor();
  const { updateProblemToStale } = useModifyStale();

  const handleSaveCodeButtonClick = useCallback(() => {
    saveCode(problem, editorLanguage);
    updateProblemToStale(problem, editorLanguage, false);
  }, [saveCode, updateProblemToStale, problem, editorLanguage]);

  const isCodeStale = problemToStale.get(`${problem?.number}|${editorLanguage}`);

  return (
    <ActionButton onClick={handleSaveCodeButtonClick} disabled={isCodeStale === undefined ? true : !isCodeStale}>
      저장
    </ActionButton>
  );
}
