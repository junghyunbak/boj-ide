/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useIpcEvent<T extends ClientChannels>(
  channel: T,
  func: (message: ChannelToMessage[T]) => void,
  deps: unknown[],
) {
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(channel, func);

    return cleanup;
  }, [...deps]);
}
