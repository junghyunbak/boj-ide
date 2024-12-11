import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';
import { SubmitButton } from '../../core/button/SubmitButton';

export function ExecuteCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [isJudging, setIsJudging] = useStore(useShallow((s) => [s.isJudging, s.setIsJudging]));
  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [customTestCase] = useStore(useShallow((s) => [s.customTestCase]));

  const handleSubmitButtonClick = () => {
    if (!problem) {
      return;
    }

    setIsJudging(true);

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
    <SubmitButton onClick={handleSubmitButtonClick} disabled={!problem || isJudging}>
      코드 실행
    </SubmitButton>
  );
}
