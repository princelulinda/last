import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

import {
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
  withInterceptors,
} from '@angular/common/http';

import { AllGuards, AllServices, NonDiInterceptors } from './core';
import { HTTPEncryptInterceptor } from './core/interceptors/http-encrypt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(
      withInterceptors(NonDiInterceptors),
      // DI-based interceptors must be explicitly enabled.
      withInterceptorsFromDi()
    ),
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HTTPEncryptInterceptor,
        multi: true,
      },
    ],

    provideHttpClient(withFetch()),
    AllServices,
    AllGuards,
  ],
};
