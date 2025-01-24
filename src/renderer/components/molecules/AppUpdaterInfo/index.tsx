import { css } from '@emotion/react';

import { useEffect, useState } from 'react';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';

export function AppUpdaterInfo() {
  const [updateInfo, setUpdateInfo] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.on('app-update-info', ({ data: { bytesPerSecond, percent, isDownloaded } }) => {
      if (isDownloaded) {
        setUpdateInfo('');
      } else {
        setUpdateInfo(`다운로드 중... ${percent}% (${bytesPerSecond}B/s)`);
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('app-update-info');
    };
  }, []);

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
