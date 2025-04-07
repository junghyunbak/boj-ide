/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useEventIpc<T extends ClientChannels>(
  func: (message: MessageTemplate<ChannelToMessage[T][Send]>) => void,
  deps: unknown[],
  channel: T,
) {
  useEffect(() => {
    const cleanup = window.electron.ipcRenderer.on<T>(channel, func);

    return cleanup;
  }, [...deps]);
}
