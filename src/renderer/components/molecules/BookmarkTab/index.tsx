import { TabButton } from '@/renderer/components/atoms/buttons/TabButton';
import { useWebviewRoute } from '@/renderer/hooks';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

interface BookmarkTabProps {
  bookmarkInfo: BookmarkInfo;
}

export function BookmarkTab({ bookmarkInfo }: BookmarkTabProps) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [webviewUrl] = useStore(useShallow((s) => [s.webviewUrl]));

  const { gotoUrl } = useWebviewRoute();

  const handleBookmarkItemClick = () => {
    gotoUrl(bookmarkInfo.url + (bookmarkInfo.path || ''));
  };

  const isSelect = (() => {
    if (problem) {
      return false;
    }

    if (webviewUrl.startsWith(bookmarkInfo.url)) {
      return true;
    }

    return false;
  })();

  return (
    <TabButton onClick={handleBookmarkItemClick} isSelect={isSelect}>
      {bookmarkInfo.title}
    </TabButton>
  );
}
