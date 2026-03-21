import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://d4ef355c7e2556b30e843b5e04e5028d@o313782.ingest.sentry.io/4505799509540864',
});

export async function logToSentry(error: Error, delayFlush = false) {
  Sentry.captureException(error);
  if (!delayFlush) {
    await Sentry.flush(1000);
  }
}

export async function flushToSentry() {
  await Sentry.flush(1000);
}
