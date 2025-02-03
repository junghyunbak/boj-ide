import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { createMockProblem } from '@/renderer/mock';

import { useProblem } from '.';

const mockProblem = createMockProblem();

describe('[커스텀훅] 현재 활성화 된 문제 상태를 관리하는 훅', () => {
  it('새로운 문제로 초기화 될 경우, 문제 상태가 업데이트 되어야 한다.', () => {
    const { result } = renderHook(() => useProblem());

    act(() => {
      result.current.updateProblem(mockProblem);
    });

    expect(result.current.problem?.number === mockProblem.number).toBe(true);
  });

  it('기존과 동일한 문제로 초기화 될 경우, 내용이 갱신되어야 한다.', () => {
    const { result } = renderHook(() => useProblem());

    const sameNumberMockProblem = createMockProblem({ number: mockProblem.number });

    act(() => {
      result.current.updateProblem(sameNumberMockProblem);
    });

    expect(result.current.problem?.name === mockProblem.name).toBe(true);
    expect(result.current.problem?.inputDesc === sameNumberMockProblem.inputDesc).toBe(true);
  });

  it('문제 선택이 해제 될 경우, null로 업데이트 되어야 한다.', () => {
    const { result } = renderHook(() => useProblem());

    act(() => {
      result.current.updateProblem(null);
    });

    expect(result.current.problem === null).toBe(true);
  });
});
