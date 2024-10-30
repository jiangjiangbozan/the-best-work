import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponseBase
} from '@angular/common/http';
import { Observable } from 'rxjs';
 import {tap} from 'rxjs/operators';
@Injectable()
export class XAuthTokenInterceptor implements HttpInterceptor {

  private token = window.sessionStorage.getItem('x-auth-token');

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
 
    if(this.token !== null) {
      
      request = request.clone({setHeaders: {'x-auth-token': this.token}});
    }
    return next.handle(request).pipe(tap(input => {
      if(input instanceof HttpResponseBase) {
        const httpHeader = input.headers;
        const XAuthToken = httpHeader.get('x-auth-token');
        if(XAuthToken !== null){
          this.setToken(XAuthToken);
        }
      }
    }));
  }

  setToken(token: string) {
    if(this.token !== token)  {
      this.token = token;
      window.sessionStorage.setItem('x-auth-token', token);
    }
  }
}
