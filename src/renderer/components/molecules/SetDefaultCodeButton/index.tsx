import { useCallback } from 'react';

import { useModifyEditor, useProblem, useModifyConfirmModal, useLanguage } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function SetDefaultCodeButton() {
  const { problem } = useProblem();
  const { language } = useLanguage();

  const { saveCode, saveDefaultCode } = useModifyEditor();
  const { fireConfirmModal } = useModifyConfirmModal();

  const handleSetDefaultButtonClick = useCallback(() => {
    fireConfirmModal('현재 코드를 기본 코드로 저장하시겠습니까?', async () => {
      await saveCode(problem, language);
      await saveDefaultCode(problem, language);
    });
  }, [saveCode, saveDefaultCode, fireConfirmModal, problem, language]);

  return (
    <ActionButton onClick={handleSetDefaultButtonClick} disabled={!problem} data-testid="save-default-code-button">
      기본 코드 저장
    </ActionButton>
  );
}
