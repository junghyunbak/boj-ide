import { renderHook } from '@testing-library/react';
import { useStore } from '@/renderer/store';
import { useProblem } from '.';

const mockProblem: ProblemInfo = {
  name: 'A + B',
  number: '1000',
  testCase: {
    inputs: [],
    outputs: [],
  },
};

const mockCustomTestcase: TC = {
  input: '',
  output: '',
  type: 'custom',
};

beforeAll(() => {
  useStore.getState().setProblem(mockProblem);
});

describe('커스텀 테스트케이스 추가/삭제', () => {
  it('addCustomTestcase', () => {
    const {
      result: {
        current: { addCustomTestcase },
      },
    } = renderHook(() => useProblem());

    addCustomTestcase(mockCustomTestcase);

    const { customTestCase } = useStore.getState();

    expect(customTestCase[mockProblem.number] instanceof Array).toBe(true);
  });

  it('removeCustomTestcase', () => {
    const {
      result: {
        current: { removeCustomTestcase },
      },
    } = renderHook(() => useProblem());

    const { setCustomTestcases } = useStore.getState();

    setCustomTestcases(() => {
      return {
        '1000': [
          {
            input: '1',
            output: '1',
            type: 'custom',
          },
          {
            input: '2',
            output: '2',
            type: 'custom',
          },
          {
            input: '3',
            output: '3',
            type: 'custom',
          },
        ],
      };
    });

    removeCustomTestcase(1);

    expect(useStore.getState().customTestCase[mockProblem.number]?.some((v) => v.input === '2')).toBe(false);
  });
});
