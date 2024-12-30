import { css } from '@emotion/react';
import { useState } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { TextArea } from '@/renderer/components/atoms/textareas/TextArea';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useProblem } from '@/renderer/hooks';

export function TestCaseMaker() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const { problem, addCustomTestcase } = useProblem();

  // [ ]: 얘도 커스텀 훅으로
  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const handleAddTestCaseButtonClick = () => {
    const item: TC = {
      input,
      output,
      type: 'custom',
    };

    if (!input || !output) {
      setMessage('입력과 출력을 모두 입력하세요.');
      return;
    }

    addCustomTestcase(item);

    setInput('');
    setOutput('');
  };

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
          disabled={!problem}
        />
        <TextArea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="예제 출력"
          disabled={!problem}
        />
      </div>
      <ActionButton onClick={handleAddTestCaseButtonClick} disabled={!problem}>
        테스트케이스 추가
      </ActionButton>
    </div>
  );
}
