import { useEditor, useModifyEditor, useProblem } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useCallback } from 'react';

export function SaveCodeButton() {
  const { problem } = useProblem();
  const { problemToStale, editorLanguage } = useEditor();

  const { saveFile, updateProblemToStale } = useModifyEditor();

  const handleSaveCodeButtonClick = useCallback(() => {
    saveFile(problem, editorLanguage);
    updateProblemToStale(problem, editorLanguage, false);
  }, [saveFile, updateProblemToStale, problem, editorLanguage]);

  const isCodeStale = problemToStale.get(`${problem?.number}|${editorLanguage}`);

  return (
    <ActionButton onClick={handleSaveCodeButtonClick} disabled={isCodeStale === undefined ? true : !isCodeStale}>
      저장
    </ActionButton>
  );
}
