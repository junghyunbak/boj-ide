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

export function IpcErrorHandler<T extends Electron.IpcMainEvent | Electron.IpcMainInvokeEvent>(
  channel: string,
  listener: (e: T, ...args: any[]) => Promise<any> | any,
  send: Ipc['send'],
) {
  return async (e: T, ...args: any[]): Promise<any> => {
    try {
      const result = listener(e, ...args);

      if (result instanceof Promise) {
        return await result;
      }

      return result;
    } catch (err) {
      if (err instanceof Error) {
        send(e.sender, 'judge-reset', undefined);
        send(e.sender, 'occur-error', { data: { message: err.message } });

        const isProd = process.env.NODE_ENV === 'production';

        if (err instanceof IpcError && err.errorType !== 'personal' && isProd) {
          return null;
        }

        if (isProd) {
          sentryErrorHandler(err);
        }
      }

      return null;
    }
  };
}
