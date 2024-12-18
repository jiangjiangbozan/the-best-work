import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  constructor(private httpClient: HttpClient) { }
  //获取当前用户所在班级的所有学期
  getSemsters(user_id: number): Observable<any> {
    return this.httpClient.post<any>('/api/semester/getSemsters', {user_id})
  }

  //获取当前页面的学期信息
  getSemster(semester_id: number): Observable<any> {
    return this.httpClient.post<any>('/api/semester/getSemster', {semester_id})
  }

  // 获取当前登陆用户当前日期的学期信息
  getCurrentSemesterId(user_id: number): Observable<number> {
    return this.httpClient.post<number>('api/semester/getCurrentSemesterId', {user_id})
  }

  //获取所有学期列表
  getAllSemsters(): Observable<any> {
    return this.httpClient.get<any>('/api/semester/getAllSemsters')
  }

  getCurrentSemesterTotalWeek(semesterId: number): Observable<number> {
    return this.httpClient.post<number>('api/semester/getCurrentSemesterTotalWeek', {semesterId})
  }
  //查询学期列表
  searchSemsters(data = {
    school_id: 0,
    semester_name: '',
    currentPage: 1,
    size: 5
  }): Observable<any> {
    return this.httpClient.post<any>('/api/semester/searchSemsters', {data})
  }

   //增加学期列表
   addSemster(data = {
    end_time: '',
    start_time: '',
    school_id: 0,
    semester_name: ''
  }): Observable<any> {
    return this.httpClient.post<any>('/api/semester/addSemester', {data})
  }

     //增加学期列表
     updateSemster(data = {
      id: 0,
      end_time: '',
      start_time: '',
      school_id: 0,
      semester_name: ''
    }): Observable<any> {
      return this.httpClient.post<any>('/api/semester/updateSemster', {data})
    }

    //删除学期
    delectSemster(id: number): Observable<any> {
      return this.httpClient.post<any>('/api/semester/delectSemster', {id})
    }

}
