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

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post<any>('/api/index/login', {username, password})
  }

  isLogin(): Observable<any> {
    return this.httpClient.get<any>('api/index/isLogin');
  }

  logout(): Observable<any> {
    return this.httpClient.get<any>('api/index/logout');
  }

  
  getCuurentUser(user_id: number): Observable<any> {
    return this.httpClient.post('/api/user/getCuurentUser', {user_id})
  }

  getUser(user_id: number): Observable<any> {
    return this.httpClient.post('/api/user/getUser', {user_id})
  }

  getUserRole(): Observable<any> {
    return this.httpClient.get('/api/index/getUserRole');
  }
  getUsers(pageData?: {
    name: string,
    clazz_id: number,
    role: number,
    currentPage: number,
    size: number
  }): Observable<any> {
    return this.httpClient.post('/api/user/getUsers', {pageData})
  }

  searchUsers(data = {
    name: '',
    clazz_id: 2,
    role: 0,
    currentPage: 1,
    size: 5
  }): Observable<any> {
    return this.httpClient.post('/api/user/searchUsers', {data})
  }

  addUser(user: {
    name: string,
    username: string,
    clazz_id: number,
    role: number
  }): Observable<any> {
    return this.httpClient.put<any>('/api/user/addUser', {user})
  }

  deleteUser(user_id: number): Observable<any> {
    return this.httpClient.put('/api/user/deleteUser/',{user_id})
  }

  changeStatus(user_id: number, changeStatus: number): Observable<any> {
    return this.httpClient.put('/api/user/changeStatus/',{user_id, changeStatus})
  }

  updateUser(user = {
    id: 0,
    username :  '',
    name: '',
    clazz_id: 0,
    role : 0
  }): Observable<any> {
    return this.httpClient.put('/api/user/updateUser/',{user})
  }

  resetPassword(userId: number): Observable<any> {
    return this.httpClient.post(`/api/user/resetPassword?id=${userId}`, {userId});
  }

}
