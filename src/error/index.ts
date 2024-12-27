// eslint-disable-next-line max-classes-per-file
import * as Sentry from '@sentry/node';

type IpcErrorType = 'personal' | 'system';

export class IpcError extends Error {
  errorType: IpcErrorType;

  constructor(message: string, errorType: IpcErrorType) {
    super(message);

    this.errorType = errorType;
  }
}

export class SubmitError extends IpcError {
  private _id: string;

  constructor(message: string, errorType: IpcErrorType, id: string) {
    super(message, errorType);
    this._id = id;
  }

  get id() {
    return this._id;
  }
}

export const sentryErrorHandler = (err: Error) => {
  Sentry.captureException(err);
};
