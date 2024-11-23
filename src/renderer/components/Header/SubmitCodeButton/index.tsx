import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';
import { SubmitButton } from '../../core/button/SubmitButton';

export function SubmitCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setConfirm] = useStore(useShallow((s) => [s.setConfirm]));

  const handleSubmitCodeButtonClick = () => {
    if (!problem) {
      return;
    }

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
    <SubmitButton onClick={handleSubmitCodeButtonClick} disabled={!problem}>
      제출
    </SubmitButton>
  );
}
