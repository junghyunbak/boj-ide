import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function SubmitButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setConfirm] = useStore(useShallow((s) => [s.setConfirm]));
  //const [setSubmitState] = useStore(useShallow((s) => [s.setSubmitState]));

  const handleSubmitButtonClick = () => {
    if (!problem) {
      return;
    }

    // [ ]: 제출 코드 구현
    // [ ]: 훅으로 분리
    setConfirm('제출하시겠습니까?', () => {
      /*
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
      */
    });
  };

  return (
    <ActionButton onClick={handleSubmitButtonClick} disabled={!problem}>
      제출
    </ActionButton>
  );
}
