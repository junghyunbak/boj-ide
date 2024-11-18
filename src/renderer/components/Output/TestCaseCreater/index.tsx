import { useState } from 'react';
import { css } from '@emotion/css';
import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';

interface TestCaseCreatorProps {
  problemNumber: string;
}

export function TestCaseCreator({ problemNumber }: TestCaseCreatorProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const [addCustomTestCase] = useStore(useShallow((s) => [s.addCustomTestCase]));

  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  return (
    <div
      className={css`
        width: 100%;
        border-top: 1px solid lightgray;
        margin-top: 1rem;
        padding: 1rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 0.5rem;
      `}
    >
      <div
        className={css`
          display: flex;
          gap: 0.5rem;

          textarea {
            width: 50%;
            min-height: 100px;
            resize: none;
            font-size: 18px;
            line-height: 1.4;
            font-family: 'menlo';
            border: 1px solid lightgray;
            background-color: #f7f7f9;
            padding: 0.5rem;
          }
        `}
      >
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="예제 입력" />
        <textarea value={output} onChange={(e) => setOutput(e.target.value)} placeholder="예제 출력" />
      </div>

      <button
        type="button"
        className={css`
          border: none;
          background-color: #428bca;
          color: white;
          font-weight: 500;
          padding: 0.5rem;
          cursor: pointer;
        `}
        onClick={() => {
          const item: TC = {
            input,
            output,
            type: 'custom',
          };

          if (!input || !output) {
            setMessage('입력과 출력을 모두 입력하세요.');

            return;
          }

          addCustomTestCase(problemNumber, item);

          setInput('');
          setOutput('');
        }}
      >
        테스트케이스 추가
      </button>
    </div>
  );
}
