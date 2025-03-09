/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useEventIpc<T extends ClientChannels>(
  func: (message: ChannelToMessage[T][0]) => void,
  deps: unknown[],
  channel: T,
) {
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on(channel, func);

    return cleanup;
  }, [...deps]);
}
