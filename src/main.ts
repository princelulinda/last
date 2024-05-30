import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

import * as Sentry from '@sentry/angular';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.bbs';

if (environment.sentryDsn) {
  Sentry.init({
    dsn: environment.sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
      Sentry.dedupeIntegration(),
      //   Sentry.metrics.metricsAggregatorIntegration()
    ],
    tracesSampleRate: environment.sentryTraceRate,
    tracePropagationTargets: environment.sentryTargetUrls,
    profilesSampleRate: environment.sentryTraceRate,
    beforeSend(event) {
      if (
        event.request?.url?.includes('localhost') ||
        event.request?.url?.includes('127.0.0.1')
      ) {
        return null;
      }
      return event;
    },
  });
}

if (environment.production) {
  enableProdMode();

  // disable some console on production
  console.log = () => {
    // void
  };
  console.info = () => {
    //void
  };
}

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
