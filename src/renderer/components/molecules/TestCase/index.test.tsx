import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { useStore } from '@/renderer/store';

import { createMockProblem, createMockJudgeResult } from '@/renderer/mock';

import { Testcase } from '.';

const mockProblem = createMockProblem();
const mockJudgeResult = createMockJudgeResult();

beforeAll(() => {
  useStore.getState().setProblem(mockProblem);
});

describe('[컴포넌트 UI] <Textcase/>', () => {
  it('열기 버튼을 누르면 예제 입/출력이 나타난다.', () => {
    render(
      <table>
        <tbody>
          <Testcase judgeResult={mockJudgeResult}>
            <Testcase.TestcaseTitle num={1} />
            <Testcase.TestcaseResult />
            <Testcase.TestcaseElapsed />

            <Testcase.TestcaseDetail>
              <Testcase.TestcaseDetail.TestcaseDetailExampleInput initValue="example1">
                <Testcase.TestcaseDetail.TestcaseDetailExampleInput.TestcaseDetailExampleCopy />
              </Testcase.TestcaseDetail.TestcaseDetailExampleInput>

              <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut initValue="">
                <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut.TestcaseDetailExampleCopy />
              </Testcase.TestcaseDetail.TestcaseDetailExampleOuptut>

              <Testcase.TestcaseDetail.TestcaseDetailResult />
            </Testcase.TestcaseDetail>
          </Testcase>
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByText('열기'));

    expect(screen.queryByText('example1')).toBeInTheDocument();
  });

  it('열기 버튼을 누른 상태에서 채점 결과가 존재할 경우, 실행 결과를 표시하는 테이블이 렌더링 되어야한다.', () => {
    render(
      <table>
        <tbody>
          <Testcase judgeResult={mockJudgeResult}>
            <Testcase.TestcaseTitle num={1} />
            <Testcase.TestcaseResult />
            <Testcase.TestcaseElapsed />

            <Testcase.TestcaseDetail>
              <Testcase.TestcaseDetail.TestcaseDetailExampleInput initValue="">
                <Testcase.TestcaseDetail.TestcaseDetailExampleInput.TestcaseDetailExampleCopy />
              </Testcase.TestcaseDetail.TestcaseDetailExampleInput>

              <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut initValue="">
                <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut.TestcaseDetailExampleCopy />
              </Testcase.TestcaseDetail.TestcaseDetailExampleOuptut>

              <Testcase.TestcaseDetail.TestcaseDetailResult />
            </Testcase.TestcaseDetail>
          </Testcase>
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByText('열기'));

    expect(screen.queryByText('결과')).toBeInTheDocument();
  });

  it("결과가 '컴파일 에러'인 경우 시간이 출력되지 않아야 한다.", () => {
    const ceMockJudgeResult = createMockJudgeResult({ result: '컴파일 에러' });

    render(
      <table>
        <tbody>
          <Testcase judgeResult={ceMockJudgeResult}>
            <Testcase.TestcaseTitle num={1} />
            <Testcase.TestcaseResult />
            <Testcase.TestcaseElapsed />

            <Testcase.TestcaseDetail>
              <Testcase.TestcaseDetail.TestcaseDetailExampleInput initValue="">
                <Testcase.TestcaseDetail.TestcaseDetailExampleInput.TestcaseDetailExampleCopy />
              </Testcase.TestcaseDetail.TestcaseDetailExampleInput>

              <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut initValue="">
                <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut.TestcaseDetailExampleCopy />
              </Testcase.TestcaseDetail.TestcaseDetailExampleOuptut>

              <Testcase.TestcaseDetail.TestcaseDetailResult />
            </Testcase.TestcaseDetail>
          </Testcase>
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByText('열기'));

    expect(screen.queryByText('ms')).not.toBeInTheDocument();
  });
});
