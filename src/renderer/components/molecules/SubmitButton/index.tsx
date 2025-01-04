import { useConfirmModalController } from '@/renderer/hooks';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function SubmitButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const { fireConfirmModal } = useConfirmModalController();

  const handleSubmitButtonClick = () => {
    if (!problem) {
      return;
    }

    fireConfirmModal('제출하시겠습니까?', () => {
      const { code, lang } = useStore.getState();

      window.electron.ipcRenderer.sendMessage('submit-code', {
        data: {
          code,
          language: lang,
          number: problem.number,
        },
      });
    });
  };

  return (
    <ActionButton onClick={handleSubmitButtonClick} disabled={!problem}>
      제출
    </ActionButton>
  );
}
