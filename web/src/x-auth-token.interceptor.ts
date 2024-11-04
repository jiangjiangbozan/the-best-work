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

 

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = window.sessionStorage.getItem('x-auth-token');
    if(token !== null) {
      request = request.clone({setHeaders: {'x-auth-token': token}});
      console.log('拦截器');
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

  setToken(XAuthToken: string) {
    let token = window.sessionStorage.getItem('x-auth-token');
    if(token !== XAuthToken)  {
      token = XAuthToken;
      window.sessionStorage.setItem('x-auth-token', token);
    }
  }
}
