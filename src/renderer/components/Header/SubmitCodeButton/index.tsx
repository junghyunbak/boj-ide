import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { SubmitButton } from '@/renderer/components/core/button/SubmitButton';
import { v4 as uuidv4 } from 'uuid';

export function SubmitCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setConfirm] = useStore(useShallow((s) => [s.setConfirm]));
  const [setSubmitState] = useStore(useShallow((s) => [s.setSubmitState]));
  const [setSubmitListIsOpen] = useStore(useShallow((s) => [s.setSubmitListIsOpen]));

  const handleSubmitCodeButtonClick = () => {
    if (!problem) {
      return;
    }

    setConfirm('제출하시겠습니까?', () => {
      const { code, lang } = useStore.getState();

      const id = uuidv4();

      setSubmitState((prev) => {
        const next = { ...prev };

        next[id] = { problemNumber: problem.number, gage: 0, resultText: '', language: lang };

        return next;
      });

      setSubmitListIsOpen(true);

      window.electron.ipcRenderer.sendMessage('submit-code', {
        data: {
          id,
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
