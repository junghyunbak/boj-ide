import { useEffect, useRef } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useWebview } from '@/renderer/hooks';

import { TabButton } from '@/renderer/components/atoms/buttons/TabButton';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';

interface BookmarkTabProps {
  bookmarkInfo: BookmarkInfo;
}

export function BookmarkTab({ bookmarkInfo }: BookmarkTabProps) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [webviewUrl] = useStore(useShallow((s) => [s.webviewUrl]));

  const { gotoUrl } = useWebview();

  const ref = useRef<HTMLButtonElement>(null);

  const isSelect = (() => {
    if (problem) {
      return false;
    }

    if (webviewUrl.startsWith(bookmarkInfo.url)) {
      return true;
    }

    return false;
  })();

  useEffect(() => {
    if (isSelect && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [isSelect]);

  const handleBookmarkItemClick = () => {
    gotoUrl(bookmarkInfo.url + (bookmarkInfo.path || ''));
  };

  return (
    <TabButton onClick={handleBookmarkItemClick} isSelect={isSelect} ref={ref}>
      <Text>{bookmarkInfo.title}</Text>
    </TabButton>
  );
}
