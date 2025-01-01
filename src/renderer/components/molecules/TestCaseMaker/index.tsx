import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { TextArea } from '@/renderer/components/atoms/textareas/TextArea';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { TextInput } from '@/renderer/components/atoms/inputs/TextInput';
import { useProblem, useAlertModalController } from '@/renderer/hooks';

// <유닛 테스트>
// [ ]: 문제 번호가 작성되어있다면 테스트케이스 추가 버튼이 활성화되어있어야 한다.
// [v]: 문제가 초기화 되어있지 않다면, 테스트케이스 추가 버튼을 누를 수 없어야 한다
// [v]: 문제가 초기화 되어있지만 표준 입/출력이 비어있다면, 테스트케이스 추가 버튼을 눌렀을 때 에러 메세지를 출력해야한다.
export function TestCaseMaker() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [problemNumber, setProblemNumber] = useState('');

  const { problem, addCustomTestcase } = useProblem();
  const { fireAlertModal } = useAlertModalController();

  useEffect(() => {
    if (problem) {
      setProblemNumber(problem.number);
    }
  }, [problem]);

  const handleAddTestCaseButtonClick = () => {
    const item: TC = {
      input,
      output,
      type: 'custom',
    };

    if (!input || !output) {
      fireAlertModal('안내', '입력과 출력을 모두 입력하세요.');
      return;
    }

    addCustomTestcase(item, problemNumber);

    setInput('');
    setOutput('');
  };

  const handleInputTextChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!/^[0-9]*$/.test(e.target.value)) {
      return;
    }

    setProblemNumber(e.target.value);
  };

  const disabled = problem === null && problemNumber === '';

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 0.5rem;
        `}
      >
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예제 입력"
          disabled={disabled}
        />
        <TextArea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="예제 출력"
          disabled={disabled}
        />
      </div>

      <div
        css={css`
          display: flex;
          gap: 0.5rem;
          align-items: center;
        `}
      >
        {!problem && (
          <div
            css={css`
              width: 20%;
            `}
          >
            <TextInput value={problemNumber} onChange={handleInputTextChange} />
          </div>
        )}

        <div
          css={css`
            flex: 1;
            display: flex;
            flex-direction: column;

            background-color: black;
          `}
        >
          <ActionButton onClick={handleAddTestCaseButtonClick} disabled={disabled}>
            테스트케이스 추가
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
