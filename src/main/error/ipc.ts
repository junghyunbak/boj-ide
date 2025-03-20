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
  ListenerReturnValue = Event extends Electron.IpcMainEvent ? void : Promise<ChannelToMessage[Channel][Receive]>,
>(
  channel: Channel,
  listener: (e: Event, message: ChannelToMessage[Channel][Send]) => ListenerReturnValue,
  send: Ipc['send'],
) {
  return (e: Event, message: ChannelToMessage[Channel][Send]): ListenerReturnValue | null => {
    try {
      const result = listener(e, message);

      return result;
    } catch (err) {
      if (err instanceof Error) {
        send(e.sender, 'judge-reset', undefined);
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
