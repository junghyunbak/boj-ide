import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useStore } from '@/renderer/store';
import { TestCase } from '.';

const mockProblem: ProblemInfo = {
  name: 'A + B',
  number: '1000',
  testCase: {
    inputs: [],
    outputs: [],
  },
};

const mockJudgeResult: JudgeResult = {
  id: '',
  index: 0,
  result: '맞았습니다!!',
  stderr: '',
  stdout: '',
  elapsed: 0,
};

beforeAll(() => {
  useStore.getState().setProblem(mockProblem);
});

describe("[type === 'problem']", () => {
  it('삭제 버튼이 존재하지 않아야 한다.', () => {
    render(
      <table>
        <tbody>
          <TestCase type="problem" i={0} input="" output="" />
        </tbody>
      </table>,
    );

    expect(screen.queryByTestId('remove-testcase')).not.toBeInTheDocument();
  });

  it('예제 컬럼의 값이 "예제 입력 [숫자]" 이어야 한다.', () => {
    render(
      <table>
        <tbody>
          <TestCase type="problem" i={0} input="" output="" />
        </tbody>
      </table>,
    );

    expect(screen.queryByText(/^예제 입력 [0-9]+$/)).toBeInTheDocument();
  });
});

describe("[type === 'custom']", () => {
  it('삭제 버튼이 존재해야한다.', () => {
    render(
      <table>
        <tbody>
          <TestCase type="custom" i={0} judgeResult={mockJudgeResult} input="" output="" />
        </tbody>
      </table>,
    );

    expect(screen.queryByTestId('remove-testcase')).toBeInTheDocument();
  });

  it('예제 컬럼의 값이 "사용자 예제 입력 [숫자]" 이어야 한다.', () => {
    render(
      <table>
        <tbody>
          <TestCase type="custom" i={0} input="" output="" />
        </tbody>
      </table>,
    );

    expect(screen.queryByText(/^사용자 예제 입력 [0-9]+$/)).toBeInTheDocument();
  });
});

describe("[type === 'common']", () => {
  it('열기 버튼을 누르면 예제 입/출력이 나타난다.', () => {
    render(
      <table>
        <tbody>
          <TestCase type="problem" i={0} input="example1" output="" />
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByText('열기'));

    expect(screen.queryByText('example1')).toBeInTheDocument();
  });

  it('열기 버튼을 누르고 채점 결과가 존재할 경우, 실행 결과를 표시하는 테이블이 렌더링 되어야한다.', () => {
    render(
      <table>
        <tbody>
          <TestCase type="problem" i={0} input="예제 입력" output="" judgeResult={mockJudgeResult} />
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByText('열기'));

    expect(screen.queryByText('결과')).toBeInTheDocument();
  });
});
