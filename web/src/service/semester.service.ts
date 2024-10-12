import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  constructor(private httpClient: HttpClient) { }

  getSemsters(user_id: number): Observable<any> {
    return this.httpClient.post<any>('/api/semester/getSemsters', {user_id})
  }

  // 获取当前登陆用户当前日期的学期信息
  getCurrentSemesterId(user_id: number): Observable<number> {
    return this.httpClient.post<number>('api/semester/getCurrentSemesterId', {user_id})
  }
}
