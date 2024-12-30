import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function SubmitButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setConfirm] = useStore(useShallow((s) => [s.setConfirm]));

  const handleSubmitButtonClick = () => {
    if (!problem) {
      return;
    }

    // TODO: 훅으로 분리
    setConfirm('제출하시겠습니까?', () => {
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
