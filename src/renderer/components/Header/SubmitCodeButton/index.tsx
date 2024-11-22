import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';
import { SubmitButton } from '../../core/button/SubmitButton';

export function SubmitCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const handleSubmitCodeButtonClick = () => {
    if (!problem) {
      return;
    }

    const { code, lang } = useStore.getState();

    window.electron.ipcRenderer.sendMessage('submit-code', {
      data: {
        code,
        language: lang,
        number: problem.number,
      },
    });
  };

  return (
    <SubmitButton onClick={handleSubmitCodeButtonClick} disabled={!problem}>
      제출
    </SubmitButton>
  );
}
