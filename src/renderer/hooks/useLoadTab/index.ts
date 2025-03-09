import { useEffect, useMemo } from 'react';

import { BOJ_DOMAIN, SOLVED_AC_DOMAIN } from '@/common/constants';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { baekjoonhubLogo, baekjoonLogo, solvedACLogo } from '@/renderer/assets/base64Images';

import { useModifyTab } from '../useModifyTab';

export function useLoadTab() {
  const [baekjoonhubExtensionId] = useStore(useShallow((s) => [s.baekjoonhubExtensionId]));

  const { addBookmarkTab, addExtensionTab } = useModifyTab();

  const bookmarks = useMemo<BookmarkInfo[]>(() => {
    return [
      {
        url: `https://${BOJ_DOMAIN}`,
        title: '백준',
        path: '/search',
        logoImgBase64: baekjoonLogo,
      },
      {
        url: `https://${SOLVED_AC_DOMAIN}`,
        title: 'solved.ac',
        logoImgBase64: solvedACLogo,
      },
    ];
  }, []);

  /**
   * [탭을 동적으로 추가하는 이유]
   *
   * 탭 전역 상태가 zustand persist에 의해 로컬 스토리지와 동기화 되어있기 때문에,
   * 전역 상태의 초기값을 변경하는 것으로는 기존 사용자들의 탭 데이터를 변화시킬 수 없기 때문.
   *
   * 기존 사용자들의 탭 상태를 유지하면서도 초기값으로 추가할 수 있는 방법을 찾는 중.
   */
  useEffect(() => {
    bookmarks.forEach((bookmark) => {
      addBookmarkTab(bookmark);
    });
  }, [bookmarks, addBookmarkTab]);

  useEffect(() => {
    if (typeof baekjoonhubExtensionId !== 'string') {
      return;
    }

    addExtensionTab({
      type: 'baekjoonhub',
      id: baekjoonhubExtensionId,
      title: '백준 허브',
      path: '/popup.html',
      logoImgBase64: baekjoonhubLogo,
    });
  }, [baekjoonhubExtensionId, addExtensionTab]);
}
