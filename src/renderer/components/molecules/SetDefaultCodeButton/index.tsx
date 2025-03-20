import { useCallback } from 'react';

import {
  useModifyAlertModal,
  useModifyEditor,
  useProblem,
  useModifyConfirmModal,
  useEditor,
  useModifyStale,
} from '@/renderer/hooks';

import { languageToExt } from '@/renderer/utils';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function SetDefaultCodeButton() {
  const { problem } = useProblem();
  const { editorLanguage } = useEditor();

  const { getEditorValue, saveCode } = useModifyEditor();
  const { updateProblemToStale } = useModifyStale();
  const { fireAlertModal } = useModifyAlertModal();
  const { fireConfirmModal } = useModifyConfirmModal();

  const handleSetDefaultButtonClick = useCallback(() => {
    fireConfirmModal('현재 코드를 기본 코드로 저장하시겠습니까?', async () => {
      saveCode(problem, editorLanguage);
      updateProblemToStale(problem, editorLanguage, false);

      const result = await window.electron.ipcRenderer.invoke('save-default-code', {
        data: { language: editorLanguage, code: getEditorValue(problem, editorLanguage) || '' },
      });

      if (result && result.data.isSaved) {
        fireAlertModal('안내', `default.${languageToExt(editorLanguage)} 파일이 성공적으로 업데이트 되었습니다.`);
      }
    });
  }, [fireAlertModal, fireConfirmModal, getEditorValue, saveCode, updateProblemToStale, problem, editorLanguage]);

  return (
    <ActionButton onClick={handleSetDefaultButtonClick} disabled={!problem}>
      기본 코드 저장
    </ActionButton>
  );
}
