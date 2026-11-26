import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { FlaggedPreloading } from './feature-tests/preload-flagged';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(FlaggedPreloading)),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
  ],
};
