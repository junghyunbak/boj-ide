import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { createMockTestcase, createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { useTestcase } from '.';

const problem = createMockProblem();
const mockTestcase = createMockTestcase();
const mockTestcase2 = createMockTestcase();

beforeEach(() => {
  const { setProblem, setCustomTestcases } = useStore.getState();

  setProblem(problem);
  setCustomTestcases(() => ({
    [problem.number]: [mockTestcase, mockTestcase2],
  }));
});

describe('[커스텀 훅] 커스텀 테스트케이스 추가/삭제', () => {
  it('테스트케이스 추가', () => {
    const { result } = renderHook(() => useTestcase());

    let isSuccess = false;

    const newMockTestcase = createMockTestcase();

    act(() => {
      isSuccess = result.current.addCustomTestcase(newMockTestcase);
    });

    expect(isSuccess).toBe(true);
    expect(
      result.current.customTestcase[problem.number]?.some((testcase) => testcase.input === newMockTestcase.input),
    ).toBe(true);
  });

  it('테스트케이스 삭제 (범위 안)', () => {
    const { result } = renderHook(() => useTestcase());

    let isSuccess = false;

    const removeIdx = 0;
    const removeMockTestcase = (result.current.customTestcase[problem.number] as (TC | undefined)[])[removeIdx];

    act(() => {
      isSuccess = result.current.removeCustomTestcase(removeIdx);
    });

    expect(isSuccess).toBe(true);
    expect(
      typeof removeMockTestcase === 'object' &&
        !result.current.customTestcase[problem.number]?.some((testcase) => testcase.input === removeMockTestcase.input),
    ).toBe(true);
  });

  it('테스트케이스 삭제 (범위 밖)', () => {
    const { result } = renderHook(() => useTestcase());

    let isSuccess = false;

    const removeIdx = 100;
    const testcaseCount = result.current.customTestcase[problem.number]?.length || 0;

    act(() => {
      isSuccess = result.current.removeCustomTestcase(removeIdx);
    });

    expect(isSuccess).toBe(false);
    expect(result.current.customTestcase[problem.number]?.length === testcaseCount).toBe(true);
  });
});
