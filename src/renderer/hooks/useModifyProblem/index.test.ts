import { act } from 'react';

import { renderHook } from '@testing-library/react';

import { createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { useModifyProblem } from '.';
import { useProblem } from '../useProblem';

const mockProblem = createMockProblem();

beforeEach(() => {
  useStore.getState().setProblem(mockProblem);
});

describe('[Custom Hooks] useProblem', () => {
  it('동일하지 않은 문제번호 객체가 초기화 될 경우, 문제 상태가 갱신되어야 한다.', () => {
    const { result } = renderHook(() => ({ ...useProblem(), ...useModifyProblem() }));

    const newMockProblem = createMockProblem();

    act(() => {
      result.current.updateProblem(newMockProblem);
    });

    expect(result.current.problem?.number).toBe(newMockProblem.number);
  });

  it('동일한 문제번호 객체가 초기화 될 경우, 상태가 갱신되지 않고 내용만 업데이트 되어야 한다.', () => {
    const all = [];

    const { result } = renderHook(() => {
      const value = { ...useProblem(), ...useModifyProblem() };
      all.push(value);
      return value;
    });

    const sameNumberMockProblem = createMockProblem({ number: mockProblem.number });

    act(() => {
      result.current.updateProblem(sameNumberMockProblem);
    });

    expect(all.length).toBe(1);
    expect(result.current.problem?.name).toBe(mockProblem.name);
    expect(result.current.problem?.inputDesc).toBe(sameNumberMockProblem.inputDesc);
  });

  it('문제 객체가 null일 경우, null로 업데이트 되어야 한다.', () => {
    const { result } = renderHook(() => ({ ...useProblem(), ...useModifyProblem() }));

    act(() => {
      result.current.updateProblem(null);
    });

    expect(result.current.problem).toBe(null);
  });
});
