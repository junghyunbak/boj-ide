import { type Ipc } from '@/main/utils';
import { sentryErrorHandler } from './sentry';

type IpcErrorType = 'personal' | 'system';

export class IpcError extends Error {
  errorType: IpcErrorType;

  constructor(message: string, errorType: IpcErrorType) {
    super(message);

    this.errorType = errorType;
  }
}

export function IpcErrorHandler<
  Channel extends ElectronChannels,
  Event extends Electron.IpcMainEvent | Electron.IpcMainInvokeEvent,
>(
  channel: Channel,
  listener: (
    e: Event,
    message: MessageTemplate<ChannelToMessage[Channel][Send]>,
  ) => Event extends Electron.IpcMainEvent ? void : Promise<MessageTemplate<ChannelToMessage[Channel][Receive]>>,
  send: Ipc['send'],
) {
  return async (
    e: Event,
    message: MessageTemplate<ChannelToMessage[Channel][Send]>,
  ): Promise<MessageTemplate<ChannelToMessage[Channel][Receive]> | null> => {
    try {
      const result = listener(e, message);

      if (result instanceof Promise) {
        return await result;
      }

      return null;
    } catch (err) {
      if (err instanceof Error) {
        send(e.sender, 'judge-reset', { data: undefined });
        send(e.sender, 'occur-error', { data: { message: err.message } });

        if (err instanceof IpcError && err.errorType === 'personal') {
          return null;
        }

        if (process.env.NODE_ENV === 'production') {
          sentryErrorHandler(err);
        }
      }

      return null;
    }
  };
}
