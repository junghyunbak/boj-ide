import { useCallback, useState } from 'react';

import { css } from '@emotion/react';

import { useProblem, useModifyAlertModal, useModifyTestcase, useTestcase, useLanguage } from '@/renderer/hooks';

import { TextArea } from '@/renderer/components/atoms/textareas/TextArea';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { TextInput } from '@/renderer/components/atoms/inputs/TextInput';

export function TestCaseMaker() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const { problem } = useProblem();
  const { language } = useLanguage();
  const { testcaseInputProblemNumber } = useTestcase();

  const { addCustomTestcase, updateTestcaseInputProblemNumber } = useModifyTestcase();
  const { fireAlertModal } = useModifyAlertModal();

  const handleAddTestCaseButtonClick = useCallback(() => {
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
        number: testcaseInputProblemNumber,
        language,
      },
    });

    addCustomTestcase(item, testcaseInputProblemNumber);

    setInput('');
    setOutput('');
  }, [addCustomTestcase, fireAlertModal, language, input, output, testcaseInputProblemNumber]);

  const handleInputTextChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (!/^[0-9]*$/.test(e.target.value)) {
        return;
      }

      updateTestcaseInputProblemNumber(e.target.value);
    },
    [updateTestcaseInputProblemNumber],
  );

  const disabled = problem === null && testcaseInputProblemNumber === '';

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
          min-height: 100px;
        `}
      >
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예제 입력"
          disabled={disabled}
          css={css`
            flex: 1;
            height: auto;
            min-height: 100px;
            resize: vertical;
          `}
        />
        <TextArea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="예제 출력"
          disabled={disabled}
          css={css`
            flex: 1;
            height: auto;
            min-height: 100px;
          `}
        />
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        `}
      >
        {!problem && <TextInput value={testcaseInputProblemNumber} onChange={handleInputTextChange} />}

        <ActionButton onClick={handleAddTestCaseButtonClick} disabled={disabled}>
          테스트케이스 추가
        </ActionButton>
      </div>
    </div>
  );
}
