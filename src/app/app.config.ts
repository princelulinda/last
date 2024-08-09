import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AllGuards, AllServices, NonDiInterceptors } from './core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors(NonDiInterceptors)),
    provideHttpClient(withFetch()),
    AllServices,
    AllGuards,
  ],
};
