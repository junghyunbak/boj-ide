import * as Sentry from '@sentry/node';

type IpcErrorType = 'personal' | 'system';

export class IpcError extends Error {
  errorType: IpcErrorType;

  constructor(message: string, errorType: IpcErrorType) {
    super(message);

    this.errorType = errorType;
  }
}

export const sentryErrorHandler = (err: Error) => {
  Sentry.captureException(err);
};
