import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../entity/user';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    return this.httpClient.post(`${'/api/index/profile'}/changePassword`, {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
  }

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>('/api/index/login', {username, password})
    .pipe(
      catchError((error: HttpErrorResponse ) => {
        return this.handleError(error);
      }));
  }


  private handleError(error: HttpErrorResponse): Observable<any> {
    let errors = {
      detail : '',
      status : 500,
    };
    if(!error.error){
      errors.detail = error.message;
      errors.status = error.status;
    }else if(error.status === 401){
      errors.detail = '状态码为401的报错信息';
    }else{
      errors = error.error;
    }
    return throwError(errors);
  }
}
