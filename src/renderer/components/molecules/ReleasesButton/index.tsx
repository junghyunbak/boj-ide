import { useCallback } from 'react';

import { RELEASE_VERSION } from '@/common/constants';

import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';

export function ReleasesButton() {
  const handleReleaseButtonClick = useCallback(() => {
    window.open('https://github.com/junghyunbak/boj-ide/releases', '_blank');
  }, []);

  return <TransparentButton onClick={handleReleaseButtonClick} size="small">{`v${RELEASE_VERSION}`}</TransparentButton>;
}
