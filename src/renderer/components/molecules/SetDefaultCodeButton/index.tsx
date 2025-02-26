import { useAlertModalController, useConfirmModalController, useEditorController, useProblem } from '@/renderer/hooks';

import { useStore } from '@/renderer/store';

import { languageToExt } from '@/renderer/utils';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function SetDefaultCodeButton() {
  const { problem } = useProblem();
  const { getProblemCode, saveEditorCode } = useEditorController();
  const { fireConfirmModal } = useConfirmModalController();
  const { fireAlertModal } = useAlertModalController();

  const handleSetDefaultButtonClick = () => {
    fireConfirmModal('현재 코드를 기본 코드로 저장하시겠습니까?', async () => {
      const { lang } = useStore.getState();

      const result = await window.electron.ipcRenderer.invoke('save-default-code', {
        data: { language: lang, code: getProblemCode() },
      });

      saveEditorCode({ silence: true });

      if (result && result.data.isSaved) {
        fireAlertModal('안내', `default.${languageToExt(lang)} 파일이 성공적으로 업데이트 되었습니다.`);
      }
    });
  };

  return (
    <ActionButton onClick={handleSetDefaultButtonClick} disabled={!problem}>
      기본 코드로 설정
    </ActionButton>
  );
}
