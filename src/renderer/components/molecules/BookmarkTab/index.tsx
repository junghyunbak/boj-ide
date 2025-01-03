import { TabButton } from '@/renderer/components/atoms/buttons/TabButton';
import { useWebview } from '@/renderer/hooks';
import { useStore } from '@/renderer/store';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

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
      {bookmarkInfo.title}
    </TabButton>
  );
}
