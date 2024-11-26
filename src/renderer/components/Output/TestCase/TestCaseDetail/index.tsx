import {
  TCDetailBox,
  TCDetailExampleBox,
  TCDetailExamplePre,
  TCDetailResultParagraph,
  TCDetailPre,
  TCDetailTable,
  TCDetailTableBody,
  TCDetailTableData,
  TCDetailTableRow,
} from './index.styles';

interface TestCaseDetailProps {
  isOpen: boolean;
  input: string;
  output: string;
  resultColor: string;
  judgeResult: JudgeResult | undefined;
}

export function TestCaseDetail({ isOpen, input, output, judgeResult, resultColor }: TestCaseDetailProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <TCDetailBox>
      <TCDetailExampleBox>
        <TCDetailExamplePre>{input}</TCDetailExamplePre>
        <TCDetailExamplePre>{output}</TCDetailExamplePre>
      </TCDetailExampleBox>

      {judgeResult && (
        <TCDetailTable>
          <TCDetailTableBody>
            <TCDetailTableRow>
              <TCDetailTableData>결과</TCDetailTableData>

              <TCDetailTableData>
                <TCDetailResultParagraph resultColor={resultColor}>{judgeResult?.result}</TCDetailResultParagraph>
              </TCDetailTableData>
            </TCDetailTableRow>

            <TCDetailTableRow>
              <TCDetailTableData>실행 시간</TCDetailTableData>
              <TCDetailTableData>{`${judgeResult?.elapsed}ms`}</TCDetailTableData>
            </TCDetailTableRow>

            <TCDetailTableRow>
              <TCDetailTableData>출력</TCDetailTableData>

              <TCDetailTableData>
                <TCDetailPre>{judgeResult?.stdout}</TCDetailPre>
              </TCDetailTableData>
            </TCDetailTableRow>

            {judgeResult?.stderr && (
              <TCDetailTableRow>
                <TCDetailTableData>에러</TCDetailTableData>

                <TCDetailTableData>
                  <TCDetailPre>{judgeResult.stderr}</TCDetailPre>
                </TCDetailTableData>
              </TCDetailTableRow>
            )}
          </TCDetailTableBody>
        </TCDetailTable>
      )}
    </TCDetailBox>
  );
}
