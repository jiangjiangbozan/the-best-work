import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ClazzService {

  constructor(private httpClient: HttpClient) { }

   // 获取当前登陆用户班级信息
   getCurrentClazzName(user_id: number): Observable<string> {
    return this.httpClient.post<string>('api/clazz/getCurrentClazzName', {user_id});
  }
  
  getClazzAndSchool(user_id?: number): Observable<[]> {
    return this.httpClient.post<[]>('api/clazz/getClazzAndSchool', {user_id});
  }
}
