import { useCallback } from 'react';

import { useModifyEditor, useProblem, useModifyConfirmModal, useEditor } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function SetDefaultCodeButton() {
  const { problem } = useProblem();
  const { editorLanguage } = useEditor();

  const { saveCode, saveDefaultCode } = useModifyEditor();
  const { fireConfirmModal } = useModifyConfirmModal();

  const handleSetDefaultButtonClick = useCallback(() => {
    fireConfirmModal('현재 코드를 기본 코드로 저장하시겠습니까?', async () => {
      await saveCode(problem, editorLanguage);
      await saveDefaultCode(problem, editorLanguage);
    });
  }, [saveCode, saveDefaultCode, fireConfirmModal, problem, editorLanguage]);

  return (
    <ActionButton onClick={handleSetDefaultButtonClick} disabled={!problem} data-testid="save-default-code-button">
      기본 코드 저장
    </ActionButton>
  );
}
