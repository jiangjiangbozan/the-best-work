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

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>('/api/index/login', {username, password})
    .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Something went wrong')); 
  }
}
