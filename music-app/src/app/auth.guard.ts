/*import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
*/

/*import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
//import { AuthenticationService } from './authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  //const authenticationService = inject(AuthenticationService)

  // Kontrollo nëse je në klient (në shfletues)
  if (isPlatformBrowser(platformId)) {
    //const isAuthenticated = !!localStorage.getItem('authToken');
    //const isAuthenticated = !!authenticationService.getToken();

    //if (!isAuthenticated) {
      //router.navigate(['/login']);
      //return false;
    //}

    return true;
  }

  // Nëse je në server, kthe true ose një rezultat të përshtatshëm tjetër
  // Në këtë rast, thjesht kthe true për të vazhduar
  return true;
};*/

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService =  inject(AuthService)
  const router = inject(Router)
  
  const isAuthenticated = !!authService.getToken();

  if(!isAuthenticated) {
    router.navigate(['/login'])
    return false
  }

  return true


};
