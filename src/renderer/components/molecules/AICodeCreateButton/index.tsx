import { useEffect } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useStreamingAICode } from '@/renderer/hooks';
import { AI_ERROR_MESSAGE } from '@/constants';

export function AICodeCreateButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setConfirm] = useStore(useShallow((s) => [s.setConfirm]));
  const [setCode] = useStore(useShallow((s) => [s.setCode]));
  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const { complete, completion, error, isLoading } = useStreamingAICode();

  useEffect(() => {
    if (error) {
      setMessage(AI_ERROR_MESSAGE);
    }
  }, [error, setMessage]);

  useEffect(() => {
    setCode(completion);
  }, [completion, setCode]);

  const handleAICodeCreateButtonClick = () => {
    setConfirm('기존의 코드가 삭제됩니다.\n계속하시겠습니까?', async () => {
      if (!problem) {
        return;
      }

      setCode('');

      const { lang } = useStore.getState();

      complete('', {
        body: {
          inputs: problem.testCase.inputs,
          inputDesc: problem.inputDesc,
          language: lang,
        },
      });
    });
  };

  return (
    <ActionButton onClick={handleAICodeCreateButtonClick} variant="secondary" disabled={!problem}>
      {`AI 입력 생성${isLoading ? '중...' : ''}`}
    </ActionButton>
  );
}
