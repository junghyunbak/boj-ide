import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { createMockBookmark, createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { isBookmarkTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { useTab } from '.';

const mockHttpBookmark = createMockBookmark();
const mockChromeExtensionBookmark = createMockBookmark({ url: 'chrome-extension://extensionId' });
const mockProblem1 = createMockProblem();
const mockProblem2 = createMockProblem();

describe('[커스텀 훅] 탭 요소 관리', () => {
  beforeEach(() => {
    useStore
      .getState()
      .setProblemHistories(() => [mockProblem1, mockHttpBookmark, mockChromeExtensionBookmark, mockProblem2]);
  });

  describe('탭 추가', () => {
    it('같은 문제가 존재하지 않을 경우, 맨 뒤에 문제가 추가되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const newMockTab = createMockProblem();

      act(() => {
        result.current.addTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(5);
    });

    it('같은 문제가 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const updatedProblemName = '갱신된 문제 이름';
      const newMockTab = createMockProblem({ ...mockProblem1, name: updatedProblemName });

      act(() => {
        result.current.addTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(4);
      expect(result.current.tabs.filter(isProblemTab).some((tab) => tab.name === updatedProblemName)).toBe(true);
    });

    it('같은 북마크가 존재하지 않을 경우, 맨 앞에 북마크가 추가되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const newMockTab = createMockBookmark();

      act(() => {
        result.current.addTab(newMockTab);
      });

      const [tab] = result.current.tabs;

      expect(result.current.tabs.length).toBe(5);
      expect(isBookmarkTab(tab) && tab.url === newMockTab.url).toBe(true);
    });

    it('같은 북마크가 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const updatedBookmarkTitle = '갱신된 북마크 이름';
      const newMockTab = createMockBookmark({ ...mockHttpBookmark, title: updatedBookmarkTitle });

      act(() => {
        result.current.addTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(4);
      expect(result.current.tabs.filter(isBookmarkTab).some((tab) => tab.title === updatedBookmarkTitle)).toBe(true);
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

      expect(result.current.tabs.some((tab) => tab === willRemovedTab)).toBe(false);
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
    it('북마크 탭을 제외한 모든 문제 탭이 삭제되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      act(() => {
        result.current.clearTab();
      });

      expect(result.current.tabs.some(isProblemTab)).toBe(false);
    });
  });

  describe('크롬 익스텐션 탭', () => {
    it('크롬 익스텐션 북마크가 존재하지 않을 경우, 맨 앞에 북마크가 추가되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const chromeExtensionIdx = result.current.tabs.findIndex(
        (tab) => isBookmarkTab(tab) && tab.url.startsWith('chrome-extension:'),
      );

      act(() => {
        result.current.removeTab(chromeExtensionIdx, false);
      });

      const newChromeExtensionBookmark = createMockBookmark({ url: 'chrome-extension://newExtensionId' });

      act(() => {
        result.current.addTab(newChromeExtensionBookmark);
      });

      expect(result.current.tabs.length).toBe(4);
      expect(result.current.tabs.some((tab) => isBookmarkTab(tab) && tab.url.startsWith('chrome-extension:'))).toBe(
        true,
      );
    });

    /**
     * 현재로선 '백준 허브' 확장 프로그램 하나이므로 유일하게만 갱신되도록 구현 및 테스트
     */
    it('같은 크롬 익스텐션 북마크가 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => useTab());

      const chromeExtensionUrl = 'chrome-extension://updatedExtensionId';
      const newMockTab = createMockBookmark({ url: chromeExtensionUrl });

      act(() => {
        result.current.addTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(4);
      expect(result.current.tabs.filter(isBookmarkTab).some((tab) => tab.url === chromeExtensionUrl)).toBe(true);
    });
  });
});
