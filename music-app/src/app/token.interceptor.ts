/*import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthenticationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformBrowser(this.platformId)) {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }
    }
    return next.handle(req);
  }
}
*/