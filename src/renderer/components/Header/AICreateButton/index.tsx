import { useCompletion } from 'ai/react';
import { useEffect } from 'react';
import { SubmitButton } from '@/renderer/components/core/button/SubmitButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function AICreateButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setConfirm] = useStore(useShallow((s) => [s.setConfirm]));
  const [setCode] = useStore(useShallow((s) => [s.setCode]));

  const { complete, completion, isLoading } = useCompletion({
    api: 'https://boj-ide.junghyunbak.site/api/ai/template',
    experimental_throttle: 50,
  });

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
