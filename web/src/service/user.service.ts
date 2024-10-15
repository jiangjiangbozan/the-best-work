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

  getUsers(): Observable<any> {
    return this.httpClient.get<any[]>('/api/personalCenter/getUserList');
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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
