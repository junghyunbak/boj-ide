import { act, useEffect, useRef } from 'react';

import { renderHook } from '@testing-library/react';

import { createMockProblem } from '@/renderer/mock';

import { useModifyProblem } from '.';
import { useProblem } from '../useProblem';

describe('[Custom Hooks] useProblem', () => {
  describe('동일한 문제번호 객체가 초기화', () => {
    it('기존 문제에 테스트케이스가 존재한다면, 상태가 갱신되지 않아야 한다.', () => {
      const all = [];

      const { result } = renderHook(() => {
        const value = { ...useProblem(), ...useModifyProblem() };
        all.push(value);
        return value;
      });

      const problem = createMockProblem();

      act(() => {
        result.current.updateProblem(problem);
      });

      const sameNumberProblem = createMockProblem({ number: problem.number });

      act(() => {
        result.current.updateProblem(sameNumberProblem);
      });

      expect(all.length).toBe(2);
      expect(result.current.problem?.name).toBe(sameNumberProblem.name);
      expect(result.current.problem?.inputDesc).toBe(sameNumberProblem.inputDesc);
    });

    /**
     * 테스트케이스가 존재하는 경우는 낙관적 UI Update를 위해 문제 번호만 존재하는 텅 빈 객체이기 때문.
     */
    it('기존 문제에 테스트케이스가 하나도 존재하지 않는다면, 상태가 갱신되어야 한다.', () => {
      const all: any[] = [];

      const { result } = renderHook(() => {
        const value = { ...useProblem(), ...useModifyProblem() };
        all.push(value);
        return value;
      });

      const optimisticProblem = createMockProblem({ testCase: { inputs: [], outputs: [] } });

      act(() => {
        result.current.updateProblem(optimisticProblem);
      });

      const newProblem = createMockProblem({ number: optimisticProblem.number });

      act(() => {
        result.current.updateProblem(newProblem);
      });

      expect(all.length).toBe(3);
    });
  });

  describe('동일하지 않은 문제번호 객체가 초기화', () => {
    it('기존 상태가 null 일 때, 새로운 객체로 변경되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useProblem(), ...useModifyProblem() }));

      act(() => {
        result.current.updateProblem(null);
      });

      const newProblem = createMockProblem();

      act(() => {
        result.current.updateProblem(newProblem);
      });

      expect(result.current.problem?.number).toBe(newProblem.number);
    });

    it('기존 상태가 문제 일 때, 새로운 객체로 변경되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useProblem(), ...useModifyProblem() }));

      const problem = createMockProblem();

      act(() => {
        result.current.updateProblem(problem);
      });

      const newProblem = createMockProblem();

      act(() => {
        result.current.updateProblem(newProblem);
      });

      expect(result.current.problem?.number).toBe(newProblem.number);
    });
  });

  describe('null로 객체가 초기화', () => {
    it('problem 상태가 null이 되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useProblem(), ...useModifyProblem() }));

      act(() => {
        result.current.updateProblem(null);
      });

      expect(result.current.problem).toBe(null);
    });
  });
});
