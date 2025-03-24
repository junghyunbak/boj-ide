import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { TransparentPreformatted } from '@/renderer/components/atoms/pres/TransparentPreformatted';

import { useTestcaseContext } from '../../TestcaseContext';

import {
  TestcaseDetailResultTable,
  TestcaseDetailResultTableBody,
  TestcaseDetailResultTableData,
  TestcaseDetailResultTableRow,
} from './index.style';

import { TestcaseElapsed } from '../../TestcaseElapsed';

export function TestcaseDetailResult() {
  const { judgeResult } = useTestcaseContext();

  if (!judgeResult) {
    return null;
  }

  return (
    <TestcaseDetailResultTable data-testid="result-table">
      <TestcaseDetailResultTableBody>
        <TestcaseDetailResultTableRow>
          <TestcaseDetailResultTableData>결과</TestcaseDetailResultTableData>
          <TestcaseDetailResultTableData>
            <Text type={judgeResult.result} fontWeight={judgeResult.result === '맞았습니다!!' ? 'bold' : 'normal'}>
              {judgeResult?.result}
            </Text>
          </TestcaseDetailResultTableData>
        </TestcaseDetailResultTableRow>

        <TestcaseDetailResultTableRow>
          <TestcaseDetailResultTableData>실행 시간</TestcaseDetailResultTableData>
          <TestcaseDetailResultTableData>
            <TestcaseElapsed />
          </TestcaseDetailResultTableData>
        </TestcaseDetailResultTableRow>

        <TestcaseDetailResultTableRow>
          <TestcaseDetailResultTableData>출력</TestcaseDetailResultTableData>
          <TestcaseDetailResultTableData>
            <TransparentPreformatted>{judgeResult.stdout}</TransparentPreformatted>
          </TestcaseDetailResultTableData>
        </TestcaseDetailResultTableRow>

        {judgeResult.stderr && (
          <TestcaseDetailResultTableRow>
            <TestcaseDetailResultTableData>에러</TestcaseDetailResultTableData>
            <TestcaseDetailResultTableData>
              <TransparentPreformatted>{judgeResult.stderr}</TransparentPreformatted>
            </TestcaseDetailResultTableData>
          </TestcaseDetailResultTableRow>
        )}
      </TestcaseDetailResultTableBody>
    </TestcaseDetailResultTable>
  );
}
