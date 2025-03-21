import { useCallback } from 'react';

import { useLanguage, useModifyEditor, useProblem, useStale } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function SaveCodeButton() {
  const { problem } = useProblem();
  const { language } = useLanguage();

  const { isStale } = useStale(problem, language);

  const { saveCode } = useModifyEditor();

  const handleSaveCodeButtonClick = useCallback(async () => {
    await saveCode(problem, language);
  }, [saveCode, problem, language]);

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
