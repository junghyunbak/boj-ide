import { useCallback, useState } from 'react';

import { css } from '@emotion/react';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';

import { useEventIpc } from '@/renderer/hooks';

import { bytesToSize } from '@/renderer/utils';

export function AppUpdaterInfo() {
  const [updateInfo, setUpdateInfo] = useState('');

  useEventIpc(
    ({ data: { bytesPerSecond, percent, isDownloaded } }) => {
      if (isDownloaded) {
        setUpdateInfo('');
      } else {
        setUpdateInfo(`업데이트 다운로드 중... ${percent?.toFixed(1)}% (${bytesToSize(bytesPerSecond || 0)}/s)`);
      }
    },
    [],
    'app-update-info',
  );

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2rem 0.4rem;
      `}
    >
      <Text fontSize="0.875rem">{updateInfo}</Text>
    </div>
  );
}
