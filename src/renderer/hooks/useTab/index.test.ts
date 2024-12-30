import { renderHook } from '@testing-library/react';
import { useStore } from '@/renderer/store';
import { act } from 'react';
import { createMockProblem } from '@/renderer/mock';
import { useTab } from '.';

const mockProblem = createMockProblem();
const mockProblem2 = createMockProblem();

beforeAll(() => {
  useStore.getState().setProblem(mockProblem);
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
