type IpcErrorType = 'build-error';

export class IpcError extends Error {
  errorType: IpcErrorType;

  constructor(message: string, errorType: IpcErrorType) {
    super(message);

    this.errorType = errorType;
  }
}
