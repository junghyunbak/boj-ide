import { RELEASE_VERSION } from '@/common/constants';

import * as Sentry from '@sentry/node';

import { type SeverityLevel } from '@sentry/node';

export const sentryErrorHandler = (err: Error) => {
  Sentry.captureException(err, {
    tags: {
      version: RELEASE_VERSION,
    },
  });
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

  const { tags, ...other } = scopeContext;

  Sentry.captureMessage(message, {
    ...other,
    level: 'log',
    tags: {
      ...tags,
      version: RELEASE_VERSION,
    },
  });
};
