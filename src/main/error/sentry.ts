import * as Sentry from '@sentry/node';

export const sentryErrorHandler = (err: Error) => {
  Sentry.captureException(err);
};
