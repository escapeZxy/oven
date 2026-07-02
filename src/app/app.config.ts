import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { authInterceptor } from './auth/auth.interceptor';
import { routes } from './app.routes';
import { CORE_PROVIDERS } from './core.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    ...CORE_PROVIDERS,
  ],
};
