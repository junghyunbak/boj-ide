import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { createMockBookmark, createMockExtension, createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { isBookmarkTab, isExtensionTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { useTab } from '.';

const mockBookmark = createMockBookmark();
const mockExtension = createMockExtension();
const mockProblem1 = createMockProblem();
const mockProblem2 = createMockProblem();

describe('[커스텀 훅] 탭 요소 관리', () => {
  beforeEach(() => {
    useStore.getState().setProblemHistories(() => [mockProblem1, mockBookmark, mockExtension, mockProblem2]);
  });

  describe('탭 추가', () => {
    it('같은 문제가 존재하지 않을 경우, 맨 뒤에 문제가 추가되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const newMockTab = createMockProblem();

      act(() => {
        result.current.addProblemTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(5);
    });

    it('같은 문제가 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const updatedProblemName = '갱신된 문제 이름';
      const newMockTab = createMockProblem({ ...mockProblem1, name: updatedProblemName });

      act(() => {
        result.current.addProblemTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(4);
      expect(result.current.tabs.find((tab) => isProblemTab(tab) && tab.name === updatedProblemName)).not.toBe(
        undefined,
      );
    });

    it('같은 북마크가 존재하지 않을 경우, 맨 앞에 북마크가 추가되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const newMockTab = createMockBookmark();

      act(() => {
        result.current.addBookmarkTab(newMockTab);
      });

      const [tab] = result.current.tabs;

      expect(result.current.tabs.length).toBe(5);
      expect(isBookmarkTab(tab) && tab.url === newMockTab.url).toBe(true);
    });

    it('같은 북마크가 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const updatedBookmarkTitle = '갱신된 북마크 이름';
      const newMockTab = createMockBookmark({ ...mockBookmark, title: updatedBookmarkTitle });

      act(() => {
        result.current.addBookmarkTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(4);
      expect(result.current.tabs.find((tab) => isBookmarkTab(tab) && tab.title === updatedBookmarkTitle)).not.toBe(
        undefined,
      );
    });

    it('같은 크롬 익스텐션이 존재하지 않을 경우, 맨 앞에 익스텐션이 추가되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const newExtensionTab = createMockExtension({ type: 'otherExtensionType' });

      act(() => {
        result.current.addExtensionTab(newExtensionTab);
      });

      expect(result.current.tabs.length).toBe(5);
      expect(result.current.tabs.find((tab) => isExtensionTab(tab) && tab.id === newExtensionTab.id)).not.toBe(
        undefined,
      );
    });

    it('같은 크롬 익스텐션이 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const newExtensionTab = createMockExtension(mockExtension);

      act(() => {
        result.current.addExtensionTab(newExtensionTab);
      });

      expect(result.current.tabs.length).toBe(4);
      expect(result.current.tabs.find((tab) => isExtensionTab(tab) && tab.id === newExtensionTab.id)).not.toBe(
        undefined,
      );
    });
  });

  describe('탭 일부 삭제', () => {
    it('범위 내의 탭을 제거 할 경우, 삭제한 탭이 존재하지 않아야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const removeIdx = 1;
      const willRemovedTab = result.current.tabs[removeIdx];

      act(() => {
        result.current.removeTab(removeIdx, false);
      });

      expect(result.current.tabs.find((tab) => tab === willRemovedTab)).toBe(undefined);
    });

    it('범위 밖의 탭을 제거 할 경우, 탭 개수에 변화가 없어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const tabLength = result.current.tabs.length;
      const removeIdx = tabLength;

      act(() => {
        result.current.removeTab(removeIdx, false);
      });

      expect(result.current.tabs.length === tabLength).toBe(true);
    });
  });

  describe('탭 전체 삭제', () => {
    it('모든 문제 탭 만이 삭제되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      act(() => {
        result.current.clearTab();
      });

      expect(result.current.tabs.some(isProblemTab)).toBe(false);
    });
  });
});
