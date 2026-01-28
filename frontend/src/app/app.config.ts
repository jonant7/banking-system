import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {serviceUrlInterceptor} from './core/interceptors/service-url.interceptor';
import {loadingInterceptor} from './core/interceptors/loading.interceptor';
import {errorInterceptor} from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        serviceUrlInterceptor,
        loadingInterceptor,
        errorInterceptor
      ])
    )
  ]
};
