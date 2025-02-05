import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { createMockTestcase, createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { useTestcase } from '.';

const mockProblem = createMockProblem();
const mockTestcase = createMockTestcase();
const mockTestcase2 = createMockTestcase();

beforeEach(() => {
  const { setProblem, setCustomTestcases } = useStore.getState();

  setProblem(mockProblem);
  setCustomTestcases(() => ({
    [mockProblem.number]: [mockTestcase, mockTestcase2],
  }));
});

describe('[커스텀 훅] 커스텀 테스트케이스를 관리하는 훅', () => {
  it('테스트케이스를 추가할 경우, 추가한 테스트케이스가 존재해야한다.', () => {
    const { result } = renderHook(() => useTestcase());

    let isSuccess: boolean | null = null;

    const newMockTestcase = createMockTestcase();

    act(() => {
      isSuccess = result.current.addCustomTestcase(newMockTestcase);
    });

    expect(isSuccess).toBe(true);
    expect(
      result.current.customTestcase[mockProblem.number]?.some((testcase) => testcase.input === newMockTestcase.input),
    ).toBe(true);
  });

  it('문제 페이지가 아닌 상황에서 테스트케이스를 추가 할 경우, 입력된 문제 번호로 테스트케이스가 추가되어야 한다.', () => {
    const { result } = renderHook(() => useTestcase());

    useStore.getState().setProblem(null);

    const newMockTestcase = createMockTestcase();
    const problemNumber = '0';

    let isSuccess: boolean | null = null;

    act(() => {
      isSuccess = result.current.addCustomTestcase(newMockTestcase, problemNumber);
    });

    expect(isSuccess).toBe(true);
    expect(
      result.current.customTestcase[problemNumber]?.some((testcase) => testcase.input === newMockTestcase.input),
    ).toBe(true);
  });

  it('범위 내 테스트케이스를 삭제할 경우, 삭제 결과가 true 이며 해당 테스트케이스가 존재하지 않아야 한다.', () => {
    const { result } = renderHook(() => useTestcase());

    let isSuccess: boolean | null = null;

    const removeIdx = 0;
    const removeMockTestcase = (result.current.customTestcase[mockProblem.number] as (TC | undefined)[])[removeIdx];

    act(() => {
      isSuccess = result.current.removeCustomTestcase(removeIdx);
    });

    expect(isSuccess).toBe(true);
    expect(
      typeof removeMockTestcase === 'object' &&
        !result.current.customTestcase[mockProblem.number]?.some(
          (testcase) => testcase.input === removeMockTestcase.input,
        ),
    ).toBe(true);
  });

  it('범위 밖 테스트케이스를 삭제할 경우, 삭제 결과가 false 이며 개수가 그대로여야 한다.', () => {
    const { result } = renderHook(() => useTestcase());

    let isSuccess: boolean | null = null;

    const removeIdx = 100;
    const testcaseCount = result.current.customTestcase[mockProblem.number]?.length || 0;

    act(() => {
      isSuccess = result.current.removeCustomTestcase(removeIdx);
    });

    expect(isSuccess).toBe(false);
    expect(result.current.customTestcase[mockProblem.number]?.length === testcaseCount).toBe(true);
  });
});
