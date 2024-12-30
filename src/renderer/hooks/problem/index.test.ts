import { renderHook } from '@testing-library/react';
import { useStore } from '@/renderer/store';
import { act } from 'react';
import { useProblem, useTab } from '.';

const mockProblem: ProblemInfo = {
  name: 'A + B',
  number: '1000',
  testCase: {
    inputs: [],
    outputs: [],
  },
};

const mockProblem2: ProblemInfo = {
  name: 'A - B',
  number: '1001',
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

describe('탭 요소 추가', () => {
  it('탭의 끝에 탭 요소가 추가된다.', () => {
    const { result } = renderHook(() => useTab());

    act(() => {
      result.current.addTab(mockProblem);
    });

    expect(result.current.tabs.length === 1).toBe(true);
  });

  it('이미 존재하는 탭을 추가 할 경우 그대로 유지된다.', () => {
    const { result } = renderHook(() => useTab());

    act(() => {
      result.current.addTab(mockProblem);
      result.current.addTab(mockProblem);
    });

    expect(result.current.tabs.length === 1).toBe(true);
  });
});

describe('탭 요소 삭제', () => {
  describe('[탭 개수 === 1]', () => {
    it('남아있는 하나의 탭을 삭제할 경우, 탭 크기가 0, null를 반환한다.', () => {
      const {
        result: {
          current: { addTab, removeTab },
        },
      } = renderHook(() => useTab());

      addTab(mockProblem);

      const problem = removeTab(0);

      const { problemHistories: tabs } = useStore.getState();

      expect(tabs.length === 0 && problem === null).toBe(true);
    });
  });

  describe('[탭 개수 >= 2]', () => {
    it('마지막 탭을 삭제할 경우, 탭 크기가 1줄고 마지막 탭 정보를 반환한다.', () => {
      const {
        result: {
          current: { addTab, removeTab },
        },
      } = renderHook(() => useTab());

      addTab(mockProblem);
      addTab(mockProblem2);

      const problem = removeTab(1);

      const { problemHistories: tabs } = useStore.getState();

      expect(tabs.length === 1 && problem === mockProblem).toBe(true);
    });

    it('마지막이 아닌 탭을 삭제할 경우, 탭 크기가 1줄고 삭제하기 이전의 다음 탭 정보를 반환한다.', () => {
      const {
        result: {
          current: { addTab, removeTab },
        },
      } = renderHook(() => useTab());

      addTab(mockProblem);
      addTab(mockProblem2);

      const problem = removeTab(0);

      const { problemHistories: tabs } = useStore.getState();

      expect(tabs.length === 1 && problem === mockProblem2).toBe(true);
    });
  });
});
