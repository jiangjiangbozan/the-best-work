import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../entity/user';
import {forkJoin, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>('/api/index/login', {username, password})
    .pipe(
      catchError((error: HttpErrorResponse ) => {
        return this.handleError(error);
      }));
  }

  isLogin(): Observable<any> {
    return this.httpClient.get<any>('api/index/isLogin');
  }

  logout(): Observable<any> {
    return this.httpClient.get<any>('api/index/logout');
  }

  getUserInfo(): Observable<any> {
    return this.httpClient.get('/api/personalCenter/getUserInfo');
  }

  getAllUserInfo(): Observable<any> {
    return forkJoin({
      userInfo: this.getUserInfo(),
      userList: this.getUsers()
    });
  }

  changePassword(formData: any): Observable<any> {
    return this.httpClient.post('/api/personalCenter/changePassword', formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<any> {
    return this.httpClient.get('/api/user/getUsers')
  }

  searchUsers(data = {
    name: '',
    clazz_id: 2,
    role: 0
  }): Observable<any> {
    return this.httpClient.post('/api/user/searchUsers', {data})
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    let errors = {
      detail: '',
      status: 500,
    };
    if (!error.error) {
      errors.detail = error.message;
      errors.status = error.status;
    } else if (error.status === 401) {
      errors.detail = '状态码为401的报错信息';
    } else {
      errors = error.error;
    }
    return throwError(errors);
  }

}
