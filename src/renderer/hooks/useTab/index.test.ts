import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { useTab } from '.';

describe('[커스텀 훅] 탭 요소 관리', () => {
  beforeEach(() => {
    useStore.getState().setProblemHistories(() => [createMockProblem(), createMockProblem()]);
  });

  describe('탭 요소 추가', () => {
    it('존재하지 않는 탭을 추가 할 경우, 마지막에 요소가 추가되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const newMockTab = createMockProblem();

      act(() => {
        result.current.addTab(newMockTab);
      });

      expect(result.current.tabs.length === 3).toBe(true);
    });

    it('이미 존재하는 탭을 추가 할 경우, 무시되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const newMockTab = createMockProblem();

      act(() => {
        result.current.addTab(newMockTab);
        result.current.addTab(newMockTab);
      });

      expect(result.current.tabs.length === 3).toBe(true);
    });
  });

  describe('탭 요소 삭제', () => {
    describe('탭 개수 === 1', () => {
      beforeEach(() => {
        useStore.getState().setProblemHistories(() => [createMockProblem()]);
      });

      it('탭이 삭제 될 경우, null를 반환한다.', () => {
        const { result } = renderHook(() => useTab());

        let nextTab: ProblemInfo | null = null;

        act(() => {
          nextTab = result.current.removeTab(0);
        });

        expect(nextTab === null).toBe(true);
        expect(result.current.tabs.length === 0).toBe(true);
      });
    });

    describe('탭 개수 >= 2', () => {
      beforeEach(() => {
        useStore.getState().setProblemHistories(() => [createMockProblem(), createMockProblem(), createMockProblem()]);
      });

      it('마지막 탭을 삭제할 경우, 탭 크기가 1줄고 마지막 탭 정보를 반환한다.', () => {
        const { result } = renderHook(() => useTab());

        const prevTabLength = result.current.tabs.length;
        const removeTabIdx = prevTabLength - 1;
        const nextTabAfterRemoved = result.current.tabs[prevTabLength - 2];

        let nextTab: ProblemInfo | null = null;

        act(() => {
          nextTab = result.current.removeTab(removeTabIdx);
        });

        expect(result.current.tabs.length === prevTabLength - 1 && nextTab === nextTabAfterRemoved).toBe(true);
      });

      it('마지막이 아닌 탭을 삭제할 경우, 탭 크기가 1줄고 삭제한 요소 다음 탭 정보를 반환한다.', () => {
        const { result } = renderHook(() => useTab());

        const prevTabLength = result.current.tabs.length;
        const removeTabIdx = 1;
        const nextTabAfterRemoved = result.current.tabs[removeTabIdx + 1];

        let nextTab: ProblemInfo | null = null;

        act(() => {
          nextTab = result.current.removeTab(removeTabIdx);
        });

        expect(result.current.tabs.length === prevTabLength - 1 && nextTab === nextTabAfterRemoved).toBe(true);
      });
    });
  });
});
