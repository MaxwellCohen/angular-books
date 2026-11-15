import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { HttpBackend } from '@angular/common/http';
import { ServerApiBackend } from '../server/server-api-backend';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    ServerApiBackend,
    { provide: HttpBackend, useExisting: ServerApiBackend },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
