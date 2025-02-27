/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import { getElementFromChildren } from '@/renderer/utils';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';

import {
  TestcaseDetailExampleLayout,
  TestcaseDetailExampleTitleBox,
  TestcaseDetailExampleTitleLayout,
  TestcaseDetailExampleTitleParagraph,
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

    return (
      <TestcaseDetailExampleContextProvider value={{ type, value, setValue, isEditing, setIsEditing }}>
        <TestcaseDetailExampleLayout>
          <TestcaseDetailExampleTitleLayout>
            <TestcaseDetailExampleTitleBox>
              <TestcaseDetailExampleTitleParagraph>예제 {type}</TestcaseDetailExampleTitleParagraph>
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
