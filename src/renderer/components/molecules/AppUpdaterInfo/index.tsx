import { css } from '@emotion/react';

import { useEffect, useState } from 'react';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';

// https://gist.github.com/lanqy/5193417?permalink_comment_id=4225701#gistcomment-4225701
function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

export function AppUpdaterInfo() {
  const [updateInfo, setUpdateInfo] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.on('app-update-info', ({ data: { bytesPerSecond, percent, isDownloaded } }) => {
      if (isDownloaded) {
        setUpdateInfo('');
      } else {
        setUpdateInfo(`업데이트 다운로드 중... ${percent?.toFixed(1)}% (${bytesToSize(bytesPerSecond || 0)}/s)`);
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
