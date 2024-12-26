import { useCompletion } from 'ai/react';
import { useEffect } from 'react';
import { SubmitButton } from '@/renderer/components/core/button/SubmitButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function AICreateButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setConfirm] = useStore(useShallow((s) => [s.setConfirm]));
  const [setCode] = useStore(useShallow((s) => [s.setCode]));
  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const { complete, completion, isLoading, error } = useCompletion({
    api:
      process.env.NODE_ENV === 'production'
        ? 'https://boj-ide.junghyunbak.site/api/ai/template'
        : 'http://localhost:3000/api/ai/template',
    experimental_throttle: 50,
  });

  useEffect(() => {
    if (error) {
      setMessage(`## ️오류 발생\n### 원인\n1. AI 서버 문제 발생\n2. AI 사용량 한도초과`);
    }
  }, [error, setMessage]);

  useEffect(() => {
    setCode(completion);
  }, [completion, setCode]);

  return (
    <SubmitButton
      type="button"
      secondary
      onClick={() => {
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
      }}
    >
      {`AI 입력 생성${isLoading ? '중..' : ''}`}
    </SubmitButton>
  );
}
