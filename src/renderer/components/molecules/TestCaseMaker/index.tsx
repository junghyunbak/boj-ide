import { useEffect, useMemo, useState } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';

import { useProblem, useModifyAlertModal, useTestcase } from '@/renderer/hooks';

import { TextArea } from '@/renderer/components/atoms/textareas/TextArea';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { TextInput } from '@/renderer/components/atoms/inputs/TextInput';
import { ThreeLineHorizontalResizer } from '@/renderer/components/atoms/lines/ThreeLineHorizontalResizer';

import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';

// [v]: 문제 번호가 작성되어있다면 테스트케이스 추가 버튼이 활성화되어있어야 한다.
// [v]: 문제가 초기화 되어있지 않다면, 테스트케이스 추가 버튼을 누를 수 없어야 한다
// [v]: 문제가 초기화 되어있지만 표준 입/출력이 비어있다면, 테스트케이스 추가 버튼을 눌렀을 때 에러 메세지를 출력해야한다.
export function TestCaseMaker() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [problemNumber, setProblemNumber] = useState('');

  const { problem } = useProblem();
  const { addCustomTestcase } = useTestcase();
  const { fireAlertModal } = useModifyAlertModal();

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

    window.electron.ipcRenderer.sendMessage('log-add-testcase', {
      data: {
        number: problemNumber,
        language: useStore.getState().lang,
      },
    });

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

  const splitLayoutPxOption = useMemo(() => ({ min: 100 }), []);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      `}
    >
      <SplitLayout vertical>
        <SplitLayout.Left px={splitLayoutPxOption}>
          <div
            css={css`
              height: 100%;
              display: flex;
              gap: 0.5rem;
            `}
          >
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예제 입력"
              disabled={disabled}
              style={{ minHeight: '100px' }}
            />
            <TextArea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="예제 출력"
              disabled={disabled}
              style={{ minHeight: '100px' }}
            />
          </div>
        </SplitLayout.Left>

        <SplitLayout.Resizer>
          <ThreeLineHorizontalResizer />
        </SplitLayout.Resizer>

        <SplitLayout.Right>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            `}
          >
            {!problem && <TextInput value={problemNumber} onChange={handleInputTextChange} />}

            <ActionButton onClick={handleAddTestCaseButtonClick} disabled={disabled}>
              테스트케이스 추가
            </ActionButton>
          </div>
        </SplitLayout.Right>
      </SplitLayout>
    </div>
  );
}
