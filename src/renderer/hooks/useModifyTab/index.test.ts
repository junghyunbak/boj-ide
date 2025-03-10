import { act } from 'react';

import { renderHook } from '@testing-library/react';

import { createMockBookmark, createMockExtension, createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { isBookmarkTab, isExtensionTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { useModifyTab } from '.';
import { useTab } from '../useTab';

const mockBookmark = createMockBookmark();
const mockExtension = createMockExtension();
const mockProblem1 = createMockProblem();
const mockProblem2 = createMockProblem();

describe('[Custom Hooks] useTab', () => {
  beforeEach(() => {
    useStore.getState().setProblemHistories(() => [mockProblem1, mockBookmark, mockExtension, mockProblem2]);
  });

  describe('탭 추가', () => {
    it('같은 문제가 존재하지 않을 경우, 맨 뒤에 문제가 추가되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const newMockTab = createMockProblem();
      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.addProblemTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(tabLength + 1);
    });

    it('같은 문제가 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const updatedProblemName = '갱신된 문제 이름';
      const newMockTab = createMockProblem({ ...mockProblem1, name: updatedProblemName });
      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.addProblemTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(tabLength);
      expect(result.current.tabs.find((tab) => isProblemTab(tab) && tab.name === updatedProblemName)).not.toBe(
        undefined,
      );
    });

    it('같은 북마크가 존재하지 않을 경우, 맨 앞에 북마크가 추가되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const newMockTab = createMockBookmark();
      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.addBookmarkTab(newMockTab);
      });

      const [tab] = result.current.tabs;

      expect(result.current.tabs.length).toBe(tabLength + 1);
      expect(isBookmarkTab(tab) && tab.url === newMockTab.url).toBe(true);
    });

    it('같은 북마크가 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const updatedBookmarkTitle = '갱신된 북마크 이름';
      const newMockTab = createMockBookmark({ ...mockBookmark, title: updatedBookmarkTitle });
      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.addBookmarkTab(newMockTab);
      });

      expect(result.current.tabs.length).toBe(tabLength);
      expect(result.current.tabs.find((tab) => isBookmarkTab(tab) && tab.title === updatedBookmarkTitle)).not.toBe(
        undefined,
      );
    });

    it('같은 크롬 익스텐션이 존재하지 않을 경우, 맨 앞에 익스텐션이 추가되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const newExtensionTab = createMockExtension({ type: 'otherExtensionType' });
      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.addExtensionTab(newExtensionTab);
      });

      expect(result.current.tabs.length).toBe(tabLength + 1);
      expect(result.current.tabs.find((tab) => isExtensionTab(tab) && tab.id === newExtensionTab.id)).not.toBe(
        undefined,
      );
    });

    it('같은 크롬 익스텐션이 존재 할 경우, 데이터만 갱신되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const newExtensionTab = createMockExtension(mockExtension);
      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.addExtensionTab(newExtensionTab);
      });

      expect(result.current.tabs.length).toBe(tabLength);
      expect(result.current.tabs.find((tab) => isExtensionTab(tab) && tab.id === newExtensionTab.id)).not.toBe(
        undefined,
      );
    });
  });

  describe('탭 일부 삭제', () => {
    it('범위 내의 탭을 제거 할 경우, 삭제한 탭이 존재하지 않아야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const removeIdx = 1;
      const willRemovedTab = result.current.tabs[removeIdx];

      act(() => {
        result.current.removeTab(removeIdx, false);
      });

      expect(result.current.tabs.find((tab) => tab === willRemovedTab)).toBe(undefined);
    });

    it('범위 밖의 탭을 제거 할 경우, 탭 개수에 변화가 없어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

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
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.clearTab();
      });

      expect(result.current.tabs.length).toBe(tabLength - 2);
      expect(result.current.tabs.some(isProblemTab)).toBe(false);
    });
  });

  describe('탭 순서 변경', () => {
    /**
     *      [ 1 ● 3 4 ]
     * dest    ^
     *
     *      [ 1 3 4 ]
     *      [ 1 ● 3 4 ]
     * ------------------
     *      [ 1 ● 3 4 ]
     * dest      ^
     *
     *      [ 1 3 4 ]
     *      [ 1 ● 3 4 ]
     */
    it('제자리로 위치를 변경할 경우, 상태변경이 일어나지 않아야 한다.', () => {
      const all = [];

      const { result } = renderHook(() => {
        const value = { ...useTab(), ...useModifyTab() };
        all.push(value);
        return value;
      });

      const src = 1;
      const dest = 1;

      act(() => {
        result.current.reorderTab(1, 1);
        result.current.reorderTab(1, 2);

        result.current.reorderTab(src, dest + 1);
      });

      expect(all.length).toBe(1);
    });

    /**
     *      [ 1 ● 3 4 ]
     * dest  ^
     *
     *      [ 1 3 4 ]
     *      [ ● 1 3 4 ]
     */
    it('맨 앞으로 위치를 변경한 경우, 순서가 올바르게 변경되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const srcIdx = 1;
      const destIdx = 0;
      const target = result.current.tabs[srcIdx];

      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.reorderTab(srcIdx, destIdx);
      });

      expect(result.current.tabs.length).toBe(tabLength);
      expect(result.current.tabs[destIdx] === target).toBe(true);
    });

    /*
     *      [ 1 ● 3 4 ]
     * dest          ^
     *
     *      [ 1 3 4 ]
     *      [ 1 3 4 ● ]
     */
    it('맨 뒤로 위치를 변경한 경우, 순서가 올바르게 변경되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTab(), ...useModifyTab() }));

      const srcIdx = 1;
      const destIdx = 4;
      const target = result.current.tabs[srcIdx];

      const tabLength = result.current.tabs.length;

      act(() => {
        result.current.reorderTab(srcIdx, destIdx);
      });

      expect(result.current.tabs.length).toBe(tabLength);
      expect(result.current.tabs[result.current.tabs.length - 1] === target).toBe(true);
    });
  });
});
