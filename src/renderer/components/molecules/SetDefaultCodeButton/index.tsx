import { useCallback } from 'react';

import { useModifyAlertModal, useModifyEditor, useProblem, useModifyConfirmModal, useEditor } from '@/renderer/hooks';

import { languageToExt } from '@/renderer/utils';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function SetDefaultCodeButton() {
  const { problem } = useProblem();
  const { editorLanguage } = useEditor();

  const { getEditorValue, saveFile } = useModifyEditor();
  const { fireAlertModal } = useModifyAlertModal();
  const { fireConfirmModal } = useModifyConfirmModal();

  const handleSetDefaultButtonClick = useCallback(() => {
    fireConfirmModal('현재 코드를 기본 코드로 저장하시겠습니까?', async () => {
      saveFile(problem, editorLanguage);

      const result = await window.electron.ipcRenderer.invoke('save-default-code', {
        data: { language: editorLanguage, code: getEditorValue() || '' },
      });

      if (result && result.data.isSaved) {
        fireAlertModal('안내', `default.${languageToExt(editorLanguage)} 파일이 성공적으로 업데이트 되었습니다.`);
      }
    });
  }, [editorLanguage, fireAlertModal, fireConfirmModal, getEditorValue, problem, saveFile]);

  return (
    <ActionButton onClick={handleSetDefaultButtonClick} disabled={!problem}>
      기본 코드 저장
    </ActionButton>
  );
}
