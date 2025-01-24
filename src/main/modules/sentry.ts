import * as Sentry from '@sentry/node';

export class SentryService {
  static init() {
    Sentry.init({
      dsn: 'https://261d50b928f05be5ce5cc591544f3309@o4508379534458880.ingest.us.sentry.io/4508379538653184',
    });
  }
}
