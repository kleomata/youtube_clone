/*import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { AuthenticationService } from './authentication.service';
import { routes } from './app.routes';
import { provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthenticationService,
    provideZoneChangeDetection({ eventCoalescing: true }) // Regjistroni menaxhimin e ndjeshmërisë së ndryshimeve
  ]
};*/

import { ApplicationConfig, provideZoneChangeDetection/*importProvidersFrom*/ } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';

//import { AuthenticationService } from './authentication.service';
//import { TokenInterceptor } from './token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

//   importProvidersFrom( 
      provideRouter(routes), 
      provideClientHydration(),
      provideHttpClient(withFetch())
  // ),
    //{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    //AuthenticationService,
  ]
};
