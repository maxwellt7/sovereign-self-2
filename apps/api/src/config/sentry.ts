import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import config from './index.js';

export function initSentry() {
  if (config.sentry.dsn) {
    Sentry.init({
      dsn: config.sentry.dsn,
      environment: config.nodeEnv,
      integrations: [
        new ProfilingIntegration(),
      ],
      tracesSampleRate: config.nodeEnv === 'production' ? 0.1 : 1.0,
      profilesSampleRate: config.nodeEnv === 'production' ? 0.1 : 1.0,
    });

    console.log('✅ Sentry initialized');
  } else {
    console.log('⚠️  Sentry DSN not configured');
  }
}

export { Sentry };

