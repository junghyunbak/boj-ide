import { useEditor, useModifyEditor, useProblem, useStale } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useCallback } from 'react';

export function SaveCodeButton() {
  const { problem } = useProblem();
  const { editorLanguage } = useEditor();
  const { isStale } = useStale(problem, editorLanguage);

  const { saveCode } = useModifyEditor();

  const handleSaveCodeButtonClick = useCallback(async () => {
    await saveCode(problem, editorLanguage);
  }, [saveCode, problem, editorLanguage]);

  return (
    <ActionButton
      onClick={handleSaveCodeButtonClick}
      disabled={isStale === undefined ? true : !isStale}
      data-testid="save-code-button"
    >
      저장
    </ActionButton>
  );
}
