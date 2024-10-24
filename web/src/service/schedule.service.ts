import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(
    private httpClient: HttpClient
  ) { }

  //获取当前星期的星期一日期的字符串
  getFirstDayOfCurrentWeek(date: ''): Observable<any> {
    return this.httpClient.post<any>('/api/Schedule/getfirstDayOfCurrentWeek', {date})
  }

  getUnbusyStudentsOfCurrentWeek(date: ''): Observable<any> {
    return this.httpClient.post<any>('/api/Schedule/getUnbusyStudentsOfCurrentWeek', {date})
  }
}
