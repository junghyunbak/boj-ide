/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useIpcEvent<T extends ClientChannels>(
  func: (message: ChannelToMessage[T]) => void,
  deps: unknown[],
  channel: T,
) {
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(channel, func);

    return cleanup;
  }, [...deps]);
}
