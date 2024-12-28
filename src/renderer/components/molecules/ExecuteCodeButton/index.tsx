import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function ExecuteCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [isJudging, setIsJudging] = useStore(useShallow((s) => [s.isJudging, s.setIsJudging]));
  const [setIsCodeStale] = useStore(useShallow((s) => [s.setIsCodeStale]));
  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [customTestCase] = useStore(useShallow((s) => [s.customTestCase]));

  const handleExecuteButtonClick = () => {
    if (!problem) {
      return;
    }

    setIsJudging(true);
    setIsCodeStale(false); // [ ]: 코드를 저장하는 로직은 없지만 백엔드에서 처리되고 있으므로 일단 stale 처리함.
    setJudgeResult(() => []);

    const inputs: string[] = [];
    const outputs: string[] = [];

    for (let i = 0; i < problem.testCase.inputs.length; i += 1) {
      inputs.push(problem.testCase.inputs[i]);
      outputs.push(problem.testCase.outputs[i]);
    }

    customTestCase[problem.number]?.forEach(({ input, output }) => {
      inputs.push(input);
      outputs.push(output);
    });

    const { code, lang } = useStore.getState();

    window.electron.ipcRenderer.sendMessage('judge-start', {
      data: {
        code,
        language: lang,
        number: problem.number,
        name: problem.name,
        testCase: {
          inputs,
          outputs,
        },
      },
    });
  };

  return (
    <ActionButton onClick={handleExecuteButtonClick} disabled={!problem || isJudging}>
      코드 실행
    </ActionButton>
  );
}
