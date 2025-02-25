/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

import { getElementFromChildren } from '@/renderer/utils';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';

import {
  TestcaseDetailExampleLayout,
  TestcaseDetailExampleTitleBox,
  TestcaseDetailExampleTitleLayout,
} from './index.style';

import { TestcaseDetailExampleContextProvider } from './TestcaseDetailExampleContext';
import { TestcaseDetailExampleCopy } from './TestcaseDetailExampleCopy';
import { TestcaseDetailExampleContent } from './TestcaseDetailExampleContent';
import { TestcaseDetailExampleEdit } from './TestcaseDetailExampleEdit';

const TestcaseDetailExampleCopyType = (<TestcaseDetailExampleCopy />).type;
const TestcaseDetailExmapleEditType = (<TestcaseDetailExampleEdit idx={-1} />).type;

interface TestcaseDetailExampleProps {
  initValue: string;
}

const TestcaseDetailExampleImpl = (type: '입력' | '출력') =>
  function ({ initValue, children }: React.PropsWithChildren<TestcaseDetailExampleProps>) {
    const [value, setValue] = useState(initValue);
    const [isEditing, setIsEditing] = useState(false);

    const ExampleCopy = getElementFromChildren(children, TestcaseDetailExampleCopyType);
    const ExampleEdit = getElementFromChildren(children, TestcaseDetailExmapleEditType);

    /**
     * 테스트케이스 추가/삭제로 인해 initValue가 변경될 수 있으므로, 업데이트 해야한다.
     */
    useEffect(() => {
      setValue(initValue);
    }, [initValue]);

    return (
      <TestcaseDetailExampleContextProvider value={{ type, value, setValue, isEditing, setIsEditing }}>
        <TestcaseDetailExampleLayout>
          <TestcaseDetailExampleTitleLayout>
            <TestcaseDetailExampleTitleBox>
              <Text fontSize="1.25rem">예제 {type}</Text>
              {ExampleCopy}
              {ExampleEdit}
            </TestcaseDetailExampleTitleBox>
          </TestcaseDetailExampleTitleLayout>

          <TestcaseDetailExampleContent />
        </TestcaseDetailExampleLayout>
      </TestcaseDetailExampleContextProvider>
    );
  };

export const TestcaseDetailExampleInput = Object.assign(TestcaseDetailExampleImpl('입력'), {
  TestcaseDetailExampleCopy,
  TestcaseDetailExampleEdit,
});

export const TestcaseDetailExampleOuptut = Object.assign(TestcaseDetailExampleImpl('출력'), {
  TestcaseDetailExampleCopy,
  TestcaseDetailExampleEdit,
});
