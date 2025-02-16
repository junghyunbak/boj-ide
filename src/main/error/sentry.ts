import * as Sentry from '@sentry/node';

import { type SeverityLevel } from '@sentry/node';

export const sentryErrorHandler = (err: Error) => {
  Sentry.captureException(err);
};

export const sentryLogging = (
  message: string,
  scopeContext: Exclude<
    Exclude<Exclude<ExtractParams<typeof Sentry.captureMessage>[1], SeverityLevel>, Sentry.Scope>,
    (scope: Sentry.Scope) => Sentry.Scope
  > = {},
) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  Sentry.captureMessage(message, {
    ...scopeContext,
    level: 'log',
  });
};
